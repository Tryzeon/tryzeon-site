'use client';

/**
 * GradientWave — Stripe-style flowing WebGL gradient backdrop.
 *
 * Adapted from 21st.dev "Gradient Wave" inspiration (similarity 0.287)
 * — self-contained WebGL (no npm deps), customizable colors + speed.
 *
 * Use case: Tryzeon Hero ambient background, positioned absolute inset-0
 * behind typography + video thumbnail. Subtle, slow, no-AI-purple slop.
 *
 * Performance notes:
 *  - WebGL shader runs at 60fps (or 15fps cap during animation)
 *  - resize listener cleans up on unmount
 *  - Respects prefers-reduced-motion (stops animation)
 */

import { useEffect, useRef } from 'react';

function normalizeColor(hexCode: number): number[] {
  return [
    ((hexCode >> 16) & 255) / 255,
    ((hexCode >> 8) & 255) / 255,
    (255 & hexCode) / 255,
  ];
}

// Minimal WebGL helper class adapted from Stripe gradient.
class MiniGl {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  meshes: Mesh[] = [];
  commonUniforms: Record<string, Uniform>;
  width = 0;
  height = 0;
  Uniform: typeof Uniform;
  Attribute: typeof Attribute;
  Material: typeof Material;
  PlaneGeometry: typeof PlaneGeometry;
  Mesh: typeof Mesh;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl', { antialias: true });
    if (!gl) throw new Error('WebGL not supported');
    this.gl = gl;

    Uniform.context = gl;
    Attribute.context = gl;
    Material.miniGl = this;
    PlaneGeometry.miniGl = this;

    this.Uniform = Uniform;
    this.Attribute = Attribute;
    this.Material = Material;
    this.PlaneGeometry = PlaneGeometry;
    this.Mesh = Mesh;

    const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    this.commonUniforms = {
      projectionMatrix: new Uniform({ type: 'mat4', value: identity }),
      modelViewMatrix: new Uniform({ type: 'mat4', value: identity }),
      resolution: new Uniform({ type: 'vec2', value: [1, 1] }),
      aspectRatio: new Uniform({ type: 'float', value: 1 }),
    };
  }

  setSize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
    this.commonUniforms.resolution.value = [w, h];
    this.commonUniforms.aspectRatio.value = w / h;
  }

  setOrthographicCamera() {
    this.commonUniforms.projectionMatrix.value = [
      2 / this.width, 0, 0, 0,
      0, 2 / this.height, 0, 0,
      0, 0, -0.001, 0,
      0, 0, 0, 1,
    ];
  }

  render() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clearDepth(1);
    this.meshes.forEach((m) => m.draw());
  }
}

class Uniform {
  static context: WebGLRenderingContext;
  type: string;
  value: unknown;
  typeFn: string;
  excludeFrom?: string;
  transpose?: boolean;

  constructor(opts: { type?: string; value?: unknown; excludeFrom?: string; transpose?: boolean }) {
    this.type = opts.type ?? 'float';
    this.value = opts.value;
    this.excludeFrom = opts.excludeFrom;
    this.transpose = opts.transpose;
    const typeMap: Record<string, string> = {
      float: '1f', int: '1i', vec2: '2fv', vec3: '3fv', vec4: '4fv', mat4: 'Matrix4fv',
    };
    this.typeFn = typeMap[this.type] || '1f';
  }

  update(location: WebGLUniformLocation | null) {
    if (this.value === undefined || location === null) return;
    const ctx = Uniform.context as unknown as Record<string, (...a: unknown[]) => void>;
    const fnName = `uniform${this.typeFn}`;
    const isMatrix = this.typeFn.indexOf('Matrix') === 0;
    if (isMatrix) ctx[fnName](location, this.transpose ?? false, this.value);
    else ctx[fnName](location, this.value);
  }

  getDeclaration(name: string, type: string, length?: number): string {
    if (this.excludeFrom === type) return '';
    if (this.type === 'array') {
      const arr = this.value as Uniform[];
      return arr[0].getDeclaration(name, type, arr.length) + `\nconst int ${name}_length = ${arr.length};`;
    }
    if (this.type === 'struct') {
      const nameNoPrefix = name.replace('u_', '');
      const cap = nameNoPrefix.charAt(0).toUpperCase() + nameNoPrefix.slice(1);
      const obj = this.value as Record<string, Uniform>;
      const fields = Object.entries(obj)
        .map(([n, u]) => u.getDeclaration(n, type).replace(/^uniform/, ''))
        .join('');
      return `uniform struct ${cap} \n{\n${fields}\n} ${name}${length ? `[${length}]` : ''};`;
    }
    return `uniform ${this.type} ${name}${length ? `[${length}]` : ''};`;
  }
}

class Attribute {
  static context: WebGLRenderingContext;
  type: number;
  normalized = false;
  buffer: WebGLBuffer;
  target!: number;
  size!: number;
  values?: Float32Array | Uint16Array;

  constructor(opts: { target: number; size: number; type?: number }) {
    this.buffer = Attribute.context.createBuffer()!;
    this.type = opts.type ?? Attribute.context.FLOAT;
    this.target = opts.target;
    this.size = opts.size;
  }

  update() {
    if (this.values) {
      Attribute.context.bindBuffer(this.target, this.buffer);
      Attribute.context.bufferData(this.target, this.values, Attribute.context.STATIC_DRAW);
    }
  }

  attach(name: string, program: WebGLProgram): number {
    const loc = Attribute.context.getAttribLocation(program, name);
    if (this.target === Attribute.context.ARRAY_BUFFER) {
      Attribute.context.bindBuffer(this.target, this.buffer);
      Attribute.context.enableVertexAttribArray(loc);
      Attribute.context.vertexAttribPointer(loc, this.size, this.type, this.normalized, 0, 0);
    }
    return loc;
  }

  use(loc: number) {
    Attribute.context.bindBuffer(this.target, this.buffer);
    if (this.target === Attribute.context.ARRAY_BUFFER) {
      Attribute.context.enableVertexAttribArray(loc);
      Attribute.context.vertexAttribPointer(loc, this.size, this.type, this.normalized, 0, 0);
    }
  }
}

class Material {
  static miniGl: MiniGl;
  uniforms: Record<string, Uniform>;
  uniformInstances: Array<{ uniform: Uniform; location: WebGLUniformLocation | null }> = [];
  program: WebGLProgram;

  constructor(vertexShader: string, fragmentShader: string, uniforms: Record<string, Uniform>) {
    const ctx = Material.miniGl.gl;
    const compile = (type: number, src: string) => {
      const sh = ctx.createShader(type)!;
      ctx.shaderSource(sh, src);
      ctx.compileShader(sh);
      if (!ctx.getShaderParameter(sh, ctx.COMPILE_STATUS)) {
        console.error(ctx.getShaderInfoLog(sh));
        throw new Error('Shader compile failed');
      }
      return sh;
    };

    const declarations = (us: Record<string, Uniform>, type: string) =>
      Object.entries(us).map(([n, u]) => u.getDeclaration(n, type)).join('\n');

    const prefix = 'precision highp float;';
    const vSource = `${prefix}\nattribute vec4 position;\nattribute vec2 uv;\nattribute vec2 uvNorm;\n${declarations(Material.miniGl.commonUniforms, 'vertex')}\n${declarations(uniforms, 'vertex')}\n${vertexShader}`;
    const fSource = `${prefix}\n${declarations(Material.miniGl.commonUniforms, 'fragment')}\n${declarations(uniforms, 'fragment')}\n${fragmentShader}`;

    this.uniforms = uniforms;
    this.program = ctx.createProgram()!;
    ctx.attachShader(this.program, compile(ctx.VERTEX_SHADER, vSource));
    ctx.attachShader(this.program, compile(ctx.FRAGMENT_SHADER, fSource));
    ctx.linkProgram(this.program);
    if (!ctx.getProgramParameter(this.program, ctx.LINK_STATUS)) {
      console.error(ctx.getProgramInfoLog(this.program));
      throw new Error('Program link failed');
    }

    ctx.useProgram(this.program);
    this.attachUniforms(undefined, Material.miniGl.commonUniforms);
    this.attachUniforms(undefined, this.uniforms);
  }

  attachUniforms(name: string | undefined, uniforms: unknown) {
    if (name === undefined) {
      Object.entries(uniforms as Record<string, Uniform>).forEach(([n, u]) =>
        this.attachUniforms(n, u),
      );
    } else {
      const u = uniforms as Uniform;
      if (u.type === 'array') {
        (u.value as Uniform[]).forEach((sub, i) => this.attachUniforms(`${name}[${i}]`, sub));
      } else if (u.type === 'struct') {
        Object.entries(u.value as Record<string, Uniform>).forEach(([k, v]) =>
          this.attachUniforms(`${name}.${k}`, v),
        );
      } else {
        this.uniformInstances.push({
          uniform: u,
          location: Material.miniGl.gl.getUniformLocation(this.program, name),
        });
      }
    }
  }
}

class PlaneGeometry {
  static miniGl: MiniGl;
  width = 1;
  height = 1;
  attributes: Record<string, Attribute>;
  vertexCount = 0;
  xSegCount = 0;
  ySegCount = 0;

  constructor() {
    const ctx = PlaneGeometry.miniGl.gl;
    this.attributes = {
      position: new Attribute({ target: ctx.ARRAY_BUFFER, size: 3 }),
      uv: new Attribute({ target: ctx.ARRAY_BUFFER, size: 2 }),
      uvNorm: new Attribute({ target: ctx.ARRAY_BUFFER, size: 2 }),
      index: new Attribute({ target: ctx.ELEMENT_ARRAY_BUFFER, size: 3, type: ctx.UNSIGNED_SHORT }),
    };
  }

  setTopology(xSegs = 1, ySegs = 1) {
    this.xSegCount = xSegs;
    this.ySegCount = ySegs;
    this.vertexCount = (xSegs + 1) * (ySegs + 1);
    const quadCount = xSegs * ySegs * 2;
    this.attributes.uv.values = new Float32Array(2 * this.vertexCount);
    this.attributes.uvNorm.values = new Float32Array(2 * this.vertexCount);
    this.attributes.index.values = new Uint16Array(3 * quadCount);

    for (let y = 0; y <= ySegs; y++) {
      for (let x = 0; x <= xSegs; x++) {
        const i = y * (xSegs + 1) + x;
        (this.attributes.uv.values as Float32Array)[2 * i] = x / xSegs;
        (this.attributes.uv.values as Float32Array)[2 * i + 1] = 1 - y / ySegs;
        (this.attributes.uvNorm.values as Float32Array)[2 * i] = (x / xSegs) * 2 - 1;
        (this.attributes.uvNorm.values as Float32Array)[2 * i + 1] = 1 - (y / ySegs) * 2;

        if (x < xSegs && y < ySegs) {
          const s = y * xSegs + x;
          (this.attributes.index.values as Uint16Array)[6 * s] = i;
          (this.attributes.index.values as Uint16Array)[6 * s + 1] = i + 1 + xSegs;
          (this.attributes.index.values as Uint16Array)[6 * s + 2] = i + 1;
          (this.attributes.index.values as Uint16Array)[6 * s + 3] = i + 1;
          (this.attributes.index.values as Uint16Array)[6 * s + 4] = i + 1 + xSegs;
          (this.attributes.index.values as Uint16Array)[6 * s + 5] = i + 2 + xSegs;
        }
      }
    }
    this.attributes.uv.update();
    this.attributes.uvNorm.update();
    this.attributes.index.update();
  }

  setSize(width = 1, height = 1) {
    this.width = width;
    this.height = height;
    this.attributes.position.values = new Float32Array(3 * this.vertexCount);
    const offsetX = width / -2;
    const offsetY = height / -2;
    const segWidth = width / this.xSegCount;
    const segHeight = height / this.ySegCount;

    for (let y = 0; y <= this.ySegCount; y++) {
      const posY = offsetY + y * segHeight;
      for (let x = 0; x <= this.xSegCount; x++) {
        const posX = offsetX + x * segWidth;
        const idx = y * (this.xSegCount + 1) + x;
        (this.attributes.position.values as Float32Array)[3 * idx] = posX;
        (this.attributes.position.values as Float32Array)[3 * idx + 1] = -posY;
        (this.attributes.position.values as Float32Array)[3 * idx + 2] = 0;
      }
    }
    this.attributes.position.update();
  }
}

class Mesh {
  geometry: PlaneGeometry;
  material: Material;
  attributeInstances: Array<{ attribute: Attribute; location: number }> = [];

  constructor(geometry: PlaneGeometry, material: Material) {
    this.geometry = geometry;
    this.material = material;
    Object.entries(geometry.attributes).forEach(([name, attr]) => {
      this.attributeInstances.push({
        attribute: attr,
        location: attr.attach(name, material.program),
      });
    });
    Material.miniGl.meshes.push(this);
  }

  draw() {
    const ctx = Material.miniGl.gl;
    ctx.useProgram(this.material.program);
    this.material.uniformInstances.forEach(({ uniform, location }) => uniform.update(location));
    this.attributeInstances.forEach(({ attribute, location }) => attribute.use(location));
    ctx.drawElements(
      ctx.TRIANGLES,
      this.geometry.attributes.index.values!.length,
      ctx.UNSIGNED_SHORT,
      0,
    );
  }
}

const vertexShader = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
vec3 blendNormal(vec3 base, vec3 blend, float opacity) { return (blend * opacity + base * (1.0 - opacity)); }
varying vec3 v_color;
void main() {
  float time = u_time * u_global.noiseSpeed;
  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;
  float tilt = resolution.y / 2.0 * uvNorm.y;
  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;
  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);
  float noise = snoise(vec3(
    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,
    noiseCoord.y * u_vertDeform.noiseFreq.y,
    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed
  )) * u_vertDeform.noiseAmp;
  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);
  noise = max(0.0, noise);
  vec3 pos = vec3(position.x, position.y + tilt + incline + noise - offset, position.z);
  v_color = u_baseColor;
  for (int i = 0; i < u_waveLayers_length; i++) {
    if (u_active_colors[i + 1] == 1.) {
      WaveLayers layer = u_waveLayers[i];
      float layerNoise = smoothstep(
        layer.noiseFloor, layer.noiseCeil,
        snoise(vec3(
          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,
          noiseCoord.y * layer.noiseFreq.y,
          time * layer.noiseSpeed + layer.noiseSeed
        )) / 2.0 + 0.5
      );
      v_color = blendNormal(v_color, layer.color, pow(layerNoise, 4.));
    }
  }
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

const fragmentShader = `
varying vec3 v_color;
void main() {
  gl_FragColor = vec4(v_color, 1.0);
}`;

class Gradient {
  canvas: HTMLCanvasElement;
  colors: string[];
  minigl: MiniGl;
  mesh!: Mesh;
  // 隨機起始相位：淡入時波已在流動中，而不是從靜止姿勢開始
  time = 1000 * 60 * Math.random();
  last = 0;
  animationId?: number;
  isPlaying = false;

  constructor(canvas: HTMLCanvasElement, colors: string[]) {
    this.canvas = canvas;
    this.colors = colors;
    this.minigl = new MiniGl(canvas);
    this.init();
  }

  init() {
    const sectionColors = this.colors.map((hex) =>
      normalizeColor(parseInt(hex.replace('#', '0x'), 16)),
    );

    const uniforms: Record<string, Uniform> = {
      u_time: new Uniform({ value: 0 }),
      u_shadow_power: new Uniform({ value: 5 }),
      u_darken_top: new Uniform({ value: 0 }),
      u_active_colors: new Uniform({ value: [1, 1, 1, 1], type: 'vec4' }),
      u_global: new Uniform({
        value: {
          noiseFreq: new Uniform({ value: [0.00014, 0.00029], type: 'vec2' }),
          noiseSpeed: new Uniform({ value: 0.000005 }),
        },
        type: 'struct',
      }),
      u_vertDeform: new Uniform({
        value: {
          incline: new Uniform({ value: 0 }),
          offsetTop: new Uniform({ value: -0.5 }),
          offsetBottom: new Uniform({ value: -0.5 }),
          noiseFreq: new Uniform({ value: [3, 4], type: 'vec2' }),
          noiseAmp: new Uniform({ value: 320 }),
          noiseSpeed: new Uniform({ value: 10 }),
          noiseFlow: new Uniform({ value: 3 }),
          noiseSeed: new Uniform({ value: 5 }),
        },
        type: 'struct',
        excludeFrom: 'fragment',
      }),
      u_baseColor: new Uniform({
        value: sectionColors[0],
        type: 'vec3',
        excludeFrom: 'fragment',
      }),
      u_waveLayers: new Uniform({ value: [], excludeFrom: 'fragment', type: 'array' }),
    };

    for (let i = 1; i < sectionColors.length; i++) {
      (uniforms.u_waveLayers.value as Uniform[]).push(
        new Uniform({
          value: {
            color: new Uniform({ value: sectionColors[i], type: 'vec3' }),
            noiseFreq: new Uniform({
              value: [2 + i / sectionColors.length, 3 + i / sectionColors.length],
              type: 'vec2',
            }),
            noiseSpeed: new Uniform({ value: 11 + 0.3 * i }),
            noiseFlow: new Uniform({ value: 6.5 + 0.3 * i }),
            noiseSeed: new Uniform({ value: 5 + 10 * i }),
            noiseFloor: new Uniform({ value: 0.1 }),
            noiseCeil: new Uniform({ value: 0.63 + 0.07 * i }),
          },
          type: 'struct',
        }),
      );
    }

    const material = new Material(vertexShader, fragmentShader, uniforms);
    const geometry = new PlaneGeometry();
    this.mesh = new Mesh(geometry, material);

    this.resize();
    window.addEventListener('resize', this.resize);
  }

  resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.minigl.setSize(w, h);
    this.minigl.setOrthographicCamera();
    const xSegs = Math.ceil(w * 0.02);
    const ySegs = Math.ceil(h * 0.05);
    this.mesh.geometry.setTopology(xSegs, ySegs);
    this.mesh.geometry.setSize(w, h);
  };

  animate = (timestamp: number) => {
    if (!this.isPlaying) return;
    this.time += Math.min(timestamp - this.last, 1000 / 15);
    this.last = timestamp;
    (this.mesh.material.uniforms.u_time as Uniform).value = this.time;
    this.minigl.render();
    this.animationId = requestAnimationFrame(this.animate);
  };

  start() {
    this.isPlaying = true;
    this.animationId = requestAnimationFrame(this.animate);
  }

  stop() {
    this.isPlaying = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resize);
  }
}

interface GradientWaveProps {
  /** Hex colors; first is base, rest are wave layers */
  colors?: string[];
  className?: string;
}

export function GradientWave({
  // Tryzeon palette: 藍青系 only（與 Hero AURORA 同源；禁 amber/rose）
  colors = ['#FAFAFA', '#E0E7FF', '#E0F2FE', '#CFFAFE', '#FAFAFA'],
  className = '',
}: GradientWaveProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'block',
      // dawn-in：hydration 到達的時間點不可控，aurora 用 1.4s 亮起
      // 而不是瞬間全亮 pop-in
      opacity: '0',
      transition: 'opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
    });
    containerRef.current.appendChild(canvas);

    let gradient: Gradient | null = null;
    try {
      gradient = new Gradient(canvas, colors);
      gradient.start();
      // 雙層 rAF：等第一個 shader frame commit 後才開始淡入
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          canvas.style.opacity = '1';
        });
      });
    } catch (err) {
      console.error('GradientWave init failed:', err);
    }

    return () => {
      gradient?.stop();
      if (containerRef.current?.contains(canvas)) {
        containerRef.current.removeChild(canvas);
      }
    };
  }, [colors]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none ${className}`}
      aria-hidden
    />
  );
}
