"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function DistractionLogger() {
    const [isOpen, setIsOpen] = useState(false);
    const [distraction, setDistraction] = useState("");
    const [log, setLog] = useState<string[]>([]);

    const addLog = () => {
        if (!distraction) return;
        setLog([...log, distraction]);
        setDistraction("");
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {!isOpen && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
                >
                    <Plus className="h-4 w-4" /> Log Distraction
                </Button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-full mb-2 left-0 w-64 z-50"
                    >
                        <Card className="p-2 flex gap-2 shadow-2xl border-primary/20 bg-black">
                            <Input
                                autoFocus
                                value={distraction}
                                onChange={(e) => setDistraction(e.target.value)}
                                placeholder="What distracted you?"
                                className="h-8 text-xs bg-secondary/50"
                                onKeyDown={(e) => e.key === "Enter" && addLog()}
                            />
                            <Button size="icon" className="h-8 w-8" onClick={addLog}>
                                <Plus className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
