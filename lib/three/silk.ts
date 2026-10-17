import {
  Color,
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  Mesh,
  MeshPhysicalMaterial,
  Plane,
  PlaneGeometry,
  Raycaster,
  Vector2,
  Vector3,
} from 'three';
import { SIMPLEX_3D, runStage, type StageContext, type StageScene } from '@/lib/three/stage';

export interface SilkOptions {
  /** 捲動時布料往後倒、相機下移（首屏用） */
  scrollDrift?: boolean;
  /** 布面的主色調：pearl 偏白、iris 偏薰衣草藍 */
  tone?: 'pearl' | 'iris';
  pointerArea?: HTMLElement | null;
  onReady?: () => void;
}

const TONES = {
  pearl: { base: '#ECEAF4', valley: '#A79CD8', sheen: '#A994F6', key: '#FFFFFF', fill: '#7E9BFF', rim: '#8EE2FF', ground: '#BCB2E3' },
  iris: { base: '#E6E0FA', valley: '#9C8FE0', sheen: '#8FB4FF', key: '#FFFFFF', fill: '#A592F2', rim: '#86E3FF', ground: '#BDB2EE' },
} as const;

/**
 * 首屏的絲綢：一張高細分的平面，在 vertex shader 裡以噪聲做出斜向的大褶與細波，
 * 法線用有限差分重算（MeshPhysicalMaterial 的 sheen + iridescence 才有正確的光澤）。
 * 指標停在布上會壓出一個凹陷並帶出漣漪；點擊會從那一點盪開一圈波紋。
 */
export function mountSilk(canvas: HTMLCanvasElement, options: SilkOptions = {}): () => void {
  const { scrollDrift = false, tone = 'pearl', pointerArea = null, onReady } = options;
  return runStage(canvas, (ctx) => buildSilk(ctx, scrollDrift, TONES[tone]), { fov: 32, pointerArea, onReady });
}

function buildSilk(
  ctx: StageContext,
  scrollDrift: boolean,
  palette: (typeof TONES)[keyof typeof TONES],
): StageScene {
  const { scene, camera, lite } = ctx;

  camera.position.set(0, 0, 7);
  camera.lookAt(0, 0, 0);
  ctx.renderer.toneMappingExposure = 0.92;

  const geometry = new PlaneGeometry(16, 10, lite ? 110 : 220, lite ? 70 : 140);
  const material = new MeshPhysicalMaterial({
    color: new Color(palette.base),
    roughness: 0.34,
    metalness: 0.0,
    sheen: 0.7,
    sheenRoughness: 0.3,
    sheenColor: new Color(palette.sheen),
    iridescence: 0.4,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [280, 420],
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.22,
    side: DoubleSide,
  });

  const uniforms = {
    uTime: { value: 0 },
    uPointer: { value: new Vector2(0, 0) },
    uPress: { value: 0 },
    uRipple: { value: new Vector3(0, 0, -100) },
    uValley: { value: new Color(palette.valley) },
  };

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
varying float vSilkH;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPress;
uniform vec3 uRipple;
${SIMPLEX_3D}
float silkHeight(vec2 p) {
  float t = uTime;
  vec2 q = mat2(0.84, -0.54, 0.54, 0.84) * p;
  float warp = snoise(vec3(q * 0.16, t * 0.05)) * 1.8;
  float folds = sin(q.x * 1.7 + warp + t * 0.32) * 0.5
              + sin(q.x * 0.72 - warp * 0.7 + t * 0.2) * 0.42;
  // 柔軟的折痕：平滑版的 |sin|（sqrt(x²+k)），谷底收窄但不出現尖角——尖角會讓法線在頂點間跳動、出現鋸齒
  float cs = sin(q.x * 1.15 + warp * 1.25 - t * 0.22);
  float crease = 1.0 - sqrt(cs * cs + 0.06);
  folds += crease * crease * 0.5;
  float amp = 0.95 + 0.3 * snoise(vec3(q * 0.11 + 7.0, t * 0.04));
  float h = folds * amp;
  h += snoise(vec3(p * 0.42, t * 0.08)) * 0.2;
  h += sin(q.y * 2.4 + t * 0.6 + warp) * 0.03;

  vec2 dm = p - uPointer;
  float d2 = dot(dm, dm);
  float d = sqrt(d2);
  h -= exp(-d2 * 0.8) * 0.5 * uPress;
  h += sin(d * 4.5 - t * 3.2) * exp(-d * 0.75) * 0.05 * uPress;

  float age = t - uRipple.z;
  if (age > 0.0 && age < 6.0) {
    float rd = length(p - uRipple.xy);
    float front = age * 2.4;
    float band = rd - front;
    h += sin(band * 3.6) * exp(-abs(band) * 1.2) * exp(-age * 0.8) * 0.32;
  }
  return h;
}`,
      )
      .replace(
        '#include <beginnormal_vertex>',
        /* glsl */ `float silkE = 0.03;
float silkH = silkHeight(position.xy);
float silkHx = silkHeight(position.xy + vec2(silkE, 0.0));
float silkHy = silkHeight(position.xy + vec2(0.0, silkE));
vec3 objectNormal = normalize(vec3(-(silkHx - silkH) / silkE, -(silkHy - silkH) / silkE, 1.0));
#ifdef USE_TANGENT
vec3 objectTangent = vec3(tangent.xyz);
#endif`,
      )
      .replace('#include <begin_vertex>', 'vec3 transformed = vec3(position.xy, position.z + silkH);\nvSilkH = silkH;');
    // 褶子的谷底染深一點（假的環境遮蔽）：淺色布面才讀得出立體
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vSilkH;\nuniform vec3 uValley;')
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
float silkLift = smoothstep(-0.8, 0.9, vSilkH);
diffuseColor.rgb = mix(uValley, diffuseColor.rgb, 0.12 + 0.88 * silkLift);`,
      );
  };

  const mesh = new Mesh(geometry, material);
  mesh.rotation.set(-0.42, 0.08, -0.12);
  mesh.position.set(0, -0.2, 0);
  scene.add(mesh);

  const hemi = new HemisphereLight(0xffffff, new Color(palette.ground), 0.22);
  const key = new DirectionalLight(new Color(palette.key), 3.0);
  key.position.set(-8, 3, 1.6);
  const fill = new DirectionalLight(new Color(palette.fill), 1.1);
  fill.position.set(7, -2, 1.2);
  const rim = new DirectionalLight(new Color(palette.rim), 0.7);
  rim.position.set(3, 5, -2);
  scene.add(hemi, key, fill, rim);

  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const hit = new Vector3();
  const plane = new Plane();
  const normal = new Vector3();
  const target = new Vector2();
  let press = 0;

  // 指標（NDC）投到布面的平面，換成布面的區域座標
  const project = (x: number, y: number): Vector2 | null => {
    mesh.updateMatrixWorld();
    normal.set(0, 0, 1).transformDirection(mesh.matrixWorld);
    plane.setFromNormalAndCoplanarPoint(normal, mesh.position);
    ndc.set(x, y);
    raycaster.setFromCamera(ndc, camera);
    if (!raycaster.ray.intersectPlane(plane, hit)) return null;
    mesh.worldToLocal(hit);
    return new Vector2(hit.x, hit.y);
  };

  return {
    update(time, delta, { pointer, height, still }) {
      uniforms.uTime.value = still ? 12 : time;

      if (scrollDrift) {
        const progress = Math.min(1.2, window.scrollY / Math.max(1, window.innerHeight));
        mesh.rotation.x = -0.42 - progress * 0.35;
        camera.position.y = -progress * 0.9;
        camera.lookAt(0, -progress * 0.6, 0);
      }

      if (pointer.inside) {
        const local = project(pointer.x, pointer.y);
        if (local) target.copy(local);
      }
      const follow = 1 - Math.pow(0.0025, delta);
      uniforms.uPointer.value.lerp(target, follow);
      press += ((pointer.inside ? 1 : 0) - press) * (1 - Math.pow(0.05, delta));
      uniforms.uPress.value = press;
      // 視窗很矮時布面稍微放大，避免露出邊緣
      mesh.scale.setScalar(height < 600 ? 1.12 : 1);
    },
    press(x, y, time) {
      const local = project(x, y);
      if (local) uniforms.uRipple.value.set(local.x, local.y, time);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
