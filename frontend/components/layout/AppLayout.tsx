"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { FluidBackground } from "@/components/ui/FluidBackground";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-background relative isolate">
            <FluidBackground />
            <Sidebar />
            <main className={cn("flex-1 overflow-y-auto relative", className)}>
                {/* Top spacing for mobile menu button */}
                <div className="h-16 md:hidden" />
                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
