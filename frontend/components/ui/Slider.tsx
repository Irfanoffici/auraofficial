"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    valueDisplay?: string | number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, label, valueDisplay, ...props }, ref) => {
        return (
            <div className="space-y-3 w-full">
                <div className="flex justify-between items-center text-sm">
                    {label && <span className="font-medium text-muted-foreground">{label}</span>}
                    {valueDisplay && <span className="font-bold">{valueDisplay}</span>}
                </div>
                <input
                    type="range"
                    className={cn(
                        "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
Slider.displayName = "Slider";

export { Slider };
