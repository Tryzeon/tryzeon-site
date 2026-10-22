'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// 同時存在的波紋數；舊的會被新的蓋掉
const MAX_DROPS = 8;
// 一道波紋從出現到消失（秒）
const DROP_LIFE = 1.8;
// 游標移動多遠（以圖片寬度為 1）才丟下一道新的波紋
const DROP_SPACING = 0.035;
// 位移幅度（CSS px），小圖、大圖都是同樣的手感
const AMP_PX = 7;

const VERT = `
attribute vec2 p;
varying vec2 v;
void main() {
  v = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

// 每道波紋是一圈往外走的波包（不是一路擴散到邊的水波），振幅隨時間衰減；
// 游標底下再加一點「布被手指頂起來」的鼓起。位移的方向拿來打光，看起來像布的起伏與皺褶
const FRAG = `
precision mediump float;
uniform sampler2D u_tex;
uniform float u_aspect;
uniform vec2 u_amp;
uniform vec4 u_drops[${MAX_DROPS}];
uniform vec2 u_mouse;
uniform float u_hover;
varying vec2 v;
void main() {
  vec2 asp = vec2(u_aspect, 1.0);
  vec2 disp = vec2(0.0);
  for (int i = 0; i < ${MAX_DROPS}; i++) {
    vec4 d = u_drops[i];
    if (d.w > 0.0) {
      vec2 dv = (v - d.xy) * asp;
      float dist = length(dv) + 0.0001;
      float x = dist - d.z * 0.6;
      float env = exp(-x * x * 40.0) * exp(-d.z * 2.4) * d.w;
      disp += (dv / dist) * sin(x * 26.0) * env;
    }
  }
  vec2 mv = (v - u_mouse) * asp;
  disp -= mv * exp(-dot(mv, mv) * 18.0) * u_hover * 2.5;
  vec3 col = texture2D(u_tex, clamp(v + disp * u_amp, 0.0, 1.0)).rgb;
  col += dot(disp, vec2(-0.55, 0.83)) * 0.09;
  gl_FragColor = vec4(col, 1.0);
}`;

interface ClothRippleProps {
  /** 單張 next/image；canvas 疊在它上面 */
  children: ReactNode;
  /** 材質用的原圖（APP_IMAGES 的 src）。next/image 給小卡的是縮小版，拿來當材質放大會糊 */
  src: string;
  className?: string;
}

/**
 * ClothRipple — 游標劃過商品照時，圖片像布一樣起波紋（WebGL，無套件）。
 * 只用在服飾平拍圖；App 截圖與人像不套。
 * 第一次 hover 才載入原圖、建立 WebGL；波紋平息後停掉 rAF、canvas 淡出，底下的 <img> 一直都在（SSR、無障礙、無 WebGL 時都看得到）。
 * 觸控裝置：點一下丟一道波紋。
 */
export function ClothRipple({ children, src, className = '' }: ClothRippleProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let gl: WebGLRenderingContext | null = null;
    let texture: HTMLImageElement | null = null;
    let loc: Record<'aspect' | 'amp' | 'drops' | 'mouse' | 'hover', WebGLUniformLocation | null> | null = null;
    let failed = false;
    const drops = new Float32Array(MAX_DROPS * 4);
    let nextDrop = 0;
    let hover = 0;
    let hoverTarget = 0;
    let mouse = { x: 0.5, y: 0.5 };
    let last = { x: 0.5, y: 0.5, t: 0 };
    let raf = 0;
    let prev = 0;

    // 建立 context、編譯 shader、上傳材質；原圖還沒載好就先去載，載好後再接著開始
    const ensure = () => {
      if (gl) return true;
      if (failed) return false;
      if (!texture) {
        texture = new Image();
        texture.onload = () => {
          if (ensure()) start();
        };
        texture.src = src;
        return false;
      }
      const img = texture;
      if (!img.complete || !img.naturalWidth) return false;
      const ctx = canvas.getContext('webgl', { premultipliedAlpha: false });
      if (!ctx) {
        failed = true;
        return false;
      }
      const shader = (type: number, src: string) => {
        const s = ctx.createShader(type)!;
        ctx.shaderSource(s, src);
        ctx.compileShader(s);
        return s;
      };
      const prog = ctx.createProgram()!;
      ctx.attachShader(prog, shader(ctx.VERTEX_SHADER, VERT));
      ctx.attachShader(prog, shader(ctx.FRAGMENT_SHADER, FRAG));
      ctx.linkProgram(prog);
      if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) {
        failed = true;
        return false;
      }
      ctx.useProgram(prog);

      ctx.bindBuffer(ctx.ARRAY_BUFFER, ctx.createBuffer());
      ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), ctx.STATIC_DRAW);
      const p = ctx.getAttribLocation(prog, 'p');
      ctx.enableVertexAttribArray(p);
      ctx.vertexAttribPointer(p, 2, ctx.FLOAT, false, 0, 0);

      ctx.bindTexture(ctx.TEXTURE_2D, ctx.createTexture());
      ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
      ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, img);

      loc = {
        aspect: ctx.getUniformLocation(prog, 'u_aspect'),
        amp: ctx.getUniformLocation(prog, 'u_amp'),
        drops: ctx.getUniformLocation(prog, 'u_drops'),
        mouse: ctx.getUniformLocation(prog, 'u_mouse'),
        hover: ctx.getUniformLocation(prog, 'u_hover'),
      };
      gl = ctx;
      return true;
    };

    const frame = (now: number) => {
      if (!gl || !loc) return;
      // 第一幀從 rAF 自己的時間戳開始算：rAF 給的是這一幀的起點，可能比 start() 當下的 performance.now() 還早，
      // dt 一旦是負的，hover 的緩動就會發散
      const dt = prev < 0 ? 0 : Math.min(0.05, Math.max(0, (now - prev) / 1000));
      prev = now;
      hover += (hoverTarget - hover) * (1 - Math.exp(-dt * 8));
      let alive = hover > 0.002;
      for (let i = 0; i < MAX_DROPS; i++) {
        if (drops[i * 4 + 3] <= 0) continue;
        drops[i * 4 + 2] += dt;
        if (drops[i * 4 + 2] > DROP_LIFE) drops[i * 4 + 3] = 0;
        else alive = true;
      }

      // 尺寸每幀對一次：舞台縮放、版面變動時 canvas 跟著
      const w = root.clientWidth;
      const h = root.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.uniform1f(loc.aspect, w / h);
      gl.uniform2f(loc.amp, AMP_PX / w, AMP_PX / h);
      gl.uniform4fv(loc.drops, drops);
      gl.uniform2f(loc.mouse, mouse.x, mouse.y);
      gl.uniform1f(loc.hover, hover);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (alive) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        canvas.style.opacity = '0';
      }
    };

    const start = () => {
      canvas.style.opacity = '1';
      if (raf) return;
      prev = -1;
      raf = requestAnimationFrame(frame);
    };

    // 換成材質座標：x 往右、y 往上（與 shader 的 v 一致）
    const toUv = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
    };
    const addDrop = (x: number, y: number, strength: number) => {
      drops.set([x, y, 0, strength], nextDrop * 4);
      nextDrop = (nextDrop + 1) % MAX_DROPS;
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouse = toUv(e);
      last = { ...mouse, t: performance.now() };
      hoverTarget = 1;
      if (ensure()) start();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouse = toUv(e);
      if (!gl) return;
      const now = performance.now();
      const dist = Math.hypot(mouse.x - last.x, mouse.y - last.y);
      if (dist < DROP_SPACING) return;
      // 劃得越快，波紋越強
      const speed = dist / Math.max(0.008, (now - last.t) / 1000);
      addDrop(mouse.x, mouse.y, Math.min(1, 0.25 + speed * 0.35));
      last = { ...mouse, t: now };
      start();
    };
    const onLeave = () => {
      hoverTarget = 0;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      const uv = toUv(e);
      addDrop(uv.x, uv.y, 1);
      if (ensure()) start();
    };

    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointerdown', onDown);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerdown', onDown);
      if (texture) texture.onload = null;
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [src]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-200"
      />
    </div>
  );
}
