"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase"; // Updated import
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FluidBackground } from "@/components/ui/FluidBackground";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push("/");
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        setError("");
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })
            if (error) throw error;
            alert("Check your email for the confirmation link!");
        } catch (err: any) {
            setError(err.message || "Sign up failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
            <FluidBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-border/50 bg-black/40 backdrop-blur-xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-light tracking-widest uppercase">AURA</CardTitle>
                        <CardDescription>Enter the void to find clarity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-secondary/20 border-white/5 focus:border-white/20 text-center placeholder:text-muted-foreground/50 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-secondary/20 border-white/5 focus:border-white/20 text-center placeholder:text-muted-foreground/50 transition-all"
                                    required
                                />
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-xs text-red-400 text-center"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <div className="space-y-2">
                                <Button
                                    type="submit"
                                    className="w-full bg-white text-black hover:bg-white/90 font-medium tracking-wide"
                                    disabled={loading}
                                    loading={loading}
                                >
                                    {loading ? "Authenticating..." : "Login"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full text-xs text-muted-foreground hover:text-white"
                                    onClick={handleSignUp}
                                    disabled={loading}
                                >
                                    New? Create an account
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
