
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Calendar, Clock, Edit, Trash2 } from 'lucide-react';

interface MovieDetailData {
  id: string;
  title: string;
  poster: string;
  plot: string;
  year: number;
  runtime: number;
  genre: string;
  director: string;
  cast: string;
  userRating: number;
  userReview: string;
  isFavorite: boolean;
  dateAdded: string;
}

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchMovie = async () => {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching movie:', error);
    } else {
      setMovie(data as MovieDetailData);
    }
    setIsLoading(false);
  };

  fetchMovie();
}, [id]);


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating 
            ? 'text-primary fill-primary' 
            : 'text-gray-600'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Movie not found</p>
          <Link to="/dashboard">
            <Button className="gold-gradient text-black font-semibold">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="text-gray-400 hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Movie Detail Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster - Left Column on Desktop, Top on Mobile */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="glass-card border-white/20 overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-auto object-cover"
                  />
                  {movie.isFavorite && (
                    <div className="p-4">
                      <Badge className="gold-gradient text-black font-semibold w-full justify-center">
                        ⭐ Favorite Movie
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                <Button className="w-full gold-gradient text-black font-semibold hover:scale-105 transition-all duration-200">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Review
                </Button>
                <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove from Journal
                </Button>
              </div>
            </div>
          </div>

          {/* Movie Details & Review - Right Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Movie Info */}
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{movie.year}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{movie.runtime} min</span>
                    </div>
                    <Badge variant="outline" className="border-white/20 text-gray-300">
                      {movie.genre}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Plot</h3>
                    <p className="text-gray-300 leading-relaxed">{movie.plot}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-white mb-1">Director</h4>
                      <p className="text-gray-400">{movie.director}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Cast</h4>
                      <p className="text-gray-400">{movie.cast}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Review */}
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Your Review</h2>
                  <div className="text-sm text-gray-400">
                    Added on {new Date(movie.dateAdded).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center space-x-1 mb-4">
                  {renderStars(movie.userRating)}
                  <span className="ml-2 text-lg font-semibold text-primary">
                    {movie.userRating}/5
                  </span>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {movie.userReview}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Movie Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div className="p-3 glass border border-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{movie.userRating}</div>
                    <div className="text-sm text-gray-400">Your Rating</div>
                  </div>
                  <div className="p-3 glass border border-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{movie.year}</div>
                    <div className="text-sm text-gray-400">Release Year</div>
                  </div>
                  <div className="p-3 glass border border-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</div>
                    <div className="text-sm text-gray-400">Runtime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
