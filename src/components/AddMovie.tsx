import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Search, Plus, Film, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const OMDB_API_KEY = "e38636d9";

interface MovieSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface MovieDetails {
  Title: string;
  Year: string;
  Runtime: string;
  Genre: string;
  Plot: string;
  Poster: string;
  imdbID: string;
  Director?: string;
  Actors?: string;
}

const AddMovie = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    review: '',
    isFavorite: false
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debounced search function
  const debounceSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (query.trim().length >= 2) {
            searchMovies(query);
          } else {
            setSearchResults([]);
            setShowDropdown(false);
          }
        }, 500); // 500ms delay
      };
    })(),
    []
  );

  // Effect to trigger debounced search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      debounceSearch(searchQuery);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery, debounceSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchMovies = async (query: string) => {
    setIsSearching(true);
    
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`);
      const data = await response.json();
      
      if (data.Response === 'True') {
        setSearchResults(data.Search || []);
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      toast({
        title: "Search Error",
        description: "Failed to search movies. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  const getMovieDetails = async (imdbID: string) => {
    setIsLoadingDetails(true);
    
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`);
      const data = await response.json();
      
      if (data.Response === 'True') {
        setSelectedMovie(data);
        setSearchResults([]);
        setSearchQuery(data.Title);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch movie details",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const clearSelection = () => {
    setSelectedMovie(null);
    setSearchQuery('');
    setFormData({ rating: 0, review: '', isFavorite: false });
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
          i < rating 
            ? 'text-primary fill-primary' 
            : 'text-gray-600 hover:text-primary/50'
        }`}
        onClick={interactive ? () => setFormData({...formData, rating: i + 1}) : undefined}
      />
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovie || !user) return;
    
    try {
      const { error } = await supabase
        .from('movies')
        .insert({
          user_id: user.id,
          title: selectedMovie.Title,
          year: parseInt(selectedMovie.Year),
          poster: selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : null,
          plot: selectedMovie.Plot !== 'N/A' ? selectedMovie.Plot : null,
          genre: selectedMovie.Genre !== 'N/A' ? selectedMovie.Genre : null,
          runtime: selectedMovie.Runtime !== 'N/A' ? parseInt(selectedMovie.Runtime) : null,
          rating: formData.rating,
          review: formData.review,
          is_favorite: formData.isFavorite
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Movie added to your journal successfully.",
      });

      // Reset form
      clearSelection();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error adding movie:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add movie",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-4xl font-bold hero-text mb-2">Add New Movie</h1>
          <p className="text-gray-400 text-lg">Search for a movie and add it to your journal</p>
        </div>

        {/* Movie Search */}
        <Card className="glass-card border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Search className="h-5 w-5 text-primary mr-2" />
              Search Movies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="search-container relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Type a movie title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 pr-10"
                    onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                  )}
                  {selectedMovie && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearSelection}
                      className="absolute right-1 top-1 h-8 w-8 p-0 text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto glass-card border border-white/20 rounded-lg">
                  {searchResults.map((movie) => (
                    <div
                      key={movie.imdbID}
                      onClick={() => getMovieDetails(movie.imdbID)}
                      className="p-3 hover:bg-white/5 cursor-pointer transition-all duration-200 border-b border-white/10 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.svg'}
                          alt={movie.Title}
                          className="w-12 h-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">{movie.Title}</h3>
                          <p className="text-sm text-gray-400">{movie.Year} • {movie.Type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results Message */}
              {showDropdown && searchResults.length === 0 && !isSearching && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 glass-card border border-white/20 rounded-lg p-4 text-center text-gray-400">
                  No movies found for "{searchQuery}"
                </div>
              )}
            </div>

            {isLoadingDetails && (
              <div className="mt-4 text-center text-gray-400 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading movie details...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Movie & Review Form */}
        {selectedMovie && (
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Film className="h-5 w-5 text-primary mr-2" />
                Add to Your Journal
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Movie Preview */}
              <div className="flex flex-col md:flex-row gap-6 mb-6 p-4 glass border border-white/10 rounded-lg">
                <img
                  src={selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : '/placeholder.svg'}
                  alt={selectedMovie.Title}
                  className="w-32 h-48 object-cover rounded-lg mx-auto md:mx-0"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedMovie.Title} ({selectedMovie.Year})
                  </h3>
                  <p className="text-gray-400 mb-4">{selectedMovie.Plot}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.Genre !== 'N/A' && (
                      <Badge className="gold-gradient text-black font-semibold">
                        {selectedMovie.Genre}
                      </Badge>
                    )}
                    {selectedMovie.Runtime !== 'N/A' && (
                      <Badge variant="outline" className="border-white/20 text-gray-300">
                        {selectedMovie.Runtime}
                      </Badge>
                    )}
                    {selectedMovie.Director && selectedMovie.Director !== 'N/A' && (
                      <Badge variant="outline" className="border-white/20 text-gray-300">
                        Dir: {selectedMovie.Director}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-white font-medium mb-3 block">Your Rating *</Label>
                  <div className="flex items-center space-x-1">
                    {renderStars(formData.rating, true)}
                    <span className="ml-2 text-gray-400">
                      {formData.rating > 0 ? `${formData.rating}/5` : 'Click to rate'}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="review" className="text-white font-medium">
                    Your Review
                  </Label>
                  <Textarea
                    id="review"
                    placeholder="What did you think about this movie? Share your thoughts..."
                    value={formData.review}
                    onChange={(e) => setFormData({...formData, review: e.target.value})}
                    rows={4}
                    className="mt-2 bg-black/50 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="favorite"
                    type="checkbox"
                    checked={formData.isFavorite}
                    onChange={(e) => setFormData({...formData, isFavorite: e.target.checked})}
                    className="rounded border-white/20 bg-black/50 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="favorite" className="text-white">
                    Add to Favorites
                  </Label>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={formData.rating === 0}
                    className="gold-gradient text-black font-semibold hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Journal
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearSelection}
                    className="border-white/20 text-gray-300 hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddMovie;
