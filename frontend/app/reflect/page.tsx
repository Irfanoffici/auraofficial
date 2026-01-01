"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { MoodSelector } from "@/components/reflect/MoodSelector";
import { Slider } from "@/components/ui/Slider";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export default function ReflectPage() {
    const [mood, setMood] = useState("");
    const [energy, setEnergy] = useState(50);
    const [productivity, setProductivity] = useState(50);
    const [note, setNote] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.submitCheckin({
                mood_score: mapMoodToScore(mood), // Helper to map string to number
                energy_score: energy,
                productivity_score: productivity,
                notes: note + ` [Mood: ${mood}]`
            });
            setSubmitted(true);
        } catch (err) {
            console.error("Failed to submit reflection:", err);
            // TODO: Toast error
        } finally {
            setLoading(false);
        }
    };

    // Simple mapper for string moods to numeric scores (1-10)
    const mapMoodToScore = (m: string) => {
        const scores: Record<string, number> = {
            "terrible": 2, "bad": 4, "okay": 6, "good": 8, "excellent": 10
        };
        return scores[m.toLowerCase()] || 5;
    }

    if (submitted) {
        return (
            <AppLayout>
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold"
                    >
                        Reflection Saved
                    </motion.h2>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-muted-foreground">
                        Your insights help AURA understand you better.
                    </motion.p>
                    <Button variant="ghost" onClick={() => setSubmitted(false)}>Add another entry</Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-12 py-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Daily Reflection</h1>
                    <p className="text-muted-foreground">Capture your state to reveal patterns over time.</p>
                </div>

                {/* Mood */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold">How are you feeling?</h3>
                    <MoodSelector value={mood} onChange={setMood} />
                </section>

                {/* Sliders */}
                <section className="space-y-8 p-6 bg-card rounded-xl border border-border">
                    <Slider
                        label="Energy Levels"
                        value={energy}
                        onChange={(e) => setEnergy(Number(e.target.value))}
                        min={0} max={100}
                        valueDisplay={`${energy}%`}
                    />
                    <Slider
                        label="Mental Clarity (Productivity)"
                        value={productivity}
                        onChange={(e) => setProductivity(Number(e.target.value))}
                        min={0} max={100}
                        valueDisplay={`${productivity}%`}
                    />
                </section>

                {/* Note */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold">Any thoughts?</h3>
                    <textarea
                        className="w-full p-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[150px] resize-none"
                        placeholder="What's on your mind?..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </section>

                <div className="flex justify-end">
                    <Button size="lg" onClick={handleSubmit} disabled={!mood || loading} loading={loading}>
                        {loading ? "Saving..." : "Save Reflection"}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
