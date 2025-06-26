
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AuthenticatedHeader from '@/components/AuthenticatedHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMovies } from '@/hooks/useMovies';
import { User, Film, Star, Calendar, Edit } from 'lucide-react';

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const { movies, favoriteMovies } = useMovies();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  const getUserInitials = () => {
    if (user?.user_metadata?.username) {
      return user.user_metadata.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email || 'User';
  };

  const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const stats = {
    totalMovies: movies.length,
    favoriteMovies: favoriteMovies.length,
    averageRating: movies.length > 0 ? 
      (movies.reduce((acc, movie) => acc + (movie.rating || 0), 0) / movies.length).toFixed(1) : 0,
  };

  return (
    <div className="min-h-screen">
      <AuthenticatedHeader />
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 animate-fadeInUp">
            <h1 className="text-4xl font-bold hero-text mb-2">Profile</h1>
            <p className="text-gray-400 text-lg">Your movie journey overview</p>
          </div>

          {/* Profile Header */}
          <Card className="glass-card border-white/20 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserDisplayName()} />
                  <AvatarFallback className="bg-primary text-black font-bold text-2xl">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">{getUserDisplayName()}</h2>
                  <p className="text-gray-400 mb-4">{user.email}</p>
                  <div className="flex items-center justify-center md:justify-start text-gray-400 text-sm mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {joinedDate}
                  </div>
                  <Button className="gold-gradient text-black font-semibold">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card border-white/20">
              <CardContent className="p-6 text-center">
                <Film className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stats.totalMovies}</div>
                <div className="text-gray-400">Movies Watched</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/20">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stats.favoriteMovies}</div>
                <div className="text-gray-400">Favorite Movies</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Star className="h-6 w-6 text-primary mr-1" />
                  <span className="text-primary text-lg">★</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.averageRating}</div>
                <div className="text-gray-400">Average Rating</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <User className="h-6 w-6 text-primary mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {movies.length > 0 ? (
                <div className="space-y-3">
                  {movies.slice(0, 5).map((movie) => (
                    <div key={movie.id} className="flex items-center p-3 bg-white/5 rounded-lg">
                      <Film className="h-5 w-5 text-primary mr-3" />
                      <div className="flex-1">
                        <p className="text-white">{movie.title}</p>
                        <p className="text-gray-400 text-sm">
                          {movie.rating && `Rated ${movie.rating}/10`} • 
                          {new Date(movie.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No movies added yet. Start building your movie journal!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
