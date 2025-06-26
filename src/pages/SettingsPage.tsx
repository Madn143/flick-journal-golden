
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AuthenticatedHeader from '@/components/AuthenticatedHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';

const SettingsPage = () => {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 animate-fadeInUp">
            <h1 className="text-4xl font-bold hero-text mb-2">Settings</h1>
            <p className="text-gray-400 text-lg">Manage your account preferences</p>
          </div>

          <div className="grid gap-6">
            {/* Account Settings */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <User className="h-6 w-6 text-primary mr-2" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Email</h3>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/5">
                    Change
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Password</h3>
                    <p className="text-gray-400 text-sm">Last updated 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/5">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Bell className="h-6 w-6 text-primary mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Email Notifications</h3>
                    <p className="text-gray-400 text-sm">Receive updates about your movie journal</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/5">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Movie Recommendations</h3>
                    <p className="text-gray-400 text-sm">Get personalized movie suggestions</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/5">
                    Enable
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Shield className="h-6 w-6 text-primary mr-2" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Profile Privacy</h3>
                    <p className="text-gray-400 text-sm">Control who can see your movie journal</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/5">
                    Private
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Data Export</h3>
                    <p className="text-gray-400 text-sm">Download all your movie data</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/5">
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Palette className="h-6 w-6 text-primary mr-2" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Theme</h3>
                    <p className="text-gray-400 text-sm">Currently using dark theme</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/5">
                    Dark
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
