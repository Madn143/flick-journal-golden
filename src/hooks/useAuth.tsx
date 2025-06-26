import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session - handles OAuth callbacks
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
        } else if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          console.log('Initial session loaded:', session?.user?.email);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }

        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session?.user?.email);

          // Clear OAuth query params from URL
          if (
            window.location.search.includes('code=') ||
            window.location.search.includes('error=')
          ) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          localStorage.removeItem('supabase.auth.token');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed for user:', session?.user?.email);
        }
      }
    );

    // Initialize
    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }

      setUser(null);
      setSession(null);
      localStorage.removeItem('supabase.auth.token');

      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Refresh session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Error refreshing session:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Refresh session error:', error);
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    refreshSession,
    isAuthenticated: !!user,
  };
};
