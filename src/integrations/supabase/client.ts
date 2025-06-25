import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Your Supabase project URL and anon public key
const SUPABASE_URL = "https://kpmyrsdegyouehzdzxhl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwbXlyc2RlZ3lvdWVoemR6eGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MTM3NzAsImV4cCI6MjA2NjM4OTc3MH0.p0jDtYJtTK6HjMVFure1M6qd9CQYXUlgztbqeDOB1q4"; // Replace this with your actual anon key

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,        // Keep user logged in after page refresh
    autoRefreshToken: true,      // Auto-refresh session when token expires
    detectSessionInUrl: true,    // Useful for OAuth, safe to leave on
  },
});
