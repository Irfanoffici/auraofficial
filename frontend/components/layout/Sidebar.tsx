"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
    Home,
    Zap,
    BookHeart,
    BarChart2,
    Sprout,
    Settings,
    Menu,
    X,
    ChevronLeft,
    ChevronsLeft,
    ChevronsRight,
    LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Focus", href: "/focus", icon: Zap },
    { name: "Reflect", href: "/reflect", icon: BookHeart },
    { name: "Understand", href: "/understand", icon: BarChart2 },
    { name: "Grow", href: "/grow", icon: Sprout },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useUIStore();
    const [isMobile, setIsMobile] = useState(false);

    // Handle responsive state safely
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                closeSidebar(); // Default closed on mobile
            } else {
                // Optional: Default open on desktop if needed, or respect persisted state
            }
        };

        // Initial check
        checkMobile();

        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, [closeSidebar]);

    return (
        <>
            {/* Mobile Menu Toggle */}
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Desktop Sidebar (Static) */}
            <aside
                className={cn(
                    "hidden md:flex flex-col h-screen border-r border-border bg-card transition-all duration-300 ease-in-out",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                {/* Header / Logo */}
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-wide">
                        <div className="h-6 w-6 rounded-full bg-primary" />
                        {isSidebarOpen && <span className="animate-in fade-in">AURA</span>}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group relative",
                                    isActive
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                                    !isSidebarOpen && "justify-center"
                                )}
                                title={!isSidebarOpen ? item.name : undefined}
                            >
                                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                                {isSidebarOpen && (
                                    <span className="text-sm font-medium animate-in fade-in duration-200">
                                        {item.name}
                                    </span>
                                )}
                                {/* Tooltip for collapsed state */}
                                {!isSidebarOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none border border-border">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                    <Link
                        href="/settings"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md transition-all text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                            !isSidebarOpen && "justify-center"
                        )}
                    >
                        <Settings className="h-5 w-5" />
                        {isSidebarOpen && <span className="text-sm font-medium">Settings</span>}
                    </Link>
                </div>

                {/* Collapse Toggle (Desktop) */}
                <div className="p-2 border-t border-border flex justify-end">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 text-muted-foreground">
                        {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                </div>
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeSidebar}
                            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border md:hidden flex flex-col"
                        >
                            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                                <span className="font-bold text-xl">AURA</span>
                                <Button variant="ghost" size="icon" onClick={closeSidebar}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <nav className="flex-1 py-6 px-4 space-y-2">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeSidebar} // Close on navigation
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-3 rounded-md transition-all",
                                                isActive
                                                    ? "bg-accent text-accent-foreground"
                                                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                            )}
                                        >
                                            <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-4 border-t border-border">
                                <Link
                                    href="/settings"
                                    onClick={closeSidebar}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent/50 hover:text-foreground is-mobile-item"
                                >
                                    <Settings className="h-5 w-5" />
                                    <span className="text-sm font-medium">Settings</span>
                                </Link>
                                {/* Login/Logout Button for mobile */}
                                <Link
                                    href="/login" // Assuming /login is the target for a login/logout action
                                    onClick={closeSidebar}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent/50 hover:text-foreground mt-2"
                                >
                                    <LogOut className="h-5 w-5" /> {/* Using LogOut icon as per snippet */}
                                    <span className="text-sm font-medium">Sign Out</span> {/* Using Sign Out text as per snippet */}
                                </Link>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
