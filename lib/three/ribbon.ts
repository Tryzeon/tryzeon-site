import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Curve,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshPhysicalMaterial,
  Vector3,
} from 'three';
import { runStage, type StageContext, type StageScene } from '@/lib/three/stage';

export interface RibbonOptions {
  /** 外部提供 0..1 的捲動進度（區塊內），用來轉動緞帶 */
  progress?: () => number;
  pointerArea?: HTMLElement | null;
  onReady?: () => void;
}

/** 三葉結：正面看是三個瓣，一瓣朝上——就是 Tryzeon 標誌那條緞帶的形狀 */
class TrefoilCurve extends Curve<Vector3> {
  constructor(private readonly scale = 1) {
    super();
  }

  getPoint(u: number, target = new Vector3()): Vector3 {
    const t = u * Math.PI * 2;
    const x = Math.sin(t) + 2 * Math.sin(2 * t);
    const y = Math.cos(t) - 2 * Math.cos(2 * t);
    const z = -Math.sin(3 * t);
    // 轉 180°，讓 t=π 那一瓣朝上
    return target.set(-x, -y, z * 1.1).multiplyScalar(this.scale);
  }
}

/**
 * 沿曲線長出一條扁平緞帶：每個取樣點用 Frenet frame 決定寬度方向，
 * 並沿路徑扭轉；橫向切幾格，讓 shader 能把緞帶邊緣吹出波紋。
 */
function ribbonGeometry(curve: Curve<Vector3>, segments: number, across: number, width: number, twists: number) {
  const frames = curve.computeFrenetFrames(segments, true);
  const count = (segments + 1) * (across + 1);
  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  const indices: number[] = [];
  const point = new Vector3();
  const side = new Vector3();
  const faceNormal = new Vector3();

  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const k = i % segments;
    curve.getPoint(u, point);
    const angle = u * Math.PI * 2 * twists;
    const n = frames.normals[k];
    const b = frames.binormals[k];
    side.copy(n).multiplyScalar(Math.cos(angle)).addScaledVector(b, Math.sin(angle));
    faceNormal.copy(n).multiplyScalar(-Math.sin(angle)).addScaledVector(b, Math.cos(angle));
    for (let j = 0; j <= across; j++) {
      const v = j / across;
      const offset = (v - 0.5) * width;
      const idx = i * (across + 1) + j;
      positions[idx * 3] = point.x + side.x * offset;
      positions[idx * 3 + 1] = point.y + side.y * offset;
      positions[idx * 3 + 2] = point.z + side.z * offset;
      normals[idx * 3] = faceNormal.x;
      normals[idx * 3 + 1] = faceNormal.y;
      normals[idx * 3 + 2] = faceNormal.z;
      uvs[idx * 2] = u;
      uvs[idx * 2 + 1] = v;
    }
  }
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < across; j++) {
      const a = i * (across + 1) + j;
      const b = (i + 1) * (across + 1) + j;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}

/**
 * AI 引擎那一句的主視覺：標誌的緞帶做成 3D，薰衣草色珠光（iridescence）材質。
 * 慢慢自轉、跟著指標傾斜，捲動時多轉半圈——飛輪的意象。
 */
export function mountRibbon(canvas: HTMLCanvasElement, options: RibbonOptions = {}): () => void {
  const { progress, pointerArea = null, onReady } = options;
  return runStage(canvas, (ctx) => buildRibbon(ctx, progress), { fov: 30, pointerArea, onReady });
}

function buildRibbon(ctx: StageContext, progress?: () => number): StageScene {
  const { scene, camera, lite } = ctx;
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0, 0);

  const curve = new TrefoilCurve(1);
  const geometry = ribbonGeometry(curve, lite ? 360 : 720, lite ? 4 : 8, 0.92, 3);
  const material = new MeshPhysicalMaterial({
    color: new Color('#DCD2FB'),
    roughness: 0.2,
    metalness: 0.12,
    iridescence: 1,
    iridescenceIOR: 1.38,
    iridescenceThicknessRange: [160, 560],
    sheen: 0.7,
    sheenRoughness: 0.25,
    sheenColor: new Color('#BFD9FF'),
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    side: DoubleSide,
  });

  const uniforms = { uTime: { value: 0 } };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `vec3 transformed = vec3(position);
float edge = (uv.y - 0.5) * 2.0;
float flutter = sin(uv.x * 6.2831 * 9.0 - uTime * 1.8 + edge * 1.6) * 0.07
              + sin(uv.x * 6.2831 * 4.0 + uTime * 1.1) * 0.05;
transformed += normal * flutter * (0.35 + edge * edge);`,
      );
  };

  const mesh = new Mesh(geometry, material);
  const group = new Group();
  group.add(mesh);
  scene.add(group);

  const hemi = new HemisphereLight(0xffffff, new Color('#C9D6FF'), 0.7);
  const key = new DirectionalLight(0xffffff, 1.8);
  key.position.set(-5, 6, 8);
  const fill = new DirectionalLight(new Color('#8FB2FF'), 1.2);
  fill.position.set(6, -3, 4);
  const rim = new DirectionalLight(new Color('#B7F3FF'), 1.0);
  rim.position.set(0, 4, -6);
  scene.add(hemi, key, fill, rim);

  const tilt = { x: 0, y: 0 };

  return {
    update(time, delta, { pointer, width, height, still }) {
      uniforms.uTime.value = still ? 4 : time;
      const p = progress ? progress() : 0;
      const ease = 1 - Math.pow(0.02, delta);
      tilt.x += ((pointer.inside ? -pointer.y * 0.35 : 0) - tilt.x) * ease;
      tilt.y += ((pointer.inside ? pointer.x * 0.5 : 0) - tilt.y) * ease;
      mesh.rotation.z = (still ? 0 : time * 0.12) + p * Math.PI * 1.2;
      group.rotation.x = 0.38 + tilt.x - p * 0.5;
      group.rotation.y = -0.2 + tilt.y + p * 0.6;
      // 直式畫面收小一點，三個瓣都留在畫面裡
      const aspect = width / Math.max(1, height);
      group.scale.setScalar(aspect < 1 ? Math.max(0.5, aspect * 1.15) : 0.82);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
