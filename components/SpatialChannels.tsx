'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface ChannelInfo {
  index: string;
  title: string;
  desc: string;
  accent: string;
}

interface PanelConfig {
  x: number;
  y: number;
  z: number;
  ry: number;
  color: number;
  scale: number;
  delay: number;
}

const CHANNELS: ChannelInfo[] = [
  {
    index: '01',
    title: '實體門市',
    desc: '門市裝置即拍即試，導購當場成交',
    accent: '#2563EB',
  },
  {
    index: '02',
    title: 'Tryzeon App',
    desc: '跨品牌雲端衣櫃，隨身試衣間',
    accent: '#0EA5C4',
  },
  {
    index: '03',
    title: '品牌官網 SDK',
    desc: 'embed 一行程式，官網即上線',
    accent: '#06B6D4',
  },
];

const PANELS: PanelConfig[] = [
  { x: -2.75, y: 0.25, z: -0.9, ry: 0.38, color: 0x2563eb, scale: 0.92, delay: 0 },
  { x: 0, y: 0, z: 0.4, ry: 0, color: 0xdce8ff, scale: 1.06, delay: 0.12 },
  { x: 2.75, y: -0.25, z: -0.9, ry: -0.38, color: 0x06b6d4, scale: 0.92, delay: 0.24 },
];

const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);

function StaticFallback() {
  return (
    <div className="grid sm:grid-cols-3 gap-4 md:gap-6 mt-12">
      {CHANNELS.map((c) => (
        <div
          key={c.index}
          className="rounded-3xl border border-[#101828]/8 bg-white p-8 shadow-[0_8px_30px_rgba(16,24,40,0.06)]"
        >
          <span
            className="font-mono text-xs tracking-[0.3em]"
            style={{ color: c.accent }}
          >
            {c.index}
          </span>
          <h3 className="mt-4 text-xl font-bold text-[#101828]">{c.title}</h3>
          <p className="mt-2 text-sm text-[#475467] leading-relaxed">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function SpatialChannels() {
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
    let started = false;
    let startTime = 0;

    const clock = new THREE.Clock();
    const pointer = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(3, 4, 5);
    scene.add(dir);
    const dirCyan = new THREE.DirectionalLight(0x06b6d4, 0.4);
    dirCyan.position.set(-4, -2, 2);
    scene.add(dirCyan);

    const group = new THREE.Group();
    scene.add(group);

    // Soft colored backdrop blooms — give the glass something to reflect/refract
    // and add depth atmosphere (sits behind the panels).
    const makeBloom = (color: number, x: number, y: number, scale: number) => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d');
      if (ctx) {
        const grd = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        const col = new THREE.Color(color);
        grd.addColorStop(0, `rgba(${(col.r * 255) | 0},${(col.g * 255) | 0},${(col.b * 255) | 0},0.9)`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 256, 256);
      }
      const tex = new THREE.CanvasTexture(c);
      const spriteMat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(x, y, -3.5);
      sprite.scale.setScalar(scale);
      return { sprite, tex, spriteMat };
    };
    const blooms = [
      makeBloom(0x2563eb, -2.5, 1, 7),
      makeBloom(0x06b6d4, 2.5, -1, 7),
      makeBloom(0x60a5fa, 0, 0, 6),
    ];
    blooms.forEach((b) => group.add(b.sprite));

    const geo = new RoundedBoxGeometry(2.25, 3.05, 0.12, 6, 0.16);
    const panels: { mesh: THREE.Mesh; cfg: PanelConfig }[] = [];
    for (const cfg of PANELS) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(cfg.color),
        metalness: 0.1,
        roughness: 0.12,
        transmission: 0.55,
        thickness: 1.2,
        ior: 1.45,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        transparent: true,
        opacity: 0.78,
        attenuationColor: new THREE.Color(cfg.color),
        attenuationDistance: 2.0,
        iridescence: 0.8,
        iridescenceIOR: 1.35,
        envMapIntensity: 1.6,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      mesh.rotation.y = cfg.ry;
      mesh.scale.setScalar(0.55);
      group.add(mesh);
      panels.push({ mesh, cfg });
    }

    const pCount = 140;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 13;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 7.5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1.5;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x2563eb,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const points = new THREE.Points(pGeo, pMat);
    group.add(points);

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      target.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointerMove);

    const renderFrame = () => {
      const t = clock.getElapsedTime();
      if (started && startTime === 0) startTime = t;
      const since = started ? t - startTime : 0;

      pointer.x += (target.x - pointer.x) * 0.04;
      pointer.y += (target.y - pointer.y) * 0.04;
      group.rotation.y = pointer.x * 0.14;
      group.rotation.x = pointer.y * 0.09;

      panels.forEach(({ mesh, cfg }, i) => {
        const raw = (since - cfg.delay) / (1.05 - cfg.delay);
        const p = easeOutCubic(Math.min(1, Math.max(0, raw)));
        mesh.scale.setScalar(THREE.MathUtils.lerp(0.55, cfg.scale, p));
        const floatY = Math.sin(t * 1.2 + i * 1.5) * 0.12;
        mesh.position.y = cfg.y + (1 - p) * -1.4 + floatY * p;
        mesh.rotation.z = Math.sin(t * 0.8 + i) * 0.02;
      });

      points.rotation.y = t * 0.018;

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
        if (entry.isIntersecting) {
          started = true;
          startLoop();
        } else {
          stopLoop();
        }
      },
      { rootMargin: '150px' },
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
      geo.dispose();
      pGeo.dispose();
      pMat.dispose();
      panels.forEach(({ mesh }) => (mesh.material as THREE.Material).dispose());
      blooms.forEach((b) => {
        b.tex.dispose();
        b.spriteMat.dispose();
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      const canvas = renderer.domElement;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [reduced]);

  return (
    <section
      id="channels"
      className="relative bg-[#FAFAFA] py-24 md:py-40 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[70vw] h-[60vh] bg-[radial-gradient(circle,rgba(37,99,235,0.05)_0%,transparent_65%)] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-3 font-mono text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#475467] mb-6">
            <span className="block w-6 h-px bg-[#101828]/30" />
            Omnichannel
            <span className="block w-6 h-px bg-[#101828]/30" />
          </span>
          <h2
            className="font-extrabold tracking-[-0.04em] leading-[1.0] text-[#101828] max-w-[16ch]"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 4.5rem)' }}
          >
            一次部署，
            <span className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent">
              三大通路同步上線
            </span>
            。
          </h2>
          <p
            className="mt-6 text-[#475467] font-medium leading-relaxed max-w-2xl text-balance"
            style={{ fontSize: 'clamp(1rem, 1.4vw, 1.375rem)' }}
          >
            同一套 AI 試穿基礎建設，串起實體門市、Tryzeon App 與品牌官網。
          </p>
        </div>

        {reduced ? (
          <StaticFallback />
        ) : (
          <>
            <div
              ref={containerRef}
              className="relative w-full h-[58vh] md:h-[68vh] mt-6 md:mt-2"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 -mt-4 md:-mt-12">
              {CHANNELS.map((c) => (
                <div key={c.index} className="flex flex-col items-center text-center">
                  <span
                    className="font-mono text-xs tracking-[0.3em]"
                    style={{ color: c.accent }}
                  >
                    {c.index}
                  </span>
                  <h3 className="mt-2 text-lg md:text-xl font-bold text-[#101828]">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#475467] leading-relaxed max-w-[26ch]">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
