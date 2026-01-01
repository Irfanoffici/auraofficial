"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
    return (
        <AppLayout>
            <div className="space-y-6 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>Manage your profile and data.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-medium">Profile</div>
                                <div className="text-sm text-muted-foreground">irfan@example.com</div>
                            </div>
                            <Button variant="outline">Edit</Button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-medium">Data Export</div>
                                <div className="text-sm text-muted-foreground">Download all your reflection data.</div>
                            </div>
                            <Button variant="outline">Export</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize your workspace.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span>Theme</span>
                            <span className="text-sm text-muted-foreground">Dark Minimal (Locked)</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
