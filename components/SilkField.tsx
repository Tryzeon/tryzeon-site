'use client';

import { useEffect, useRef, useState } from 'react';

interface SilkFieldProps {
  className?: string;
  /** 絲綢褶皺的顏色強度，0–1（0 幾乎全白）。預設 0.7 */
  intensity?: number;
  /** 流動速度倍率。預設 1 */
  speed?: number;
}

const VERTEX = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// 2 層 domain warp 的 fbm 拉出沿對角線流動的長條褶皺；褶皺頂端混入 sky / ice cyan，
// 最細的 ridge 才帶一點 #60A5FA。底色是 #FAFAFA，整體大部分仍是白。
const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // 滑鼠：整體流向輕微偏轉，游標附近再被撥開一點
  vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);
  p += (u_mouse - 0.5) * 0.08;
  vec2 dm = p - m;
  p += dm * 0.07 * exp(-dot(dm, dm) * 5.0);

  float t = u_time * 0.045;

  // 轉到對角線、沿褶皺方向拉長
  mat2 rot = mat2(0.82, -0.57, 0.57, 0.82);
  vec2 q = rot * p;
  vec2 s = vec2(q.x * 0.9, q.y * 2.4);

  vec2 w1 = vec2(
    fbm(s * 1.1 + vec2(t, -0.6 * t)),
    fbm(s * 1.1 + vec2(5.2, 1.3) - 0.8 * t)
  );
  vec2 w2 = vec2(
    fbm(s + 1.8 * w1 + vec2(1.7, 9.2) + 0.5 * t),
    fbm(s + 1.8 * w1 + vec2(8.3, 2.8) - 0.4 * t)
  );
  float n = fbm(s + 2.2 * w2);

  // 褶皺：被 warp 扭過的平行波，h 接近 1 是布面受光的峰
  float h = 0.5 + 0.5 * sin(q.y * 10.0 + n * 9.0 + w2.x * 3.0 + t * 3.0);
  float crest = smoothstep(0.45, 1.0, h);
  float ridge = pow(h, 14.0);
  // 大尺度的「有布 / 沒布」：讓不少區塊是乾淨的白
  float cloth = smoothstep(0.3, 0.62, n);

  vec3 base = vec3(0.980);
  vec3 sky = vec3(0.859, 0.918, 0.996);   // #DBEAFE
  vec3 ice = vec3(0.812, 0.980, 0.996);   // #CFFAFE
  vec3 mist = vec3(0.878, 0.906, 1.0);    // #E0E7FF
  vec3 blue = vec3(0.376, 0.647, 0.980);  // #60A5FA

  vec3 tint = mix(sky, ice, smoothstep(0.35, 0.7, w1.y));
  tint = mix(tint, mist, smoothstep(0.55, 0.85, w2.y) * 0.5);

  float k = u_intensity * cloth;
  vec3 col = mix(base, tint, min(1.0, crest * k * 1.35));
  col = mix(col, blue, ridge * k * 0.5);
  // 峰兩側的陰影面帶一點點冷灰藍，布才有厚度
  col -= vec3(0.03, 0.02, 0.0) * smoothstep(0.4, 0.0, h) * k;

  // dither 去掉色帶
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
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

/**
 * SilkField — 淡藍-青的「絲綢光場」，原生 WebGL（一個全螢幕三角形 + 一支 fragment shader）。
 * 鋪滿父層（父層需 relative + overflow-hidden），aria-hidden、不吃滑鼠事件。
 *
 * - 只在進入視窗、分頁可見時跑 rAF；prefers-reduced-motion 只畫一幀靜態
 * - devicePixelRatio 上限 1.5；寬度 < 1024 以 DPR 1、解析度減半渲染
 * - WebGL 不可用（或 shader 編譯失敗）時 render null，讓外層的 CSS 光暈露出來
 * - 第一幀畫好後以 1.4s 淡入
 */
export function SilkField({ className = '', intensity = 0.7, speed = 1 }: SilkFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  // 參數改用 ref 讀，改 props 不必重建 WebGL context
  const intensityRef = useRef(intensity);
  const speedRef = useRef(speed);
  intensityRef.current = Math.min(1, Math.max(0, intensity));
  speedRef.current = speed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
    });
    if (!gl) {
      setFailed(true);
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      setFailed(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    // 一個蓋過整個 clip space 的三角形
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_res');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uIntensity = gl.getUniformLocation(program, 'u_intensity');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    // 起始時間錯開，同頁的兩片絲綢不會長得一樣
    let time = Math.random() * 40;
    let last = 0;
    let raf = 0;
    let inView = false;
    let drawnOnce = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const small = window.innerWidth < 1024;
      const scale = small ? 0.5 : Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(rect.width * scale));
      const h = Math.max(1, Math.round(rect.height * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = () => {
      gl.uniform1f(uTime, time);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uIntensity, intensityRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!drawnOnce) {
        drawnOnce = true;
        setReady(true);
      }
    };

    const frame = (now: number) => {
      const dt = last ? Math.min(now - last, 64) / 1000 : 0;
      last = now;
      time += dt * speedRef.current;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced || raf || !inView || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!raf) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      mouse.tx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      mouse.ty = Math.min(1, Math.max(0, 1 - (e.clientY - rect.top) / rect.height));
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const ro = new ResizeObserver(() => {
      resize();
      // 靜態（reduced motion）或暫停中時，尺寸變了也要重畫，否則畫面被拉伸
      if (!raf) draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(canvas);

    resize();
    draw();

    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    canvas.addEventListener('webglcontextlost', onLost);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      // 不呼叫 WEBGL_lose_context：StrictMode 會在同一個 canvas 上重跑 effect，
      // 拿回來的會是已遺失的 context。canvas 卸載後瀏覽器自行回收
    };
  }, []);

  if (failed) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-[1400ms] ease-out ${
        ready ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    />
  );
}
