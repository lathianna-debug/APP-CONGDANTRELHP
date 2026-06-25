import { createClient } from "@supabase/supabase-js";

// Vite environment variables or direct fallbacks provided by user
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://jrwzwixyjdolxpyvkren.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyd3p3aXh5amRvbHhweXZrcmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNTQyOTEsImV4cCI6MjA5NzkzMDI5MX0.6Ncbki_sqyMLUxcot4hTzNJwGWF7kH5p0afEojeTkSk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to check if Supabase connection is healthy and tables exist
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("student_profiles").select("id").limit(1);
    if (error) {
      console.warn("Supabase connection warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase exception:", err);
    return false;
  }
}
