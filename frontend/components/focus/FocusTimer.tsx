"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Play, Pause, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function FocusTimer() {
    const [isActive, setIsActive] = useState(false);
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [initialMinutes, setInitialMinutes] = useState(25);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(interval);
                        setIsActive(false);
                        // Timer done logic
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, minutes, seconds]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setMinutes(initialMinutes);
        setSeconds(0);
    };

    const progress = 100 - ((minutes * 60 + seconds) / (initialMinutes * 60)) * 100;

    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            {/* Timer Display */}
            <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
                <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-muted/20"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-primary"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * progress) / 100}
                        animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                        transition={{ type: "tween", ease: "linear", duration: 0.5 }}
                    />
                </svg>
                <div className="text-6xl md:text-7xl font-bold tracking-tighter tabular-nums">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <Button
                    size="lg"
                    variant={isActive ? "secondary" : "default"}
                    className={cn("h-16 w-16 rounded-full", isActive && "ring-2 ring-primary/20")}
                    onClick={toggleTimer}
                >
                    {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </Button>
                {isActive && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                        <Button
                            size="lg"
                            variant="destructive"
                            className="h-16 w-16 rounded-full"
                            onClick={resetTimer}
                        >
                            <Square className="h-6 w-6 fill-current" />
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
