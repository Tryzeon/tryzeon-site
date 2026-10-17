// 站內 WebGL 小工具：編譯 shader、全螢幕三角形、可見才跑的 render loop。
// 不引入 three.js 等套件（CLAUDE.md：新增依賴要先問）；SilkField／ParticleLogo 共用。

export function compileProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('createShader failed');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`shader compile failed: ${log ?? ''}`);
    }
    return shader;
  };
  const program = gl.createProgram();
  if (!program) throw new Error('createProgram failed');
  const vs = compile(gl.VERTEX_SHADER, vertexSource);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`program link failed: ${gl.getProgramInfoLog(program) ?? ''}`);
  }
  return program;
}

/** 蓋滿畫布的單一三角形（比兩個三角形的 quad 少一條對角線的 overdraw） */
export function bindFullscreenTriangle(gl: WebGLRenderingContext, program: WebGLProgram, attribute = 'a_position') {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const location = gl.getAttribLocation(program, attribute);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  return buffer;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface VisibleLoopOptions {
  /** 每一幀：time 是累計的「可見時間」（秒），暫停期間不會跳秒 */
  frame: (time: number, dt: number) => void;
  /** 只畫一幀、不跑迴圈（prefers-reduced-motion） */
  still?: boolean;
}

/**
 * 只在元素進入視窗、分頁在前景時跑 requestAnimationFrame。
 * 回傳 cleanup。暫停時保留時間軸，恢復後動畫從原處接續。
 */
export function runVisibleLoop(target: Element, { frame, still = false }: VisibleLoopOptions): () => void {
  let raf = 0;
  let inView = false;
  let last = 0;
  let elapsed = 0;

  const tick = (now: number) => {
    const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
    last = now;
    elapsed += dt;
    frame(elapsed, dt);
    raf = requestAnimationFrame(tick);
  };

  const sync = () => {
    const shouldRun = inView && document.visibilityState === 'visible';
    if (shouldRun && !raf) {
      last = 0;
      raf = requestAnimationFrame(tick);
    } else if (!shouldRun && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  if (still) {
    frame(4, 0);
    return () => {};
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      sync();
    },
    { rootMargin: '120px' },
  );
  observer.observe(target);
  document.addEventListener('visibilitychange', sync);

  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', sync);
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };
}
