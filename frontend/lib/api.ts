import { AuthResponse, DailyCheckin, FocusSession, Insight, User } from "./types";
import { supabase } from "./supabase";

const API_Base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiService {
    private static instance: ApiService;

    private constructor() { }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    private async getAuthHeaders(): Promise<HeadersInit> {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        return {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        };
    }

    // --- Auth is handled by Supabase in frontend/lib/supabase.ts ---

    // --- Focus ---
    async startSession(intent: string): Promise<FocusSession> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const response = await fetch(`${API_Base}/focus/start`, {
            method: "POST",
            headers: await this.getAuthHeaders(),
            body: JSON.stringify({
                user_id: user.id,
                intent: intent
            })
        });

        if (!response.ok) throw new Error("Failed to start session");
        return response.json();
    }

    async endSession(session: FocusSession): Promise<FocusSession> {
        // In strict mode, we might want to calculate duration on backend, 
        // but sending frontend perception is often safer for UI sync.
        const response = await fetch(`${API_Base}/focus/end`, {
            method: "POST",
            headers: await this.getAuthHeaders(),
            body: JSON.stringify({
                id: session.id,
                duration: session.duration,
                focus_score: session.focus_score || 0,
                interruptions: session.interruptions
            })
        });

        if (!response.ok) throw new Error("Failed to end session");
        return response.json();
    }

    // --- Reflect ---
    async submitCheckin(checkin: Omit<DailyCheckin, "id" | "user_id" | "timestamp">): Promise<DailyCheckin> {
        // TODO: Implement /checkin endpoint in backend
        // Returning mock for now to prevent breaking UI until backend endpoint exists
        console.warn("Backend /checkin not implemented yet, returning mock");
        return {
            id: "mock_" + Date.now(),
            user_id: "mock_user",
            timestamp: new Date().toISOString(),
            ...checkin
        }
    }

    // --- Insights ---
    async getLatestInsight(): Promise<Insight> {
        // TODO: Implement /insights endpoint in backend
        return {
            id: "i_" + Date.now(),
            user_id: "u_123",
            summary_text: "You maintain high focus in the mornings.",
            metrics: {
                focus_stability: 89,
                distraction_rate: 12,
                avg_session_length: 42
            },
            recommendations: ["Schedule deep work before 11am"],
            generated_at: new Date().toISOString()
        }
    }
}

export const api = ApiService.getInstance();
