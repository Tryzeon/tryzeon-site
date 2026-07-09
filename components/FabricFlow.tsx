'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SectionHeader } from '@/components/SectionHeader';

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vElev;

  float wave(vec2 p, float t) {
    float e = 0.0;
    e += sin(p.x * 0.55 + t * 0.75) * 0.42;
    e += sin(p.y * 0.85 - t * 0.55) * 0.30;
    e += sin((p.x * 0.7 + p.y * 0.9) + t * 0.95) * 0.24;
    e += sin((p.x * 1.7 - p.y * 1.2) - t * 0.8) * 0.11;
    float d = length(p - uMouse);
    e += sin(d * 1.6 - t * 2.2) * 0.30 * exp(-d * d * 0.06);
    return e;
  }

  void main() {
    float t = uTime;
    float eps = 0.15;
    float e0 = wave(position.xy, t);
    float ex = wave(position.xy + vec2(eps, 0.0), t);
    float ey = wave(position.xy + vec2(0.0, eps), t);

    vec3 p0 = vec3(position.x, position.y, e0);
    vec3 px = vec3(position.x + eps, position.y, ex);
    vec3 py = vec3(position.x, position.y + eps, ey);
    vec3 nrm = normalize(cross(px - p0, py - p0));

    vElev = e0;
    vNormal = normalize(normalMatrix * nrm);

    vec4 mvPosition = modelViewMatrix * vec4(p0, 1.0);
    vView = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uLightDir;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vElev;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);
    vec3 L = normalize(uLightDir);
    vec3 H = normalize(L + V);

    float diff = max(dot(N, L), 0.0) * 0.55 + 0.45;
    float spec = pow(max(dot(N, H), 0.0), 48.0);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);

    float h = clamp(vElev * 0.7 + 0.5, 0.0, 1.0);

    // airy pale-blue silk ramp (light-theme friendly)
    vec3 trough = vec3(0.16, 0.40, 0.92);   // saturated blue in folds
    vec3 mid    = vec3(0.48, 0.78, 0.99);   // light blue
    vec3 crest  = vec3(0.93, 0.99, 1.00);   // near-white peaks
    vec3 base = mix(trough, mid, smoothstep(0.0, 0.55, h));
    base = mix(base, crest, smoothstep(0.55, 1.0, h));

    // iridescent shimmer
    float ir = sin(vElev * 7.0 + fres * 7.0 + uTime * 0.5) * 0.5 + 0.5;
    base += vec3(0.0, 0.10, 0.16) * ir * 0.6;

    vec3 col = base * diff;
    col = mix(col, vec3(0.97, 1.0, 1.0), fres * 0.5);  // bright rim
    col += spec * vec3(0.85, 0.95, 1.0);               // silk sheen

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function FabricFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 1;
    let height = container.clientHeight || 1;
    let raf = 0;
    let running = false;
    const clock = new THREE.Clock();
    const mouse = new THREE.Vector2(0, 0);
    const mouseTarget = new THREE.Vector2(0, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 6.2);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uLightDir: { value: new THREE.Vector3(0.4, 0.9, 0.6).normalize() },
    };

    const geometry = new THREE.PlaneGeometry(15, 9, 240, 160);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -0.62;
    mesh.rotation.z = 0.08;
    scene.add(mesh);

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTarget.set(nx * 5.0, ny * 3.0);
    };
    window.addEventListener('pointermove', onPointerMove);

    const renderFrame = () => {
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      mouse.lerp(mouseTarget, 0.05);
      uniforms.uMouse.value.copy(mouse);
      mesh.rotation.z = 0.08 + Math.sin(t * 0.15) * 0.04;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(renderFrame);
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(renderFrame);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startLoop();
        else stopLoop();
      },
      { rootMargin: '120px' },
    );
    io.observe(container);

    const onResize = () => {
      width = container.clientWidth || 1;
      height = container.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      stopLoop();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      const canvas = renderer.domElement;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [reduced]);

  return (
    <section
      id="channels"
      className="relative bg-[#FAFAFA] pt-24 md:pt-36 pb-16 md:pb-24 overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeader
          kicker="N°04 — Omnichannel"
          title={
            <>
              一套 AI 試穿，
              <span className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent">
                無縫流動於每個通路
              </span>
              。
            </>
          }
          lede="門市、Tryzeon App、品牌官網——像絲綢一樣，同一套體驗順暢流過每個接觸點。"
          className="!mb-8 md:!mb-10"
        />
      </div>

      {reduced ? (
        <div className="relative w-full h-[42vh] md:h-[52vh] bg-[linear-gradient(120deg,#2563EB_0%,#60A5FA_45%,#06B6D4_100%)] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]" />
      ) : (
        <div ref={containerRef} className="relative w-full h-[52vh] md:h-[64vh]" />
      )}
    </section>
  );
}
