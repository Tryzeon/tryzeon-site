'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SectionHeader } from '@/components/SectionHeader';

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec3 vNormal;
  varying vec3 vTangent;
  varying vec3 vView;
  varying float vElev;
  varying vec2 vPos;

  // 褶皺剖面：窄脊寬谷（1 - |sin|）。純正弦的圓弧起伏是水波的數學特徵，
  // 布料的皺摺是不對稱的——脊線窄而銳、谷面寬而緩。
  // +0.035 讓脊尖保留一點圓角，有限差分法線才不會在脊線上炸出鋸齒。
  float ridge(float x) {
    return 1.0 - sqrt(sin(x) * sin(x) + 0.035);
  }

  float wave(vec2 p, float t) {
    float e = 0.0;
    e += (ridge(p.x * 0.55 + p.y * 0.15 + t * 0.50) - 0.40) * 0.62;
    e += sin(p.y * 0.85 - t * 0.38) * 0.22;
    e += (ridge((p.x * 0.7 + p.y * 0.9) + t * 0.62) - 0.40) * 0.30;
    e += sin((p.x * 1.7 - p.y * 1.2) - t * 0.55) * 0.09;
    // cloth-lift：游標像一隻手從布底下緩緩托起（取代原本的水滴漣漪——
    // 那是整頁最快、最「液態」的動作）
    float d = length(p - uMouse);
    e += 0.34 * exp(-d * d * 0.10) + sin(d * 1.3 - t * 1.1) * 0.06 * exp(-d * d * 0.08);
    return e;
  }

  void main() {
    float t = uTime;
    float eps = 0.09;
    float e0 = wave(position.xy, t);
    float ex = wave(position.xy + vec2(eps, 0.0), t);
    float ey = wave(position.xy + vec2(0.0, eps), t);

    vec3 p0 = vec3(position.x, position.y, e0);
    vec3 px = vec3(position.x + eps, position.y, ex);
    vec3 py = vec3(position.x, position.y + eps, ey);
    vec3 nrm = normalize(cross(px - p0, py - p0));

    vElev = e0;
    vPos = position.xy;
    vNormal = normalize(normalMatrix * nrm);
    vTangent = normalize(normalMatrix * normalize(px - p0));

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
  varying vec3 vTangent;
  varying vec3 vView;
  varying float vElev;
  varying vec2 vPos;

  void main() {
    vec3 N = normalize(vNormal);

    float depth = smoothstep(4.5, 9.0, length(vView));

    // 織紋微法線：大褶皺之間的細皺紋，幅度壓得極低（>0.01 就開始讀成
    // 編織網/髒點，headless 實測過）；遠景按深度衰減防斜掠角 moiré；
    // uTime*0.12 讓紋理近乎靜止地緩慢呼吸。
    float wr = sin(vPos.x * 7.0 + vPos.y * 17.0 + vElev * 3.0)
             + 0.6 * sin(vPos.y * 26.0 - vPos.x * 10.0 + uTime * 0.12);
    wr *= 1.0 - depth * 0.85;
    N = normalize(N + vec3(wr * 0.010, wr * 0.007, 0.0));

    vec3 V = normalize(vView);
    vec3 L = normalize(uLightDir);
    vec3 H = normalize(L + V);

    float diff = max(dot(N, L), 0.0) * 0.72 + 0.28;

    // Kajiya-Kay 各向異性絲光：絲的高光是沿織線方向拉開的長條，
    // 不是 Blinn-Phong 那種圓形濕亮點（濕亮點 = 液體的 tell）
    vec3 T = normalize(vTangent);
    float TdotH = dot(T, H);
    float sinTH = sqrt(max(1.0 - TdotH * TdotH, 0.0));
    float spec = pow(sinTH, 110.0) * 0.42 + pow(max(dot(N, H), 0.0), 64.0) * 0.10;
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);

    float h = clamp(vElev * 0.7 + 0.5, 0.0, 1.0);

    // 布料靠褶影讀形：谷更深的品牌藍、頂離開純白往淡青收
    vec3 trough = vec3(0.10, 0.29, 0.74);
    vec3 mid    = vec3(0.35, 0.67, 0.95);
    vec3 crest  = vec3(0.80, 0.94, 0.99);
    vec3 base = mix(trough, mid, smoothstep(0.0, 0.55, h));
    base = mix(base, crest, smoothstep(0.55, 1.0, h));

    float ir = sin(vElev * 7.0 + fres * 7.0 + uTime * 0.35) * 0.5 + 0.5;
    base += vec3(0.0, 0.10, 0.16) * ir * 0.32;

    vec3 col = base * diff;
    // 谷底 occlusion：立體感來自褶皺陰影，不是發光的頂
    col *= 0.82 + 0.18 * smoothstep(-0.7, 0.5, vElev);
    col = mix(col, vec3(0.86, 0.96, 1.0), fres * 0.22);
    col += spec * vec3(0.72, 0.90, 1.00);

    // 空氣透視：遠端往頁面底色 #FAFAFA 收，絲綢退入頁面
    // 而不是一塊浮著的動畫長方形
    col = mix(col, vec3(0.980, 0.984, 0.988), depth * 0.60);

    // shimmer 降低後，淡藍大面積漸層在 8-bit 螢幕會 banding，補 1/255 dither
    col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function FabricFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  // lazy init：reduced-motion 使用者不必先建一個 WebGL context 再拆掉
  // （此元件 dynamic ssr:false，首次 render 已在 client）
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
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
      // 光壓低角度：斜掠光讓褶皺接住長條絲光（頂光只會照平整面）
      uLightDir: { value: new THREE.Vector3(0.55, 0.65, 0.52).normalize() },
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
      mouse.lerp(mouseTarget, 0.035);
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
