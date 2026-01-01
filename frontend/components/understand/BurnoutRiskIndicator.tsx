"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { motion } from "framer-motion";

export function BurnoutRiskIndicator() {
    const riskLevel = 35; // 0-100

    return (
        <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
                <CardTitle>Burnout Risk Index</CardTitle>
                <CardDescription>Based on sleep quality and workload intensity.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="relative w-full h-4 bg-secondary rounded-full overflow-hidden">
                    {/* Gradient Bar */}
                    <div className="absolute inset-0 bg-linear-to-r from-green-500 via-amber-500 to-red-600 opacity-50" />

                    {/* Indicator */}
                    <motion.div
                        initial={{ left: 0 }}
                        animate={{ left: `${riskLevel}%` }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10"
                    />
                </div>

                <div className="flex justify-between w-full mt-2 text-xs text-muted-foreground uppercase font-medium tracking-wider">
                    <span>Healthy</span>
                    <span>Caution</span>
                    <span>Critical</span>
                </div>

                <div className="mt-6 text-center">
                    <span className="text-4xl font-bold">{riskLevel}%</span>
                    <p className="text-sm text-muted-foreground">Stable. Keep maintaining recovery windows.</p>
                </div>
            </CardContent>
        </Card>
    );
}
