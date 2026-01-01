import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

interface InsightCardProps {
    title: string;
    description: string;
    className?: string;
    variant?: "default" | "highlight";
}

export function InsightCard({ title, description, className, variant = "default" }: InsightCardProps) {
    return (
        <Card className={cn("relative overflow-hidden group", className)}>
            {/* Background Glow for Highlight */}
            {variant === "highlight" && (
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
            )}

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Insight
                </CardTitle>
                <Lightbulb className={cn("h-4 w-4", variant === "highlight" ? "text-amber-400" : "text-muted-foreground")} />
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold leading-snug group-hover:text-primary transition-colors">
                    {title}
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
