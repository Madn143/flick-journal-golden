import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Your Supabase project URL and anon public key
const SUPABASE_URL = "https://kpmyrsdegyouehzdzxhl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwbXlyc2RlZ3lvdWVoemR6eGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MTM3NzAsImV4cCI6MjA2NjM4OTc3MH0.p0jDtYJtTK6HjMVFure1M6qd9CQYXUlgztbqeDOB1q4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,        // Keep user logged in after page refresh
    autoRefreshToken: true,      // Auto-refresh session when token expires
    detectSessionInUrl: true,    // Handle OAuth callbacks
    flowType: 'pkce',           // Use PKCE flow for better security
    storage: window.localStorage, // Use localStorage for session persistence
    storageKey: 'supabase.auth.token', // Custom storage key
  },
  global: {
    headers: {
      'X-Client-Info': 'my-movie-journal@1.0.0',
    },
  },
});

// Helper function to handle auth errors
export const handleAuthError = (error: any) => {
  console.error('Auth error:', error);
  
  if (error.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials.';
  } else if (error.message?.includes('Email not confirmed')) {
    return 'Please check your email and confirm your account.';
  } else if (error.message?.includes('Too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  } else if (error.message?.includes('User already registered')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return !!session;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};