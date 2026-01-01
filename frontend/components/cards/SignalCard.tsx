import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SignalCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: "up" | "down" | "neutral";
    trendLabel?: string;
    className?: string;
}

export function SignalCard({ label, value, icon: Icon, trend, trendLabel, className }: SignalCardProps) {
    return (
        <Card className={cn("hover:bg-accent/20 transition-colors", className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{label}</span>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight">{value}</span>
                </div>
                {trend && (
                    <div className={cn("mt-2 text-xs font-medium flex items-center gap-1",
                        trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                    )}>
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                        {trendLabel}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
