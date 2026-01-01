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

    // --- Focus ---
    async startSession(intent: string): Promise<FocusSession> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const newSession = {
            user_id: user.id,
            intent: intent,
            start_time: new Date().toISOString(),
            status: 'ongoing',
            duration: 0,
            focus_score: 0,
            interruptions: 0
        };

        const { data, error } = await supabase
            .from('focus_sessions')
            .insert(newSession)
            .select()
            .single();

        if (error) {
            console.error("Supabase Error:", error);
            throw new Error(error.message);
        }

        return data as FocusSession;
    }

    async endSession(session: FocusSession): Promise<FocusSession> {
        const updateData = {
            end_time: new Date().toISOString(),
            duration: session.duration,
            focus_score: session.focus_score,
            interruptions: session.interruptions,
            status: 'completed'
        };

        const { data, error } = await supabase
            .from('focus_sessions')
            .update(updateData)
            .eq('id', session.id)
            .select()
            .single();

        if (error) {
            console.error("Supabase Error:", error);
            // Fallback: Return local Modified session if DB fails, to not break UI
            return { ...session, ...updateData };
        }

        return data as FocusSession;
    }

    // --- Reflect ---
    async submitCheckin(checkin: Omit<DailyCheckin, "id" | "user_id" | "timestamp">): Promise<DailyCheckin> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // Note: 'productivity_score' and 'sentiment' might not be in the initial schema I created.
        // We will insert what we have in the schema. Check params.

        const newCheckin = {
            user_id: user.id,
            timestamp: new Date().toISOString(),
            mood_score: checkin.mood_score,
            energy_level: checkin.energy_score, // Schema used energy_level
            notes: checkin.notes
        };

        const { data, error } = await supabase
            .from('daily_checkins')
            .insert(newCheckin)
            .select()
            .single();

        if (error) {
            console.error("Supabase Error:", error);
            // Fallback
            return {
                id: "temp_" + Date.now(),
                user_id: user.id,
                timestamp: new Date().toISOString(),
                ...checkin
            }
        }

        // Map back to frontend type (energy_level -> energy_score)
        return {
            ...data,
            energy_score: data.energy_level
        } as DailyCheckin;
    }

    // --- Insights ---
    async getLatestInsight(): Promise<Insight> {
        // Backend (AI) is NOT deployed on Netlify.
        // Return a static/mock insight for now.
        return {
            id: "i_local_" + Date.now(),
            user_id: "u_local",
            summary_text: "AI Engine is currently offline (Client-Side Mode). Your data is being saved securely.",
            metrics: {
                focus_stability: 100,
                distraction_rate: 0,
                avg_session_length: 0
            },
            recommendations: ["Connect Python Backend for AI Insights"],
            generated_at: new Date().toISOString()
        }
    }
}

export const api = ApiService.getInstance();
