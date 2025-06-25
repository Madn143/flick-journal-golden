
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Movie {
  id: string;
  title: string;
  year: number | null;
  poster: string | null;
  plot: string | null;
  genre: string | null;
  runtime: number | null;
  rating: number | null;
  review: string | null;
  is_favorite: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMovies = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription
    const channel = supabase
      .channel('movies-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'movies',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchMovies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const favoriteMovies = movies.filter(movie => movie.is_favorite);

  return { movies, favoriteMovies, loading, refetch: fetchMovies };
};
