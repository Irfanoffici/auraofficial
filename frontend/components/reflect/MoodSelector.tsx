"use client";

import { cn } from "@/lib/utils";
import { Smile, Meh, Frown, Zap, Coffee } from "lucide-react";
import { motion } from "framer-motion";

const moods = [
    { value: "great", label: "Great", icon: Zap, color: "text-amber-400" },
    { value: "good", label: "Good", icon: Smile, color: "text-green-400" },
    { value: "okay", label: "Okay", icon: Meh, color: "text-blue-400" },
    { value: "tired", label: "Tired", icon: Coffee, color: "text-stone-400" },
    { value: "bad", label: "Bad", icon: Frown, color: "text-red-400" },
];

interface MoodSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
    return (
        <div className="grid grid-cols-5 gap-2 md:gap-4">
            {moods.map((mood) => {
                const Icon = mood.icon;
                const isSelected = value === mood.value;

                return (
                    <motion.button
                        key={mood.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onChange(mood.value)}
                        className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                            isSelected
                                ? "border-primary bg-primary/10"
                                : "border-transparent bg-secondary hover:bg-secondary/80"
                        )}
                    >
                        <Icon className={cn("h-8 w-8 transition-colors", isSelected ? mood.color : "text-muted-foreground")} />
                        <span className={cn("text-xs font-medium", isSelected ? "text-foreground" : "text-muted-foreground")}>
                            {mood.label}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}
