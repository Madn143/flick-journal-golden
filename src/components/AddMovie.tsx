
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Search, Plus, Film } from 'lucide-react';

interface MovieSearchResult {
  id: string;
  title: string;
  year: string;
  poster: string;
  plot: string;
  genre: string;
  runtime: string;
}

const AddMovie = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    review: '',
    isFavorite: false
  });

  // Mock search function - In real app, this would use TMDB or OMDb API
  const searchMovies = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Mock API response
    setTimeout(() => {
      const mockResults: MovieSearchResult[] = [
        {
          id: '1',
          title: 'The Godfather',
          year: '1972',
          poster: '/placeholder.svg',
          plot: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
          genre: 'Crime, Drama',
          runtime: '175 min'
        },
        {
          id: '2',
          title: 'The Godfather Part II',
          year: '1974',
          poster: '/placeholder.svg',
          plot: 'The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.',
          genre: 'Crime, Drama',
          runtime: '202 min'
        }
      ].filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const selectMovie = (movie: MovieSearchResult) => {
    setSelectedMovie(movie);
    setSearchResults([]);
    setSearchQuery('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovie) return;
    
    console.log('Adding movie:', {
      movie: selectedMovie,
      userRating: formData.rating,
      userReview: formData.review,
      isFavorite: formData.isFavorite
    });
    
    // Reset form
    setSelectedMovie(null);
    setFormData({ rating: 0, review: '', isFavorite: false });
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
            <div className="flex gap-2">
              <Input
                placeholder="Type a movie title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchMovies(searchQuery)}
                className="bg-black/50 border-white/20 text-white placeholder:text-gray-500"
              />
              <Button 
                onClick={() => searchMovies(searchQuery)}
                disabled={isSearching}
                className="gold-gradient text-black font-semibold"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => selectMovie(movie)}
                    className="p-3 glass border border-white/10 rounded-lg cursor-pointer hover:border-primary/30 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{movie.title} ({movie.year})</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{movie.plot}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                            {movie.genre}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                            {movie.runtime}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="w-32 h-48 object-cover rounded-lg mx-auto md:mx-0"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedMovie.title} ({selectedMovie.year})
                  </h3>
                  <p className="text-gray-400 mb-4">{selectedMovie.plot}</p>
                  <div className="flex gap-2">
                    <Badge className="gold-gradient text-black font-semibold">
                      {selectedMovie.genre}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-gray-300">
                      {selectedMovie.runtime}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-white font-medium mb-3 block">Your Rating</Label>
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
                    onClick={() => setSelectedMovie(null)}
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
