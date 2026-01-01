"use client";

import { ComponentType, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Check, Compass, Anchor, Target, Zap, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const CORE_VALUES = [
    { id: "curiosity", label: "Curiosity", icon: Compass, color: "text-blue-400" },
    { id: "discipline", label: "Discipline", icon: Anchor, color: "text-stone-400" },
    { id: "impact", label: "Impact", icon: Target, color: "text-red-400" },
    { id: "energy", label: "Energy", icon: Zap, color: "text-amber-400" },
    { id: "empathy", label: "Empathy", icon: Heart, color: "text-pink-400" },
];

export function ValuesMapper() {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const toggleValue = (id: string) => {
        if (selectedValues.includes(id)) {
            setSelectedValues(selectedValues.filter(v => v !== id));
        } else {
            if (selectedValues.length < 3) {
                setSelectedValues([...selectedValues, id]);
            }
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-muted-foreground">Select up to 3 Core Values</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {CORE_VALUES.map((value) => {
                    const Icon = value.icon;
                    const isSelected = selectedValues.includes(value.id);

                    return (
                        <motion.button
                            key={value.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleValue(value.id)}
                            className={cn(
                                "relative flex flex-col items-center gap-3 p-6 rounded-xl border transition-all duration-300",
                                isSelected
                                    ? "bg-primary/5 border-primary shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                    : "bg-card/50 border-border/50 hover:bg-card hover:border-border"
                            )}
                        >
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="absolute top-2 right-2"
                                >
                                    <Check className="h-4 w-4 text-primary" />
                                </motion.div>
                            )}
                            <Icon className={cn("h-8 w-8 transition-colors", isSelected ? value.color : "text-muted-foreground")} />
                            <span className={cn("text-sm font-medium", isSelected ? "text-foreground" : "text-muted-foreground")}>
                                {value.label}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            <AnimatePresence>
                {selectedValues.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                            <CardContent className="p-6 text-center space-y-2">
                                <h4 className="text-lg font-semibold text-primary">Identity Matrix</h4>
                                <p className="text-sm text-muted-foreground">
                                    You are prioritizing <span className="text-foreground">{selectedValues.map(v => CORE_VALUES.find(c => c.id === v)?.label).join(", ")}</span>.
                                    AURA will align your recommended actions to these pillars.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
