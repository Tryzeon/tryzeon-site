'use client';

import { useEffect, useRef } from 'react';

const VERTEX = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// shader 座標的縮放：畫面高度 = SCALE 個單位。游標換算（onMove）共用這個值
const SCALE = 4.2;

// 一塊緩慢起伏的緞面：長而斜的褶（高度場）→ 法線 → 受光面亮白、背光面透出品牌藍青。
// 顏色只用 #2563EB → #60A5FA → #06B6D4 疊在 #FAFAFA 上；
// 中央留白給標題，上下緣淡出到畫布底色，與前後區塊沒有接縫。
const FRAGMENT = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_hover;

float height(vec2 p) {
  float t = u_time;
  vec2 q = vec2(p.x * 0.87 - p.y * 0.5, p.x * 0.5 + p.y * 0.87);
  // 褶的走向沿 q.y 緩慢彎曲：每一道褶都是長長一條，而不是一格一格的起伏
  float h = sin(q.x * 2.2 + 1.3 * sin(q.y * 0.45 + t * 0.14) + t * 0.2) * 0.6;
  h += sin(q.x * 3.7 + 0.9 * sin(q.y * 0.8 - t * 0.1) - t * 0.17 + 1.3) * 0.3;
  h += sin(q.x * 6.1 + q.y * 0.3 + t * 0.28) * 0.08;
  vec2 d = p - u_mouse;
  float r2 = dot(d, d);
  h += u_hover * 0.3 * exp(-r2 * 0.5) * sin(sqrt(r2) * 4.5 - t * 2.4);
  return h;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y * ${SCALE.toFixed(1)};
  float e = 0.01;
  float hx = height(p + vec2(e, 0.0)) - height(p - vec2(e, 0.0));
  float hy = height(p + vec2(0.0, e)) - height(p - vec2(0.0, e));
  vec3 n = normalize(vec3(-hx / (2.0 * e), -hy / (2.0 * e), 1.1));

  vec3 light = normalize(vec3(-0.5, 0.6, 0.62));
  vec3 halfway = normalize(light + vec3(0.0, 0.0, 1.0));
  float lit = smoothstep(-0.7, 0.95, dot(n, light));
  float spec = pow(max(dot(n, halfway), 0.0), 90.0);

  vec3 blue = vec3(0.145, 0.388, 0.922);
  vec3 mid = vec3(0.376, 0.647, 0.98);
  vec3 cyan = vec3(0.024, 0.714, 0.831);
  float k = clamp(uv.x * 0.9 + 0.05, 0.0, 1.0);
  vec3 tint = k < 0.5 ? mix(blue, mid, k * 2.0) : mix(mid, cyan, k * 2.0 - 1.0);

  vec3 shadow = mix(tint, vec3(1.0), 0.4);
  vec3 ice = vec3(0.87, 0.93, 1.0);
  vec3 col = mix(shadow, ice, smoothstep(0.05, 0.55, lit));
  col = mix(col, vec3(1.0), smoothstep(0.55, 0.95, lit));
  col += spec * 0.45;

  // 標題周圍留白、上下緣淡出
  vec2 c = (uv - vec2(0.5, 0.5)) * vec2(1.3, 2.0);
  float center = smoothstep(0.2, 0.9, length(c));
  float edges = smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.72, uv.y);
  float alpha = edges * mix(0.28, 1.0, center);

  vec3 canvasBg = vec3(0.98);
  gl_FragColor = vec4(mix(canvasBg, col, alpha), 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface SilkFieldProps {
  className?: string;
}

/**
 * SilkField — 結尾 CTA 的 atmosphere：一塊緩慢起伏的藍青緞面（WebGL fragment shader，無相依套件）。
 * 游標劃過時在布面漾開漣漪。只在畫面內時繪製；偏好減少動態時只畫一格靜態布面。
 * WebGL 不可用時什麼都不畫，底下的 #FAFAFA 照常。
 */
export function SilkField({ className = '' }: SilkFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!wrap || !canvas || !gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // 一個蓋滿畫面的三角形
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uHover = gl.getUniformLocation(program, 'u_hover');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    // 片段著色器逐像素計算，解析度上限壓低：布面本來就是柔的，看不出差別
    const dpr = Math.min(window.devicePixelRatio || 1, finePointer ? 1.5 : 1);

    let time = 18;
    let last = performance.now();
    let raf = 0;
    let mouse = [0, 0];
    let mouseTarget = [0, 0];
    let hover = 0;
    let hoverTarget = 0;

    const render = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse[0], mouse[1]);
      gl.uniform1f(uHover, hover);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      canvas.width = Math.round(wrap.clientWidth * dpr);
      canvas.height = Math.round(wrap.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      render();
    };

    const loop = (now: number) => {
      const dt = Math.min(now - last, 50) / 1000;
      last = now;
      time += dt;
      mouse = [mouse[0] + (mouseTarget[0] - mouse[0]) * dt * 4, mouse[1] + (mouseTarget[1] - mouse[1]) * dt * 4];
      hover += (hoverTarget - hover) * Math.min(1, dt * 2.5);
      render();
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(wrap);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // 游標位置換算成 shader 的座標（與 FRAGMENT 裡的 p 同一套）
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mouseTarget = [((e.clientX - r.left - r.width / 2) / r.height) * SCALE, ((r.height / 2 - (e.clientY - r.top)) / r.height) * SCALE];
      hoverTarget = 1;
    };
    const onLeave = () => {
      hoverTarget = 0;
    };
    const section = wrap.closest('section') ?? wrap;
    if (finePointer && !reduced) {
      section.addEventListener('pointermove', onMove);
      section.addEventListener('pointerleave', onLeave);
    }

    canvas.style.opacity = '1';

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      />
    </div>
  );
}
