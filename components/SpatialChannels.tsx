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
  image: string;
  x: number;
  y: number;
  z: number;
  ry: number;
  scale: number;
  rim: number;
  delay: number;
}

const CHANNELS: ChannelInfo[] = [
  {
    index: '01',
    title: '實體門市',
    desc: '門市平板即拍即試，導購當場成交',
    accent: '#2563EB',
  },
  {
    index: '02',
    title: 'Tryzeon App',
    desc: '一張照片穿上任何衣服，隨身試衣間',
    accent: '#0EA5C4',
  },
  {
    index: '03',
    title: '品牌官網 SDK',
    desc: 'embed 一行程式，官網即上線試穿',
    accent: '#06B6D4',
  },
];

const PANELS: PanelConfig[] = [
  {
    image: '/images/slides/slide-4-b2b-value.jpg',
    x: -3.25,
    y: 0.18,
    z: -1.3,
    ry: 0.44,
    scale: 0.86,
    rim: 0x2563eb,
    delay: 0,
  },
  {
    image: '/images/slides/slide-1-brand-introduction.jpg',
    x: 0,
    y: 0,
    z: 0.6,
    ry: 0,
    scale: 1.05,
    rim: 0x60a5fa,
    delay: 0.12,
  },
  {
    image: '/images/slides/slide-2-user-experience.jpg',
    x: 3.25,
    y: -0.18,
    z: -1.3,
    ry: -0.44,
    scale: 0.86,
    rim: 0x06b6d4,
    delay: 0.24,
  },
];

const SCREEN_W = 3.3;
const SCREEN_H = 1.86;

const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);

function StaticFallback() {
  return (
    <div className="grid sm:grid-cols-3 gap-4 md:gap-6 mt-12">
      {CHANNELS.map((c, i) => (
        <div
          key={c.index}
          className="overflow-hidden rounded-3xl border border-[#101828]/8 bg-white shadow-[0_8px_30px_rgba(16,24,40,0.06)]"
        >
          <div className="relative aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PANELS[i].image}
              alt={c.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <span
              className="font-mono text-xs tracking-[0.3em]"
              style={{ color: c.accent }}
            >
              {c.index}
            </span>
            <h3 className="mt-2 text-lg font-bold text-[#101828]">{c.title}</h3>
            <p className="mt-1 text-sm text-[#475467] leading-relaxed">{c.desc}</p>
          </div>
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
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

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

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(3, 4, 6);
    scene.add(key);

    const group = new THREE.Group();
    scene.add(group);

    // soft colored backdrop blooms for depth atmosphere
    const blooms: { tex: THREE.CanvasTexture; mat: THREE.SpriteMaterial }[] = [];
    const addBloom = (color: number, x: number, y: number, s: number) => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d');
      if (ctx) {
        const col = new THREE.Color(color);
        const grd = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        grd.addColorStop(
          0,
          `rgba(${(col.r * 255) | 0},${(col.g * 255) | 0},${(col.b * 255) | 0},0.8)`,
        );
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 256, 256);
      }
      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(x, y, -4);
      sprite.scale.setScalar(s);
      group.add(sprite);
      blooms.push({ tex, mat });
    };
    addBloom(0x2563eb, -3, 1, 7);
    addBloom(0x06b6d4, 3, -1, 7);

    // textures
    const loader = new THREE.TextureLoader();
    const textures: THREE.Texture[] = [];
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    const bezelGeo = new RoundedBoxGeometry(
      SCREEN_W + 0.16,
      SCREEN_H + 0.16,
      0.14,
      5,
      0.12,
    );
    const screenGeo = new THREE.PlaneGeometry(SCREEN_W, SCREEN_H);

    const panels: { group: THREE.Group; cfg: PanelConfig }[] = [];
    for (const cfg of PANELS) {
      const panelGroup = new THREE.Group();
      panelGroup.position.set(cfg.x, cfg.y, cfg.z);
      panelGroup.rotation.y = cfg.ry;
      panelGroup.scale.setScalar(0.5);

      const bezelMat = new THREE.MeshPhysicalMaterial({
        color: 0xf7f8fa,
        metalness: 0.2,
        roughness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.4,
      });
      const bezel = new THREE.Mesh(bezelGeo, bezelMat);
      panelGroup.add(bezel);

      const tex = loader.load(cfg.image, (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = maxAniso;
        t.needsUpdate = true;
      });
      tex.colorSpace = THREE.SRGBColorSpace;
      textures.push(tex);

      const screenMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.z = 0.081;
      panelGroup.add(screen);

      // thin colored accent rim along the bottom edge
      const rimGeo = new THREE.PlaneGeometry(SCREEN_W * 0.9, 0.04);
      const rimMat = new THREE.MeshBasicMaterial({
        color: cfg.rim,
        transparent: true,
        opacity: 0.9,
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.set(0, -SCREEN_H / 2 - 0.06, 0.081);
      panelGroup.add(rim);

      group.add(panelGroup);
      panels.push({ group: panelGroup, cfg });
    }

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

      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;
      group.rotation.y = pointer.x * 0.16;
      group.rotation.x = pointer.y * 0.1;

      panels.forEach(({ group: pg, cfg }, i) => {
        const raw = (since - cfg.delay) / (1.05 - cfg.delay);
        const p = easeOutCubic(Math.min(1, Math.max(0, raw)));
        pg.scale.setScalar(THREE.MathUtils.lerp(0.5, cfg.scale, p));
        const floatY = Math.sin(t * 1.1 + i * 1.7) * 0.1;
        pg.position.y = cfg.y + (1 - p) * -1.5 + floatY * p;
        pg.rotation.z = Math.sin(t * 0.7 + i) * 0.015;
      });

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
      bezelGeo.dispose();
      screenGeo.dispose();
      panels.forEach(({ group: pg }) => {
        pg.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            (obj.material as THREE.Material).dispose();
          }
        });
      });
      textures.forEach((t) => t.dispose());
      blooms.forEach((b) => {
        b.tex.dispose();
        b.mat.dispose();
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
              className="relative w-full h-[58vh] md:h-[66vh] mt-4"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 mt-2">
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
