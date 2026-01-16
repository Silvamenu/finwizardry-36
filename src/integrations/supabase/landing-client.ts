import { createClient } from '@supabase/supabase-js';

// Landing page Supabase (separate from dashboard)
// These credentials are for the landing/payment flow only
const LANDING_SUPABASE_URL = "https://unywehopwurugpfwodsa.supabase.co";
const LANDING_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVueXdlaG9wd3VydWdwZndvZHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MTcwODgsImV4cCI6MjA4NDA5MzA4OH0.XlTZcK_oYS06ZMKCpTgrecdilSN20HniYONqTVybwug";

export const landingSupabase = createClient(LANDING_SUPABASE_URL, LANDING_SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'landing-auth-token', // Separate storage key to avoid conflicts with dashboard
  }
});
