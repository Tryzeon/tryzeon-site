'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { AppScreen } from '@/components/AppScreen';
import { PhoneBody } from '@/components/Phone3D';
import type { AppImageName } from '@/lib/app-images';
import { EASE } from '@/lib/motion';
import { usePointerTilt } from '@/lib/use-pointer-tilt';

interface PhoneFanProps {
  names: readonly AppImageName[];
  sizes: string;
  /** 每支手機的寬度 class */
  phoneClassName: string;
}

/**
 * 一排有厚度的手機，左右兩支微微轉向中間（±12°，截圖仍幾乎正面可讀、互不遮擋）。
 * 捲進視窗時依序從更斜的角度轉回來；游標一動整排跟著微轉，滑到哪支哪支往前浮。
 */
export function PhoneFan({ names, sizes, phoneClassName }: PhoneFanProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  usePointerTilt(stageRef, { max: 5, relativeTo: 'element' });
  const mid = (names.length - 1) / 2;

  return (
    <div ref={stageRef} className="phone3d flex justify-center gap-3 md:gap-4">
      {names.map((name, i) => {
        const yaw = (mid - i) * 12;
        return (
          <div key={name} className="phone3d-pose" style={{ ['--yaw' as string]: `${yaw}deg` }}>
            <motion.div
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ rotateY: (mid - i) * 26, y: 36 }}
              whileInView={{ rotateY: 0, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.3, ease: EASE, delay: 0.1 + i * 0.12 }}
            >
              {/* hover 往前浮放在另一層：外層的 transform 歸 framer 管 */}
              <div className="fan-hover">
                <PhoneBody className={phoneClassName}>
                  <AppScreen name={name} sizes={sizes} framed={false} />
                </PhoneBody>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
