'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const BLUE = [37, 99, 235] as const;
const CYAN = [6, 182, 212] as const;
// 相機距離（以球半徑為 1）與基本仰角
const CAMERA = 3.4;
const BASE_PITCH = 0.32;
// 每隔多久有一筆「試穿」飛進球面（ms）
const SHOT_EVERY_MS = 1500;
const SHOT_MS = 1150;
// 落點附近被點亮的範圍（球面夾角的 cos）
const GLOW_COS = Math.cos(0.32);

interface Dot {
  // 球面上的落點（單位球）
  tx: number;
  ty: number;
  tz: number;
  // 散開時的位置
  sx: number;
  sy: number;
  sz: number;
  delay: number;
  phase: number;
  glow: number;
}

interface Shot {
  target: number;
  fx: number;
  fy: number;
  fz: number;
  born: number;
  trail: { x: number; y: number }[];
}

interface Ripple {
  target: number;
  born: number;
}

function makeDots(count: number): Dot[] {
  const dots: Dot[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    // Fibonacci sphere：點在球面上均勻分布
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const tx = Math.cos(theta) * r;
    const tz = Math.sin(theta) * r;
    // 散開的雲：方向帶點隨機、距離拉遠，整體是一團沒有形狀的數據
    const ax = tx + (Math.random() - 0.5) * 1.6;
    const ay = y + (Math.random() - 0.5) * 1.6;
    const az = tz + (Math.random() - 0.5) * 1.6;
    const len = Math.hypot(ax, ay, az) || 1;
    const dist = 1.35 + Math.random() * 1.5;
    dots.push({
      tx,
      ty: y,
      tz,
      sx: (ax / len) * dist,
      sy: (ay / len) * dist * 0.8,
      sz: (az / len) * dist,
      // 由上往下收斂（與網站的掃描語彙一致），再加一點隨機
      delay: ((1 - y) / 2) * 0.32 + Math.random() * 0.14,
      phase: Math.random() * Math.PI * 2,
      glow: 0,
    });
  }
  return dots;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mix = (a: readonly number[], b: readonly number[], t: number) =>
  `${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)}`;

interface EngineSphereProps {
  className?: string;
}

/**
 * EngineSphere — 「每一次試穿，都讓推薦更準。」的視覺。
 * 一團散開、沒有形狀的數據點，隨捲動由上往下收斂成一顆精準的球（ScrollTrigger scrub）；
 * 收斂後每隔一陣子有一筆「試穿」化成一道光飛進球面，落點附近的點亮起、漾開一圈。
 * Canvas 2D 自己做 3D 投影，不需要 three.js。只在畫面內時繪製；
 * 游標在區塊內移動時球體跟著轉向；偏好減少動態時只畫一張收斂完成的靜態圖。
 */
export function EngineSphere({ className = '' }: EngineSphereProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!wrap || !canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const dots = makeDots(window.innerWidth < 640 ? 620 : 1100);
    const shots: Shot[] = [];
    const ripples: Ripple[] = [];

    let width = 0;
    let height = 0;
    let dpr = 1;
    let converge = reduced ? 1 : 0;
    let convergeTarget = converge;
    let yaw = 0.6;
    let lookX = 0;
    let lookY = 0;
    let lookTargetX = 0;
    let lookTargetY = 0;
    let lastShot = 0;
    let last = performance.now();
    let raf = 0;
    let visible = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      if (reduced || !visible) draw(performance.now());
    };

    // 單位球座標 → 旋轉 → 透視投影；回傳螢幕座標與前後深度（0 背面、1 正面）
    const project = (x: number, y: number, z: number, cy: number, sy: number, cp: number, sp: number) => {
      const x1 = x * cy + z * sy;
      const z1 = -x * sy + z * cy;
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      const radius = Math.min(width, height) * 0.4;
      const k = CAMERA / (CAMERA - z2);
      return {
        x: width / 2 + x1 * k * radius,
        y: height / 2 + y2 * k * radius,
        depth: (z2 + 1.2) / 2.4,
        k,
      };
    };

    const draw = (now: number) => {
      const dt = Math.min(now - last, 50) / 1000;
      last = now;

      converge += (convergeTarget - converge) * Math.min(1, dt * 4);
      lookX += (lookTargetX - lookX) * Math.min(1, dt * 3);
      lookY += (lookTargetY - lookY) * Math.min(1, dt * 3);
      if (!reduced) yaw += dt * 0.14;

      const ay = yaw + lookX * 0.7;
      const ap = BASE_PITCH + lookY * 0.35;
      const cy = Math.cos(ay);
      const sy = Math.sin(ay);
      const cp = Math.cos(ap);
      const sp = Math.sin(ap);
      const t = now / 1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // 收斂後浮現的三道軌道環：精準儀器的感覺
      const ringAlpha = Math.pow(Math.max(0, (converge - 0.6) / 0.4), 2);
      if (ringAlpha > 0.01) {
        const rings: [number, number][] = [
          [0, 0],
          [1.05, 0.4],
          [-0.95, 1.9],
        ];
        ctx.lineWidth = 1;
        for (const [tilt, spin] of rings) {
          const ct = Math.cos(tilt);
          const st = Math.sin(tilt);
          const cs = Math.cos(spin);
          const ss = Math.sin(spin);
          let prev: ReturnType<typeof project> | null = null;
          for (let s = 0; s <= 96; s++) {
            const a = (s / 96) * Math.PI * 2;
            // 赤道圓 → 繞 x 軸傾斜 → 繞 y 軸轉
            const ex = Math.cos(a) * 1.06;
            const ez = Math.sin(a) * 1.06;
            const ey1 = -ez * st;
            const ez1 = ez * ct;
            const p = project(ex * cs + ez1 * ss, ey1, -ex * ss + ez1 * cs, cy, sy, cp, sp);
            if (prev) {
              ctx.strokeStyle = `rgba(${mix(BLUE, CYAN, s / 96)},${(0.08 + 0.32 * p.depth) * ringAlpha})`;
              ctx.beginPath();
              ctx.moveTo(prev.x, prev.y);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
            }
            prev = p;
          }
        }
      }

      // 點：先畫背面再畫正面，亮起的點自然壓在上面
      for (let pass = 0; pass < 2; pass++) {
        for (const d of dots) {
          const local = Math.max(0, Math.min(1, (converge - d.delay) / 0.5));
          const e = easeOut(local);
          const jitter = (1 - e) * 0.05;
          const x = d.sx + (d.tx - d.sx) * e + Math.sin(t * 0.8 + d.phase) * jitter;
          const y = d.sy + (d.ty - d.sy) * e + Math.cos(t * 0.7 + d.phase) * jitter;
          const z = d.sz + (d.tz - d.sz) * e;
          const p = project(x, y, z, cy, sy, cp, sp);
          if ((pass === 0) !== p.depth < 0.5) continue;
          if (d.glow > 0.002) d.glow *= Math.exp(-dt * 1.4);
          const front = Math.max(0, Math.min(1, p.depth));
          // 越收斂越清晰：散開時點淡、偏灰藍；收斂後依深度給對比
          const alpha = (0.14 + 0.66 * front) * (0.45 + 0.55 * e) + d.glow * 0.6;
          const size = (0.7 + 1.35 * front) * p.k + d.glow * 2.2;
          const hue = Math.max(0, Math.min(1, (d.ty + 1) / 2 + d.glow));
          ctx.fillStyle = `rgba(${mix(BLUE, CYAN, hue)},${Math.min(1, alpha)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduced && converge > 0.85 && now - lastShot > SHOT_EVERY_MS) {
        lastShot = now;
        const target = Math.floor(Math.random() * dots.length);
        const d = dots[target];
        // 從球外、偏向落點那一側飛進來
        const fx = d.tx * 2.4 + (Math.random() - 0.5) * 1.6;
        const fy = d.ty * 2.4 + (Math.random() - 0.5) * 1.2;
        const fz = d.tz * 2.4 + (Math.random() - 0.5) * 1.6;
        shots.push({ target, fx, fy, fz, born: now, trail: [] });
      }

      for (let i = shots.length - 1; i >= 0; i--) {
        const s = shots[i];
        const d = dots[s.target];
        const k = Math.min(1, (now - s.born) / SHOT_MS);
        const e = easeInOut(k);
        const p = project(s.fx + (d.tx - s.fx) * e, s.fy + (d.ty - s.fy) * e, s.fz + (d.tz - s.fz) * e, cy, sy, cp, sp);
        s.trail.push({ x: p.x, y: p.y });
        if (s.trail.length > 14) s.trail.shift();
        for (let j = 1; j < s.trail.length; j++) {
          ctx.strokeStyle = `rgba(${mix(BLUE, CYAN, j / s.trail.length)},${(j / s.trail.length) * 0.7})`;
          ctx.lineWidth = (j / s.trail.length) * 2.2;
          ctx.beginPath();
          ctx.moveTo(s.trail[j - 1].x, s.trail[j - 1].y);
          ctx.lineTo(s.trail[j].x, s.trail[j].y);
          ctx.stroke();
        }
        ctx.fillStyle = 'rgba(6,182,212,1)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
        if (k >= 1) {
          shots.splice(i, 1);
          ripples.push({ target: s.target, born: now });
          for (const n of dots) {
            const dot = n.tx * d.tx + n.ty * d.ty + n.tz * d.tz;
            if (dot > GLOW_COS) n.glow = Math.max(n.glow, (dot - GLOW_COS) / (1 - GLOW_COS));
          }
        }
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const k = (now - r.born) / 1100;
        if (k >= 1) {
          ripples.splice(i, 1);
          continue;
        }
        const d = dots[r.target];
        const p = project(d.tx, d.ty, d.tz, cy, sy, cp, sp);
        ctx.strokeStyle = `rgba(6,182,212,${(1 - k) * 0.6 * (0.3 + 0.7 * p.depth)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 + easeOut(k) * 26, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(wrap);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    let trigger: ScrollTrigger | null = null;
    if (!reduced) {
      trigger = ScrollTrigger.create({
        trigger: wrap,
        start: 'top 95%',
        end: 'center 45%',
        onUpdate: (self) => {
          convergeTarget = self.progress;
        },
      });
      convergeTarget = trigger.progress;
    }

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      lookTargetX = ((e.clientX - r.left) / r.width) * 2 - 1;
      lookTargetY = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => {
      lookTargetX = 0;
      lookTargetY = 0;
    };
    const section = wrap.closest('section') ?? wrap;
    if (finePointer && !reduced) {
      section.addEventListener('pointermove', onMove);
      section.addEventListener('pointerleave', onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      trigger?.kill();
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className}`} aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
