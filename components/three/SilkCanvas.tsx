'use client';

import { useEffect, useRef } from 'react';
import {
  Mesh,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { SIMPLEX_NOISE_GLSL, hexToVec3 } from '@/components/three/glsl';

/**
 * 夜色絲綢：一塊高密度平面，在 vertex shader 裡用 domain-warped noise 推出布料皺褶，
 * fragment shader 做絲緞的寬柔反光＋依視角變色的蛋白石光（logo 薰衣草 → 冰藍 → 水青）。
 * 游標投影到布面上，移動越快、布料被推起的漣漪越明顯。
 *
 * 只在可見時渲染；prefers-reduced-motion 只畫一個靜態 frame；WebGL 失敗就留著底下的 CSS 漸層。
 */

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPush;
  uniform float uAmp;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec2 vUv;
  varying float vH;

  ${SIMPLEX_NOISE_GLSL}

  float field(vec2 p) {
    float t = uTime;
    // 長而順的主皺褶（沿 y 延伸）＋低頻的布面起伏；domain warp 讓褶線自然彎曲
    vec2 q = p + 1.1 * vec2(snoise(vec3(p * 0.09, t * 0.035)), snoise(vec3(p * 0.09 + 11.0, t * 0.035)));
    float h = sin(q.x * 0.62 + q.y * 0.16 + t * 0.30) * 0.85;
    h += sin(q.x * 1.18 + q.y * 0.30 - t * 0.24 + 1.3) * 0.22;
    h += snoise(vec3(q * 0.2, t * 0.05)) * 0.55;
    vec2 d = p - uMouse;
    float r2 = dot(d, d);
    h += uPush * (exp(-r2 * 0.32) * 0.95 + sin(sqrt(r2) * 2.2 - t * 3.2) * exp(-r2 * 0.1) * 0.16);
    return h * uAmp;
  }

  void main() {
    vec3 pos = position;
    float h = field(pos.xy);
    float e = 0.05;
    float hx = field(pos.xy + vec2(e, 0.0));
    float hy = field(pos.xy + vec2(0.0, e));
    vec3 n = normalize(vec3(-(hx - h) / e, -(hy - h) / e, 1.0));
    pos.z += h;
    vH = h;
    vUv = uv;
    vNormal = normalize(normalMatrix * n);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uLilac;
  uniform vec3 uIce;
  uniform vec3 uAqua;
  uniform vec3 uBg;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uGlow;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec2 vUv;
  varying float vH;

  vec3 opal(float k) {
    float s = 0.5 + 0.5 * sin(k * 6.2831);
    return s < 0.5 ? mix(uLilac, uIce, s * 2.0) : mix(uIce, uAqua, (s - 0.5) * 2.0);
  }

  void main() {
    vec3 N = normalize(vNormal);
    if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(-vViewPos);
    vec3 L1 = normalize(vec3(-0.45, 0.75, 0.55));
    vec3 L2 = normalize(vec3(0.8, -0.1, 0.35));

    float ndl1 = max(dot(N, L1), 0.0);
    float ndl2 = max(dot(N, L2), 0.0);
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    vec3 H1 = normalize(L1 + V);
    vec3 H2 = normalize(L2 + V);
    float nh1 = max(dot(N, H1), 0.0);
    float nh2 = max(dot(N, H2), 0.0);

    float sheen = pow(nh1, 3.5);
    float spec = pow(nh1, 70.0);
    float rim = pow(nh2, 10.0) * ndl2;
    float fres = pow(1.0 - ndv, 2.2);

    vec3 irid = opal(fres * 0.9 + vH * 0.22 + vUv.x * 0.5 - vUv.y * 0.25 + uTime * 0.015);

    // 絲緞：深色布面 + 沿褶脊的寬柔反光（帶蛋白石色）+ 一條很細的白色高光
    vec3 col = uBase * (0.12 + 0.88 * ndl1);
    col += irid * sheen * 1.05 * uGlow;
    col += mix(uIce, vec3(1.0), 0.6) * spec * 1.3 * uGlow;
    col += mix(uAqua, uLilac, vUv.y) * rim * 0.9 * uGlow;
    col += irid * fres * 0.4 * uGlow;

    float depth = -vViewPos.z;
    col = mix(col, uBg, smoothstep(uFogNear, uFogFar, depth));

    float edge = smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.86, vUv.x)
               * smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
    col = mix(uBg, col, edge);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const PRESETS = {
  hero: {
    rotation: [-0.72, 0.18, 0.55] as const,
    position: [2.2, -0.4, 0] as const,
    camera: 11,
    amp: 1.45,
    glow: 1,
    fog: [10, 19] as const,
  },
  soft: {
    rotation: [-0.95, -0.1, -0.45] as const,
    position: [0, -1.6, 0] as const,
    camera: 12,
    amp: 1.25,
    glow: 0.5,
    fog: [10, 19] as const,
  },
} as const;

interface SilkCanvasProps {
  variant?: keyof typeof PRESETS;
  className?: string;
}

export function SilkCanvas({ variant = 'hero', className = '' }: SilkCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const preset = PRESETS[variant];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 768;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: !small, alpha: false, powerPreference: 'high-performance' });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75));
    renderer.setClearColor(0x08090f, 1);
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.opacity = '0';
    canvas.style.transition = 'opacity 1.6s cubic-bezier(0.16, 1, 0.3, 1)';
    host.appendChild(canvas);

    const scene = new Scene();
    const camera = new PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, preset.camera);

    const segments = small ? [120, 80] : [230, 150];
    const geometry = new PlaneGeometry(30, 20, segments[0], segments[1]);
    const uniforms = {
      uTime: { value: 8 },
      uMouse: { value: new Vector2(0, 0) },
      uPush: { value: 0 },
      uAmp: { value: preset.amp },
      uGlow: { value: preset.glow },
      uBase: { value: hexToVec3('#232044') },
      uLilac: { value: hexToVec3('#C3B2FF') },
      uIce: { value: hexToVec3('#93C9FF') },
      uAqua: { value: hexToVec3('#62E3EA') },
      uBg: { value: hexToVec3('#08090F') },
      uFogNear: { value: preset.fog[0] },
      uFogFar: { value: preset.fog[1] },
    };
    const material = new ShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms });
    const mesh = new Mesh(geometry, material);
    mesh.rotation.set(preset.rotation[0], preset.rotation[1], preset.rotation[2]);
    mesh.position.set(preset.position[0], preset.position[1], preset.position[2]);
    scene.add(mesh);
    mesh.updateMatrixWorld();

    // 游標 → 布面座標：對「沒變形的平面」做射線交點，夠準也夠便宜
    const flatPlane = new Plane();
    flatPlane.setFromNormalAndCoplanarPoint(
      new Vector3(0, 0, 1).applyQuaternion(mesh.quaternion),
      mesh.position.clone(),
    );
    const raycaster = new Raycaster();
    const ndc = new Vector2();
    const hit = new Vector3();
    const mouseTarget = new Vector2(0, 0);
    let pushTarget = 0;
    let lastX = 0;
    let lastY = 0;
    let hasPointer = false;

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // 窄螢幕把鏡頭拉遠，布料不會只剩一角
      camera.position.z = preset.camera * (camera.aspect < 1 ? 1.35 : 1);
      camera.updateProjectionMatrix();
    };
    resize();

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = host.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(flatPlane, hit)) {
        mesh.worldToLocal(hit);
        mouseTarget.set(hit.x, hit.y);
      }
      const speed = hasPointer ? Math.hypot(e.clientX - lastX, e.clientY - lastY) : 0;
      lastX = e.clientX;
      lastY = e.clientY;
      hasPointer = true;
      pushTarget = Math.min(1.15, pushTarget + speed * 0.012);
    };

    let raf = 0;
    let running = false;
    let last = performance.now();
    let firstFrame = true;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      uniforms.uTime.value += dt;
      uniforms.uMouse.value.lerp(mouseTarget, 1 - Math.pow(0.002, dt));
      pushTarget *= Math.pow(0.35, dt);
      const restPush = hasPointer ? 0.28 : 0;
      uniforms.uPush.value += (Math.max(pushTarget, restPush) - uniforms.uPush.value) * (1 - Math.pow(0.02, dt));
      renderer.render(scene, camera);
      if (firstFrame) {
        firstFrame = false;
        canvas.style.opacity = '1';
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduceMotion) {
      renderer.render(scene, camera);
      canvas.style.opacity = '1';
    }

    let inView = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(host);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) renderer.render(scene, camera);
    });
    ro.observe(host);
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };
    document.addEventListener('visibilitychange', onVisibility);
    if (!reduceMotion) window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [variant]);

  return <div ref={hostRef} className={`absolute inset-0 ${className}`} aria-hidden />;
}
