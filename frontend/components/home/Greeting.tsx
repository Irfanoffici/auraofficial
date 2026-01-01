"use client";

import { useEffect, useState } from "react";

export function Greeting() {
    const [greeting, setGreeting] = useState("Good morning");

    useEffect(() => {
        const hours = new Date().getHours();
        if (hours < 12) setGreeting("Good morning");
        else if (hours < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    return (
        <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{greeting}, Irfan</h1>
            <p className="text-muted-foreground">Here is your mind at a glance.</p>
        </div>
    );
}
