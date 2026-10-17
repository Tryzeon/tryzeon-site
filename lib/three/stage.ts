import {
  NeutralToneMapping,
  PMREMGenerator,
  PerspectiveCamera,
  SRGBColorSpace,
  Scene,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface Pointer {
  /** 以 canvas 為範圍的 NDC（-1..1）；離開 canvas 時可以超出範圍 */
  x: number;
  y: number;
  /** 指標是否在 canvas（或 pointerArea）範圍內 */
  inside: boolean;
}

export interface StageContext {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  pointer: Pointer;
  /** 偏好減少動態：只畫靜態畫面 */
  still: boolean;
  /** 窄螢幕或觸控裝置：場景自行降低細分 */
  lite: boolean;
}

export interface StageScene {
  update(time: number, delta: number, ctx: StageContext): void;
  resize?(ctx: StageContext): void;
  /** 在 canvas 範圍內按下（觸控也算）；座標同 pointer */
  press?(x: number, y: number, time: number): void;
  dispose(): void;
}

export interface StageOptions {
  fov?: number;
  maxDpr?: number;
  /** 指標的感應範圍；預設是 canvas 本身（canvas 通常 pointer-events: none） */
  pointerArea?: HTMLElement | null;
  /** 第一個畫面畫完時呼叫（用來淡入 canvas） */
  onReady?: () => void;
}

/**
 * 一個 canvas = 一個小型 three.js 舞台：renderer、環境光、相機、resize、
 * 只在可見時跑 rAF、分頁隱藏時停、卸載時釋放 GPU 資源。
 * 場景本身由 build 回傳（update / resize / dispose）。
 */
export function runStage(
  canvas: HTMLCanvasElement,
  build: (ctx: StageContext) => StageScene,
  { fov = 35, maxDpr = 1.75, pointerArea = null, onReady }: StageOptions = {},
): () => void {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    // 沒有 WebGL：留下 CSS 底圖即可
    return () => {};
  }
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envTarget = pmrem.fromScene(room, 0.04);
  scene.environment = envTarget.texture;
  room.dispose();

  const camera = new PerspectiveCamera(fov, 1, 0.1, 100);
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lite = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

  const ctx: StageContext = {
    renderer,
    scene,
    camera,
    canvas,
    width: 1,
    height: 1,
    pointer: { x: 0, y: 0, inside: false },
    still,
    lite,
  };

  const stage = build(ctx);

  const resize = () => {
    // 版面尺寸（不含 transform）：canvas 進場時會縮放，不能拿 getBoundingClientRect
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    if (w === ctx.width && h === ctx.height) return;
    ctx.width = w;
    ctx.height = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1.5 : maxDpr));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    stage.resize?.(ctx);
    if (!running) draw(performance.now());
  };

  const area = pointerArea ?? canvas;
  const toNdc = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 2 - 1,
      y: -(((clientY - rect.top) / rect.height) * 2 - 1),
    };
  };
  const onPointerMove = (e: PointerEvent) => {
    const p = toNdc(e.clientX, e.clientY);
    ctx.pointer.x = p.x;
    ctx.pointer.y = p.y;
    const r = area.getBoundingClientRect();
    ctx.pointer.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  };
  const onPointerDown = (e: PointerEvent) => {
    const r = area.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
    const p = toNdc(e.clientX, e.clientY);
    stage.press?.(p.x, p.y, clock);
  };
  const onLeave = () => {
    ctx.pointer.inside = false;
  };

  let raf = 0;
  let running = false;
  let visible = false;
  let last = performance.now();
  let clock = 0;
  let ready = false;

  const draw = (now: number) => {
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock += delta;
    stage.update(clock, delta, ctx);
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      onReady?.();
    }
  };

  const loop = (now: number) => {
    draw(now);
    raf = requestAnimationFrame(loop);
  };

  const sync = () => {
    const shouldRun = visible && !document.hidden && !still;
    if (shouldRun && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && still) draw(performance.now());
      sync();
    },
    { rootMargin: '120px' },
  );
  io.observe(canvas);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  document.documentElement.addEventListener('mouseleave', onLeave);

  resize();

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', sync);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerdown', onPointerDown);
    document.documentElement.removeEventListener('mouseleave', onLeave);
    stage.dispose();
    envTarget.dispose();
    pmrem.dispose();
    renderer.dispose();
  };
}

/** Ashima 3D simplex noise（MIT），給 vertex shader 用 */
export const SIMPLEX_3D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;
