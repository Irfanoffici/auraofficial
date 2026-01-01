"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, ComposedChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

// Mock data: Sine wave approximation of circadian rhythm
const data = [
    { time: "6am", energy: 30, ideal: 40 },
    { time: "8am", energy: 60, ideal: 70 },
    { time: "10am", energy: 90, ideal: 95 },
    { time: "12pm", energy: 85, ideal: 80 },
    { time: "2pm", energy: 50, ideal: 40 }, // Post-lunch dip
    { time: "4pm", energy: 70, ideal: 75 },
    { time: "6pm", energy: 60, ideal: 60 },
    { time: "8pm", energy: 40, ideal: 30 },
    { time: "10pm", energy: 20, ideal: 10 },
];

export function EnergyCurveChart() {
    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 h-full">
            <CardHeader>
                <CardTitle>Circadian Energy Model</CardTitle>
                <CardDescription>Predicted vs. Actual cognitive capacity.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <defs>
                            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fafafa" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#fafafa" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            stroke="#52525b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            hide
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#050505', borderColor: '#27272a', color: '#fafafa' }}
                            itemStyle={{ color: '#fafafa' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="energy"
                            stroke="#fafafa"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorEnergy)"
                        />
                        <Line
                            type="monotone"
                            dataKey="ideal"
                            stroke="#52525b"
                            strokeDasharray="5 5"
                            dot={false}
                            strokeWidth={1}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
