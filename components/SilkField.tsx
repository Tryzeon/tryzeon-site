'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { bindFullscreenTriangle, compileProgram, prefersReducedMotion, runVisibleLoop } from '@/lib/webgl';

const VERTEX = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

// 一塊緩慢垂墜的白色緞面：
// 高度場 = 兩道斜向長褶（方向性讓它讀起來是布，不是水或油）＋一層低頻 warp；
// 有 route 時，再加一道從 A（商品圖）垂到 B（手機）的寬褶，開場時一道藍青光沿褶走到 B。
// 打光：寬的包覆式漫射、沿褶方向拉長的緞面高光（Kajiya-Kay）、掠射角才出現的三色藍青。
const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_time;
uniform float u_flow;
uniform vec2 u_mouse;
uniform float u_energy;
uniform float u_fade;
uniform float u_tint;
uniform vec4 u_route;
uniform float u_routeOn;
uniform float u_intro;
uniform float u_fadeTop;
varying vec2 v_uv;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// 褶的走向（沿褶）與橫越褶的方向
const vec2 ALONG = vec2(0.56, -0.83);
const vec2 ACROSS = vec2(0.83, 0.56);

// 布褶剖面：褶峰圓、摺痕尖（|sin| 在零點是尖谷），epsilon 讓摺痕不至於割手
float fold(float x) {
  float s = sin(x);
  return sqrt(s * s + 0.018);
}

// route 的局部座標：s 沿 A→B（0..1），d 垂直距離（已扣掉下垂量）
vec2 routeLocal(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float len = max(length(ab), 0.001);
  vec2 dir = ab / len;
  vec2 nrm = vec2(-dir.y, dir.x);
  float s = dot(p - a, dir) / len;
  float sag = 0.22 * len * 4.0 * s * (1.0 - s);
  float d = dot(p - a, nrm) + sag;
  return vec2(s, d);
}

float routeMask(vec2 rl) {
  return smoothstep(-0.35, 0.05, rl.x) * (1.0 - smoothstep(0.95, 1.2, rl.x));
}

float height(vec2 p, float t, vec2 m, vec2 a, vec2 b) {
  float warp = snoise(p * 0.45 + vec2(t * 0.03, -t * 0.02));
  vec2 q = p + vec2(warp * 0.12, warp * 0.08);
  float along = dot(q, ALONG);
  float across = dot(q, ACROSS);
  // 褶沿著長邊緩緩彎曲、在某些段落收攏又散開，像垂掛的緞
  float bend = 0.5 * sin(along * 0.85 + t * 0.11) + 0.22 * sin(along * 1.9 - t * 0.07 + 1.3);
  float x1 = across * 3.4 + bend * 1.1 + t * 0.12 + u_flow;
  float h = fold(x1) * 0.5 * (0.75 + 0.25 * sin(along * 0.7 + 0.6));
  float x2 = across * 1.3 - along * 0.35 + t * 0.06;
  h += sin(x2) * 0.38;
  h += warp * 0.08;
  if (u_routeOn > 0.5) {
    vec2 rl = routeLocal(p, a, b);
    float taut = 0.35 + 0.65 * u_intro;
    h += exp(-(rl.y * rl.y) / 0.032) * routeMask(rl) * 0.75 * taut;
  }
  float d = length(p - m);
  h += exp(-d * d * 2.2) * (0.16 + 0.42 * u_energy);
  return h;
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  float aspect = u_res.x / u_res.y;
  vec2 toP = vec2(aspect, 1.0) * 2.0;
  vec2 p = (v_uv - 0.5) * toP;
  vec2 m = (u_mouse - 0.5) * toP;
  vec2 a = (u_route.xy - 0.5) * toP;
  vec2 b = (u_route.zw - 0.5) * toP;
  float t = u_time;

  float e = 2.0 / u_res.y;
  float h = height(p, t, m, a, b);
  float hx = height(p + vec2(e, 0.0), t, m, a, b);
  float hy = height(p + vec2(0.0, e), t, m, a, b);
  vec3 n = normalize(vec3(-(hx - h) / e * 0.5, -(hy - h) / e * 0.5, 1.0));

  vec2 lp = (u_mouse - 0.5) * vec2(0.5, 0.35);
  vec3 l = normalize(vec3(-0.5 + lp.x, 0.6 + lp.y, 0.62));
  vec3 v = vec3(0.0, 0.0, 1.0);
  vec3 hv = normalize(l + v);

  // 緞面：高光沿褶的走向拉長
  vec3 along3 = vec3(ALONG, 0.0);
  vec3 tangent = normalize(along3 - n * dot(along3, n));
  float th = dot(tangent, hv);
  float aniso = pow(sqrt(max(1.0 - th * th, 0.0)), 90.0);
  float gloss = pow(max(dot(n, hv), 0.0), 14.0);
  float wrap = clamp(dot(n, l) * 0.6 + 0.4, 0.0, 1.0);
  float graze = pow(1.0 - max(dot(n, v), 0.0), 2.0);

  vec3 blue = vec3(0.145, 0.388, 0.922);
  vec3 sky = vec3(0.376, 0.647, 0.98);
  vec3 cyan = vec3(0.024, 0.714, 0.831);
  float k = clamp(0.6 + dot(n.xy, vec2(0.85, -0.55)) * 1.5, 0.0, 1.0);
  vec3 ramp = k < 0.5 ? mix(blue, sky, k * 2.0) : mix(sky, cyan, k * 2.0 - 1.0);

  vec3 lit = vec3(0.995, 0.997, 1.0);
  vec3 mid = vec3(0.93, 0.945, 0.968);
  vec3 shade = vec3(0.70, 0.775, 0.875);
  vec3 col = wrap > 0.55 ? mix(mid, lit, smoothstep(0.55, 0.95, wrap)) : mix(shade, mid, smoothstep(0.05, 0.55, wrap));
  col = mix(col, ramp, clamp(graze * 2.6, 0.0, 1.0) * 0.55 * u_tint);
  col += aniso * 0.22 + gloss * 0.1;

  // 開場：一道光沿 route 的褶脊從 A 走到 B，之後留下淡淡的虹彩脊線
  if (u_routeOn > 0.5) {
    vec2 rl = routeLocal(p, a, b);
    float ridge = exp(-(rl.y * rl.y) / 0.012) * routeMask(rl);
    float head = u_intro * 1.25 - 0.1;
    float band = exp(-pow((rl.x - head) / 0.14, 2.0)) * (1.0 - smoothstep(0.92, 1.0, u_intro));
    float trail = smoothstep(head + 0.05, head - 0.6, rl.x) * smoothstep(-0.2, 0.2, rl.x);
    col = mix(col, ramp, ridge * (band * 0.85 + trail * 0.16 * u_intro) * u_tint);
    col += ridge * band * 0.12;
  }

  vec3 page = vec3(0.98, 0.98, 0.98);
  float edge = smoothstep(0.0, 0.22, v_uv.y) * mix(1.0, 1.0 - smoothstep(0.75, 1.0, v_uv.y), u_fadeTop);
  col = mix(page, col, edge * u_fade);
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`;

/** 開場光走完一趟的秒數 */
const INTRO_S = 2.4;
/** 內部像素上限：布面很柔，再高看不出差別，只是多燒 GPU */
const MAX_PIXELS = 1_100_000;

interface SilkFieldProps {
  className?: string;
  /** 虹彩濃度，0–1.5；子頁用較淡的 0.7 */
  tint?: number;
  /** 內部解析度相對 CSS 尺寸的比例 */
  resolution?: number;
  /** 有給就畫一道從 from（中心）垂到 to（左緣）的布褶，開場光沿著它走 */
  routeFrom?: RefObject<HTMLElement | null>;
  routeTo?: RefObject<HTMLElement | null>;
  /** 開場光延後幾秒才出發（等手機落定） */
  introDelay?: number;
  /** 上緣也淡回頁面底色（不在頁首的區塊用） */
  fadeTop?: boolean;
}

/**
 * SilkField：WebGL 緞面布料背景（ambient 層）。
 * 只在可見、分頁在前景時渲染；偏好減少動態時只畫一幀靜態布面（route 直接是完成狀態）；
 * WebGL 不可用時什麼都不畫，底下的 CSS 背景照常顯示。
 * 每個實例擁有自己的 context 與資源，卸載時釋放。
 */
export function SilkField({
  className = '',
  tint = 1,
  resolution = 0.6,
  routeFrom,
  routeTo,
  introDelay = 0.5,
  fadeTop = false,
}: SilkFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]';
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;

    let program: WebGLProgram;
    try {
      program = compileProgram(gl, VERTEX, FRAGMENT);
    } catch {
      return;
    }
    host.appendChild(canvas);
    gl.useProgram(program);
    const buffer = bindFullscreenTriangle(gl, program);

    const loc = (name: string) => gl.getUniformLocation(program, name);
    const u = {
      res: loc('u_res'),
      time: loc('u_time'),
      flow: loc('u_flow'),
      mouse: loc('u_mouse'),
      energy: loc('u_energy'),
      fade: loc('u_fade'),
      tint: loc('u_tint'),
      route: loc('u_route'),
      routeOn: loc('u_routeOn'),
      intro: loc('u_intro'),
      fadeTop: loc('u_fadeTop'),
    };
    gl.uniform1f(u.tint, tint);
    gl.uniform1f(u.fadeTop, fadeTop ? 1 : 0);

    const still = prefersReducedMotion();
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    gl.uniform1f(u.routeOn, 0);

    // route 端點量的是版面位置；兩端（display:none 的手機版、尚未掛載）量不到就不畫褶
    const measureRoute = () => {
      const from = routeFrom?.current;
      const to = routeTo?.current;
      if (!from || !to) return;
      const box = host.getBoundingClientRect();
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      if (!box.width || !box.height || !a.width || !b.width) {
        gl.uniform1f(u.routeOn, 0);
        return;
      }
      gl.uniform1f(u.routeOn, 1);
      // A：商品圖中心；B：手機左緣、略高於中線（光停在玻璃邊上）
      const ax = (a.left + a.width / 2 - box.left) / box.width;
      const ay = 1 - (a.top + a.height / 2 - box.top) / box.height;
      const bx = (b.left + b.width * 0.06 - box.left) / box.width;
      const by = 1 - (b.top + b.height * 0.42 - box.top) / box.height;
      gl.uniform4f(u.route, ax, ay, bx, by);
    };

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      let scale = Math.min(window.devicePixelRatio || 1, 2) * resolution * (coarse ? 0.7 : 1);
      if (width * height * scale * scale > MAX_PIXELS) scale = Math.sqrt(MAX_PIXELS / (width * height));
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.res, canvas.width, canvas.height);
      measureRoute();
      if (still) draw(6, 0);
    };

    // 游標（canvas uv，y 朝上）與移動速度換算的能量；捲動速度推動布面流動
    const pointer = { x: 0.7, y: 0.55, tx: 0.7, ty: 0.55, energy: 0, target: 0 };
    let lastMove = { x: 0, y: 0, t: 0 };
    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const y = 1 - (e.clientY - rect.top) / rect.height;
      if (y < -0.2 || y > 1.2) return;
      const now = performance.now();
      const dt = Math.max(now - lastMove.t, 8);
      const speed = Math.hypot(e.clientX - lastMove.x, e.clientY - lastMove.y) / dt;
      lastMove = { x: e.clientX, y: e.clientY, t: now };
      pointer.tx = (e.clientX - rect.left) / rect.width;
      pointer.ty = y;
      pointer.target = Math.min(1, pointer.target + speed * 0.06);
    };
    let lastScroll = window.scrollY;
    let flowVelocity = 0;
    let flow = 0;

    let fade = still ? 1 : 0;
    let introClock = still ? INTRO_S : -introDelay;
    const draw = (time: number, dt: number) => {
      const follow = 1 - Math.pow(0.02, dt);
      pointer.x += (pointer.tx - pointer.x) * follow;
      pointer.y += (pointer.ty - pointer.y) * follow;
      pointer.energy += (pointer.target - pointer.energy) * follow;
      pointer.target *= Math.pow(0.3, dt);

      const scrollY = window.scrollY;
      flowVelocity += ((scrollY - lastScroll) * 0.004 - flowVelocity) * follow;
      lastScroll = scrollY;
      flow += flowVelocity;

      fade = Math.min(1, fade + dt * 0.9);
      introClock += dt;
      const introT = Math.min(1, Math.max(0, introClock / INTRO_S));
      const intro = 1 - Math.pow(1 - introT, 3);

      gl.uniform1f(u.time, time);
      gl.uniform1f(u.flow, flow);
      gl.uniform2f(u.mouse, pointer.x, pointer.y);
      gl.uniform1f(u.energy, pointer.energy);
      gl.uniform1f(u.fade, 0.3 + 0.7 * (1 - Math.pow(1 - fade, 3)));
      gl.uniform1f(u.intro, still ? 1 : intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    if (routeFrom?.current) resizeObserver.observe(routeFrom.current);
    if (routeTo?.current) resizeObserver.observe(routeTo.current);
    // 手機的 3D 落定動畫會改變它的外框，落定後再量一次
    const settleTimer = window.setTimeout(measureRoute, 1600);
    if (!still && !coarse) window.addEventListener('pointermove', onMove, { passive: true });

    const stopLoop = runVisibleLoop(host, { frame: draw, still });
    requestAnimationFrame(() => requestAnimationFrame(() => canvas.classList.replace('opacity-0', 'opacity-100')));

    // GPU context 遺失（驅動重置、分頁被回收）：不重建資源，直接拿掉畫布，露出底下的 CSS 背景
    const onLost = () => {
      stopLoop();
      canvas.remove();
    };
    canvas.addEventListener('webglcontextlost', onLost);

    return () => {
      stopLoop();
      window.clearTimeout(settleTimer);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, [tint, resolution, routeFrom, routeTo, introDelay, fadeTop]);

  return <div ref={hostRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden />;
}
