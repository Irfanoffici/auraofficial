"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ValuesMapper } from "@/components/grow/ValuesMapper";

// Mock data for timelines - in real app this comes from backend history
const TIMELINE = [
    { date: "Today", title: "Consistent Focus Streak (5 Days)", active: true },
    { date: "Last Week", title: "Completed Project Alpha", active: false },
    { date: "Nov 15, 2025", title: "Defined Core Values", active: false },
]

export default function GrowPage() {
    return (
        <AppLayout>
            <div className="space-y-12 max-w-5xl mx-auto pb-20">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Grow</h1>
                    <p className="text-muted-foreground text-lg">Align your daily actions with who you want to become.</p>
                </div>

                {/* Identity Definition Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-light tracking-tight">Core Values</h2>
                    <ValuesMapper />
                </section>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Future Self Visualization */}
                    <Card className="h-full border-primary/10 bg-linear-to-b from-card to-primary/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none mix-blend-overlay"></div>
                        <CardHeader>
                            <CardTitle>Message from Future Self</CardTitle>
                            <CardDescription>December 2026</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <blockquote className="border-l-2 border-primary/50 pl-6 italic text-xl leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                                "You kept showing up even when the results weren't visible. That consistency compounded into something improved beyond what we could imagine. Keep the daily rhythm."
                            </blockquote>
                        </CardContent>
                    </Card>

                    {/* Growth Timeline */}
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Growth Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l border-border/50 ml-2 space-y-8 pl-8 py-2">
                                {TIMELINE.map((item, i) => (
                                    <div key={i} className="relative group">
                                        <div className={`absolute -left-[37px] mt-1.5 h-3 w-3 rounded-full ring-4 ring-background transition-colors ${item.active ? 'bg-primary shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-muted-foreground/30'}`} />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{item.date}</span>
                                            <span className="font-medium text-lg group-hover:text-primary transition-colors">{item.title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
