"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FocusTimer } from "@/components/focus/FocusTimer";
import { DistractionLogger } from "@/components/focus/DistractionLogger";
import { Button } from "@/components/ui/Button";
import { Wind } from "lucide-react";
import { api } from "@/lib/api";
import { FocusSession } from "@/lib/types";

type SessionState = "idle" | "breathing" | "focus" | "recovery" | "reflection";

interface SessionManagerProps {
    intent: string;
    onComplete: () => void;
    onCancel: () => void;
}

export function SessionManager({ intent, onComplete, onCancel }: SessionManagerProps) {
    const [state, setState] = useState<SessionState>("breathing");
    const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);

    // Breathing Phase & Session Start
    useEffect(() => {
        let timer: NodeJS.Timeout;

        const initSession = async () => {
            // Start 5s breathing
            timer = setTimeout(async () => {
                try {
                    // CALL BACKEND TO START SESSION
                    const session = await api.startSession(intent);
                    setCurrentSession(session);
                    setState("focus");
                } catch (err) {
                    console.error("Failed to start session:", err);
                    // Fallback/Error handling (maybe show toast)
                    setState("focus"); // Proceed optimistically or handle error
                }
            }, 5000);
        }

        if (state === "breathing") {
            initSession();
        }

        return () => clearTimeout(timer);
    }, [state, intent]);

    const handleSessionEnd = async (completed: boolean) => {
        if (currentSession) {
            try {
                // Mock duration/score calculation for now
                // In real implementation, FocusTimer would pass the actual duration
                const duration = 1500;
                const score = 95;

                await api.endSession({
                    ...currentSession,
                    duration,
                    focus_score: score,
                    interruptions: 0 // TODO: Link with DistractionLogger
                });
            } catch (err) {
                console.error("Failed to sync session end:", err);
            }
        }

        if (completed) {
            onComplete(); // Navigate to reflection
        } else {
            onCancel(); // Just return to dashboard
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto min-h-[400px] flex flex-col items-center justify-center relative">
            <AnimatePresence mode="wait">
                {state === "breathing" && (
                    <motion.div
                        key="breathing"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="text-center space-y-6"
                    >
                        <Wind className="h-16 w-16 mx-auto text-primary animate-pulse" />
                        <h2 className="text-2xl font-light">Breathe in...</h2>
                        <p className="text-muted-foreground">Preparing for {intent}</p>
                    </motion.div>
                )}

                {state === "focus" && (
                    <motion.div
                        key="focus"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full flex flex-col items-center gap-8"
                    >
                        <div className="absolute top-0 right-0">
                            <DistractionLogger />
                        </div>

                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wide uppercase">
                                Deep Work
                            </div>
                            <h2 className="text-xl font-medium">{intent}</h2>
                        </div>

                        <FocusTimer
                            onComplete={() => handleSessionEnd(true)} // Calls api.endSession
                        />

                        <Button
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleSessionEnd(false)}
                        >
                            End Session Early
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
