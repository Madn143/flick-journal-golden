import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Your Supabase project URL and public anon key
const SUPABASE_URL = "https://kpmyrsdegyouehzdzxhl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Keep your actual key here

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,        // Keep user logged in after page refresh
    autoRefreshToken: true,      // Auto-refresh session when token expires
    detectSessionInUrl: true,    // (Optional) Handles OAuth redirects, you can remove this if not using OAuth
  },
});
