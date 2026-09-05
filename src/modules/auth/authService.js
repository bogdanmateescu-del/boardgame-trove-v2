// Authentication Service Module
import { supabase } from '../../services/supabaseClient.js';

export async function signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
    });
    if (error) throw error;
    return data;
}

export async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign out error:", error);
}

export async function getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.error("Get session error:", error);
        return null;
    }
    return data?.session || null;
}

export function onAuthChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}
