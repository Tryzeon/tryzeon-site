'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';
import { hexToVec3 } from '@/components/three/glsl';

/**
 * AI 引擎的粒子場：數千顆光點一開始散在四周（各通路的試穿、推薦、瀏覽數據），
 * 隨捲動進度沿螺旋匯進中央一道旋轉的光環（共用的 AI 引擎）。
 * progress 由父層的 ScrollTrigger 寫入（0–1），這裡每個 frame 讀一次。
 */

const VERTEX = /* glsl */ `
  attribute vec3 aScatter;
  attribute vec3 aRing;
  attribute float aSeed;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixel;
  varying float vAlpha;
  varying float vHue;

  mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

  void main() {
    float p = smoothstep(aSeed * 0.55, aSeed * 0.55 + 0.45, uProgress);
    vec3 ring = aRing;
    ring.xz = rot(uTime * (0.18 + aSeed * 0.22)) * ring.xz;
    vec3 scatter = aScatter + 0.35 * vec3(
      sin(uTime * 0.31 + aSeed * 21.0),
      cos(uTime * 0.27 + aSeed * 13.0),
      sin(uTime * 0.23 + aSeed * 7.0)
    );
    vec3 pos = mix(scatter, ring, p);
    pos.xz = rot((1.0 - p) * p * 5.0) * pos.xz;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(uPixel * (0.6 + aSeed * 1.8) * (10.0 / -mv.z), 28.0);
    vAlpha = mix(0.45, 1.0, p);
    vHue = aSeed * 0.6 + atan(ring.z, ring.x) / 6.2831;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uLilac;
  uniform vec3 uIce;
  uniform vec3 uAqua;
  varying float vAlpha;
  varying float vHue;

  vec3 opal(float k) {
    float s = 0.5 + 0.5 * sin(k * 6.2831);
    return s < 0.5 ? mix(uLilac, uIce, s * 2.0) : mix(uIce, uAqua, (s - 0.5) * 2.0);
  }

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float a = (core * core + smoothstep(0.18, 0.0, d) * 0.8) * vAlpha;
    gl_FragColor = vec4(mix(opal(vHue), vec3(1.0), smoothstep(0.12, 0.0, d) * 0.6) * a, a);
  }
`;

interface EngineParticlesProps {
  progress: MutableRefObject<number>;
}

export function EngineParticles({ progress }: EngineParticlesProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 768;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: false });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x08090f, 1);
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    host.appendChild(canvas);

    const scene = new Scene();
    const camera = new PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 13);

    const count = small ? 4000 : 9000;
    const scatter = new Float32Array(count * 3);
    const ring = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // 散佈：一層厚厚的球殼
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const r = 6 + Math.random() * 9;
      const s = Math.sqrt(1 - u * u);
      scatter.set([r * s * Math.cos(t), r * u * 0.7, r * s * Math.sin(t)], i * 3);
      // 光環：主環加一點厚度，少數落在內圈形成第二層
      const a = Math.random() * Math.PI * 2;
      const inner = Math.random() < 0.18;
      const R = (inner ? 3.9 : 5.6) + (Math.random() - 0.5) * (inner ? 0.3 : 0.7);
      ring.set([R * Math.cos(a), (Math.random() - 0.5) * 0.28, R * Math.sin(a)], i * 3);
      seed[i] = Math.random();
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(ring.slice(), 3));
    geometry.setAttribute('aScatter', new BufferAttribute(scatter, 3));
    geometry.setAttribute('aRing', new BufferAttribute(ring, 3));
    geometry.setAttribute('aSeed', new BufferAttribute(seed, 1));

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: reduceMotion ? 1 : progress.current },
      uPixel: { value: renderer.getPixelRatio() * (small ? 3.6 : 4.4) },
      uLilac: { value: hexToVec3('#C9B8FF') },
      uIce: { value: hexToVec3('#9CC8FF') },
      uAqua: { value: hexToVec3('#6EE7F0') },
    };
    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const points = new Points(geometry, material);
    points.rotation.x = 1.02;
    points.frustumCulled = false;
    scene.add(points);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = camera.aspect < 1 ? 19 : 13;
      camera.updateProjectionMatrix();
    };
    resize();

    let raf = 0;
    let running = false;
    let inView = false;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      uniforms.uTime.value += dt;
      uniforms.uProgress.value += (progress.current - uniforms.uProgress.value) * (1 - Math.pow(0.001, dt));
      points.rotation.z += dt * 0.04;
      renderer.render(scene, camera);
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
    if (reduceMotion) renderer.render(scene, camera);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
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

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [progress]);

  return <div ref={hostRef} className="absolute inset-0" aria-hidden />;
}
