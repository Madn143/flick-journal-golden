
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Menu, X, LogOut, Plus, Home, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const AuthenticatedHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg gold-gradient">
              <Film className="h-6 w-6 text-black" />
            </div>
            <span className="text-xl font-bold hero-text">My Movie Journal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-primary">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/add-movie">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Movie
              </Button>
            </Link>
            <Link to="/recommendations">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-primary">
                <Star className="h-4 w-4 mr-2" />
                Recommendations
              </Button>
            </Link>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-red-400"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-card mt-2 mb-4">
              <Link
                to="/dashboard"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-white/5 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/add-movie"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-white/5 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Movie
              </Link>
              <Link
                to="/recommendations"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-white/5 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Star className="h-4 w-4 mr-2" />
                Recommendations
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-red-400 hover:bg-white/5 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
