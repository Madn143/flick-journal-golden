
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AuthenticatedHeader from '@/components/AuthenticatedHeader';
import Dashboard from '@/components/Dashboard';

const DashboardPage = () => {
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
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
