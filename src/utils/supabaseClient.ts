import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(
    supabaseUrl,
    supabaseKey
);

export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email, password, options: {
            emailRedirectTo: 'http://localhost:1420/auth/login'
        }
    });
    if (error) {
        return { data, error };
    }
    return { data, error };
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}
