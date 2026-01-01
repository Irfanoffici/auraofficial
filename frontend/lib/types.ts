export interface User {
    id: string;
    email: string;
    timezone: string;
    created_at: string;
}

export interface Profile {
    user_id: string;
    wake_time: string; // HH:mm
    sleep_time: string; // HH:mm
    preferred_focus_window: string; // "morning" | "afternoon" | "evening"
    goals: string[];
}

export interface FocusSession {
    id: string;
    user_id: string;
    start_time: string; // ISO String
    end_time?: string; // ISO String
    duration: number; // seconds
    focus_score?: number; // 0-100
    interruptions: number;
    intent: string; // "coding", "reading"
}

export interface DailyCheckin {
    id: string;
    user_id: string;
    mood_score: number; // 1-5 or 1-10
    productivity_score: number; // 0-100
    energy_score: number; // 0-100
    notes: string;
    timestamp: string; // ISO String
}

export interface Insight {
    id: string;
    user_id: string;
    summary_text: string;
    metrics: {
        focus_stability: number;
        distraction_rate: number;
        avg_session_length: number;
    };
    recommendations: string[];
    generated_at: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}
