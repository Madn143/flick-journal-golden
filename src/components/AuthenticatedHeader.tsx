
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Menu, X, LogOut, Plus, Home, Star, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AuthenticatedHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        toast({
          title: "Signed out successfully",
          description: "You have been signed out of your account.",
        });
        navigate('/auth/signin');
      } else {
        throw new Error('Sign out failed');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

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
    return user?.user_metadata?.username || user?.email || 'User';
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

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserDisplayName()} />
                    <AvatarFallback className="bg-primary text-black font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-card border-white/20" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs leading-none text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/5" asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/5" asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem 
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <div className="flex items-center px-3 py-2 mb-2">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserDisplayName()} />
                  <AvatarFallback className="bg-primary text-black font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              
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
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-white/5 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-white/5 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
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
