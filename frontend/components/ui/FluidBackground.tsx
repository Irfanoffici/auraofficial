"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FluidBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Deep Violet Orb - Drifts slowly */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 100, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-900/20 blur-[120px]"
            />

            {/* Indigo Orb - Follows mouse loosely */}
            <motion.div
                animate={{
                    x: mousePosition.x * 0.05,
                    y: mousePosition.y * 0.05,
                }}
                transition={{
                    type: "spring",
                    damping: 50,
                    stiffness: 100,
                }}
                className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/10 blur-[100px]"
            />

            {/* Cyan Accent - Pulse */}
            <motion.div
                animate={{
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-cyan-900/5 blur-[150px]"
            />

            {/* Noise Texture Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
                }}
            />
        </div>
    );
}
