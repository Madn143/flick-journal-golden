
-- Create a table for storing user movies
CREATE TABLE public.movies (
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
