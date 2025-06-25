/*
  # Movies table setup

  1. New Tables
    - `movies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, required)
      - `year` (integer, optional)
      - `poster` (text, optional)
      - `plot` (text, optional)
      - `genre` (text, optional)
      - `runtime` (integer, optional)
      - `rating` (integer, 1-5 scale, optional)
      - `review` (text, optional)
      - `is_favorite` (boolean, default false)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `movies` table
    - Add policies for authenticated users to manage their own movies
    - Enable realtime for the movies table
*/

-- Create a table for storing user movies (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.movies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  year INTEGER,
  poster TEXT,
  plot TEXT,
  genre TEXT,
  runtime INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view their own movies" ON public.movies;
  DROP POLICY IF EXISTS "Users can create their own movies" ON public.movies;
  DROP POLICY IF EXISTS "Users can update their own movies" ON public.movies;
  DROP POLICY IF EXISTS "Users can delete their own movies" ON public.movies;
END $$;

-- Create policies for user-specific access
CREATE POLICY "Users can view their own movies" 
  ON public.movies 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own movies" 
  ON public.movies 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own movies" 
  ON public.movies 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own movies" 
  ON public.movies 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable realtime for the movies table
ALTER TABLE public.movies REPLICA IDENTITY FULL;