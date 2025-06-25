
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MovieCard from './MovieCard';
import { useMovies } from '@/hooks/useMovies';
import { Plus, Film, Star, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
  const { movies, favoriteMovies, loading } = useMovies();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading your movies...</div>
      </div>
    );
  }

  const stats = {
    totalMovies: movies.length,
    averageRating: movies.length > 0 ? 
      (movies.reduce((acc, movie) => acc + (movie.rating || 0), 0) / movies.length).toFixed(1) : 0,
    totalHours: Math.floor(movies.reduce((acc, movie) => acc + (movie.runtime || 0), 0) / 60),
    favoriteCount: favoriteMovies.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fadeInUp">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold hero-text mb-2">Welcome back!</h1>
              <p className="text-gray-400 text-lg">Ready to discover your next favorite movie?</p>
            </div>
            <Link to="/add-movie">
              <Button className="mt-4 md:mt-0 gold-gradient text-black font-semibold hover:scale-105 transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Add Movie
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="glass-card border-white/20">
              <CardContent className="p-4 text-center">
                <Film className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalMovies}</div>
                <div className="text-sm text-gray-400">Movies Watched</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/20">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.averageRating}</div>
                <div className="text-sm text-gray-400">Avg Rating</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/20">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalHours}h</div>
                <div className="text-sm text-gray-400">Watch Time</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.favoriteCount}</div>
                <div className="text-sm text-gray-400">Favorites</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Movie Sections */}
        <Tabs defaultValue="favorites" className="animate-scaleIn">
          <TabsList className="glass border-white/20 mb-6">
            <TabsTrigger value="favorites" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Favorite Movies
            </TabsTrigger>
            <TabsTrigger value="watched" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              All Watched Movies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites">
            <Card className="glass-card border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Star className="h-6 w-6 text-primary mr-2" />
                  Your Favorite Movies
                </CardTitle>
                <CardDescription className="text-gray-400">
                  The movies that left a lasting impression on you
                </CardDescription>
              </CardHeader>
            </Card>
            
            {favoriteMovies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteMovies.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    id={movie.id}
                    title={movie.title}
                    poster={movie.poster || '/placeholder.svg'}
                    rating={movie.rating || 0}
                    review={movie.review || ''}
                    year={movie.year || 0}
                    runtime={movie.runtime || undefined}
                    genre={movie.genre || undefined}
                    isFavorite={movie.is_favorite || false}
                  />
                ))}
              </div>
            ) : (
              <Card className="glass-card border-white/20">
                <CardContent className="p-8 text-center">
                  <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No favorite movies yet.</p>
                  <Link to="/add-movie">
                    <Button className="gold-gradient text-black font-semibold">
                      Add Your First Movie
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="watched">
            <Card className="glass-card border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Film className="h-6 w-6 text-primary mr-2" />
                  All Watched Movies
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your complete movie watching history
                </CardDescription>
              </CardHeader>
            </Card>
            
            {movies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    id={movie.id}
                    title={movie.title}
                    poster={movie.poster || '/placeholder.svg'}
                    rating={movie.rating || 0}
                    review={movie.review || ''}
                    year={movie.year || 0}
                    runtime={movie.runtime || undefined}
                    genre={movie.genre || undefined}
                    isFavorite={movie.is_favorite || false}
                  />
                ))}
              </div>
            ) : (
              <Card className="glass-card border-white/20">
                <CardContent className="p-8 text-center">
                  <Film className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No movies added yet.</p>
                  <Link to="/add-movie">
                    <Button className="gold-gradient text-black font-semibold">
                      Add Your First Movie
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
