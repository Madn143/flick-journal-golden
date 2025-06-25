
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AuthenticatedHeader from '@/components/AuthenticatedHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

const RecommendationsPage = () => {
  const { user, loading } = useAuth();

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

  return (
    <div className="min-h-screen">
      <AuthenticatedHeader />
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 animate-fadeInUp">
            <h1 className="text-4xl font-bold hero-text mb-2">Movie Recommendations</h1>
            <p className="text-gray-400 text-lg">Discover your next favorite movie</p>
          </div>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <Star className="h-6 w-6 text-primary mr-2" />
                Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Movie recommendations based on your taste and viewing history will be available soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
