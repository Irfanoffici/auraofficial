"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { SessionManager } from "@/components/focus/SessionManager";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FocusPage() {
    const [intent, setIntent] = useState("");
    const [isSessionStarted, setIsSessionStarted] = useState(false);

    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 max-w-2xl mx-auto text-center relative z-10">

                <AnimatePresence mode="wait">
                    {!isSessionStarted ? (
                        <motion.div
                            key="intent"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6 w-full"
                        >
                            <p className="text-sm uppercase tracking-widest text-muted-foreground">Focus Engine v2.0</p>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent pb-2">
                                Identify your target.
                            </h1>
                            <input
                                type="text"
                                value={intent}
                                onChange={(e) => setIntent(e.target.value)}
                                placeholder="I will focus on..."
                                className="w-full bg-transparent border-b border-white/10 text-3xl py-4 text-center focus:outline-none focus:border-white/40 transition-colors placeholder:text-muted-foreground/30 font-light"
                                autoFocus
                            />
                            {intent && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => setIsSessionStarted(true)}
                                    className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all hover:bg-white/90 hover:scale-105 active:scale-95"
                                >
                                    <span className="mr-2">Initiate Session</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </motion.button>
                            )}
                        </motion.div>
                    ) : (
                        <SessionManager
                            intent={intent}
                            onComplete={() => setIsSessionStarted(false)}
                            onCancel={() => setIsSessionStarted(false)}
                        />
                    )}
                </AnimatePresence>

            </div>
        </AppLayout>
    );
}
