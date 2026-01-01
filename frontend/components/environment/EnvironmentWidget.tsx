"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Gauge, Volume2, Sun, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

// Simulated sensor data hook
function useEnvironmentSensors() {
    const [data, setData] = useState({
        db: 45,
        lux: 350,
        co2: 420
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => ({
                db: Math.max(30, Math.min(80, prev.db + (Math.random() * 10 - 5))),
                lux: Math.max(100, Math.min(800, prev.lux + (Math.random() * 20 - 10))),
                co2: Math.max(400, Math.min(500, prev.co2 + (Math.random() * 5 - 2.5)))
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return data;
}

export function EnvironmentWidget() {
    const { db, lux, co2 } = useEnvironmentSensors();

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-50">
                <div className="flex gap-2 items-center text-xs text-green-500 font-mono">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    LIVE SENSORS
                </div>
            </div>

            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-muted-foreground" />
                    Environment
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Audio / Noise Level */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-muted-foreground text-sm">
                            <span className="flex items-center gap-2"><Volume2 className="h-4 w-4" /> Noise</span>
                            <span className="font-mono text-foreground">{Math.round(db)} dB</span>
                        </div>
                        <div className="h-12 flex items-center gap-1">
                            {[...Array(10)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={cn("w-1.5 rounded-full bg-primary/20", i * 6 < db && "bg-primary")}
                                    animate={{ height: Math.max(4, Math.random() * (db / 2)) + "px" }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">Library quiet. Good for deep work.</p>
                    </div>

                    {/* Light Level */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-muted-foreground text-sm">
                            <span className="flex items-center gap-2"><Sun className="h-4 w-4" /> Light</span>
                            <span className="font-mono text-foreground">{Math.round(lux)} Lx</span>
                        </div>
                        <div className="h-1 bg-secondary rounded-full overflow-hidden mt-4">
                            <motion.div
                                className="h-full bg-amber-200 blur-[2px]"
                                animate={{ width: `${(lux / 1000) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Optimal brightness for alertness.</p>
                    </div>

                    {/* Air Quality */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-muted-foreground text-sm">
                            <span className="flex items-center gap-2"><Wind className="h-4 w-4" /> Air (CO2)</span>
                            <span className="font-mono text-green-500">{Math.round(co2)} ppm</span>
                        </div>
                        <div className="mt-2 text-3xl font-bold tracking-tight text-foreground/80">
                            Excellent
                        </div>
                        <p className="text-xs text-muted-foreground">Fresh air, low fatigue risk.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
