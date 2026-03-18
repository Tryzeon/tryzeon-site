'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [cursorVariant, setCursorVariant] = useState<'default' | 'hover'>('default');

    // Use springs for ultra-smooth buttery inertia
    const springX = useSpring(-100, { stiffness: 500, damping: 28, mass: 0.5 });
    const springY = useSpring(-100, { stiffness: 500, damping: 28, mass: 0.5 });

    useEffect(() => {
        const mouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
            springX.set(e.clientX);
            springY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if hovering over any clickable or interactive element
            if (
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[role="button"]') ||
                target.tagName.toLowerCase() === 'input' ||
                target.tagName.toLowerCase() === 'textarea'
            ) {
                setCursorVariant('hover');
            } else {
                setCursorVariant('default');
            }
        };

        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [springX, springY]);

    const variants = {
        default: {
            scale: 1,
            backgroundColor: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            mixBlendMode: 'normal' as const
        },
        hover: {
            scale: 1.5,
            backgroundColor: 'white',
            borderColor: 'transparent',
            mixBlendMode: 'difference' as const
        }
    };

    return (
        <>
            {/* 
        The main physical ring that trails slightly behind 
        Inertia handled by framer-motion springs 
      */}
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 rounded-full border pointer-events-none z-[9999] hidden lg:block"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                variants={variants}
                animate={cursorVariant}
                transition={{
                    scale: { type: 'spring', stiffness: 300, damping: 20 },
                    backgroundColor: { duration: 0.2 },
                    borderColor: { duration: 0.2 }
                }}
            />

            {/* 
        The exact pinpoint dot 
        Sticks precisely to the mouse without delay
      */}
            <motion.div
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[10000] hidden lg:block mix-blend-difference"
                animate={{
                    x: mousePosition.x,
                    y: mousePosition.y,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: cursorVariant === 'hover' ? 0 : 1
                }}
                transition={{
                    type: 'tween',
                    ease: 'linear',
                    duration: 0
                }}
            />
        </>
    );
}
