import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ArrowRight, Zap } from "lucide-react";

interface ActionCardProps {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function ActionCard({ title, actionLabel = "Start", onAction, className }: ActionCardProps) {
    return (
        <Card className={cn("bg-gradient-to-br from-card to-card/50 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer group", className)} onClick={onAction}>
            <CardContent className="p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Zap className="h-5 w-5" />
                    </div>
                    <div className="font-semibold text-lg">{title}</div>
                </div>
                <Button size="icon" variant="ghost" className="group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="h-5 w-5" />
                </Button>
            </CardContent>
        </Card>
    );
}
