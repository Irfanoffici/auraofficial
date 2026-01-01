"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { ActivityChart } from "@/components/understand/ActivityChart";
import { EnergyCurveChart } from "@/components/understand/EnergyCurveChart";
import { BurnoutRiskIndicator } from "@/components/understand/BurnoutRiskIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { InsightCard } from "@/components/cards/InsightCard";

export default function UnderstandPage() {
    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Understand</h1>
                    <p className="text-muted-foreground">Behavioral patterns and performance metrics.</p>
                </div>

                {/* Top Row: Energy & Burnout */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <EnergyCurveChart />
                    <BurnoutRiskIndicator />
                </div>

                {/* Middle Row: Activity & Metrics */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <ActivityChart />

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Key Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                <div className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Focus Stability</p>
                                        <p className="text-sm text-muted-foreground">
                                            89% (High)
                                        </p>
                                    </div>
                                    <div className="ml-auto font-bold text-green-500">+2.5%</div>
                                </div>
                                <div className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Distraction Rate</p>
                                        <p className="text-sm text-muted-foreground">
                                            Low
                                        </p>
                                    </div>
                                    <div className="ml-auto font-bold text-green-500">-12%</div>
                                </div>
                                <div className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Avg Session</p>
                                        <p className="text-sm text-muted-foreground">
                                            42m
                                        </p>
                                    </div>
                                    <div className="ml-auto font-bold text-muted-foreground">~</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Insights Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <InsightCard
                        title="Pattern Detected"
                        description="You tend to lose focus after 45 minutes. Try shorter sprints."
                        variant="default"
                    />
                    <InsightCard
                        title="Peak Performance"
                        description="Your best work happens on Tuesdays."
                        variant="highlight"
                    />
                    <Card>
                        <CardHeader><CardTitle>Environment</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                Typically quiet (45dB) during focus sessions.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
