"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const data = [
    { name: "Mon", total: 45 },
    { name: "Tue", total: 80 },
    { name: "Wed", total: 60 },
    { name: "Thu", total: 95 },
    { name: "Fri", total: 30 },
    { name: "Sat", total: 50 },
    { name: "Sun", total: 70 },
];

export function ActivityChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Focus Activity</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}m`}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                            itemStyle={{ color: '#f4f4f5' }}
                        />
                        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
