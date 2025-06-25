
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Film, Star, Users, BookOpen } from 'lucide-react';

const Hero = () => {
  const features = [
    {
      icon: Film,
      title: 'Track Movies',
      description: 'Keep a personal record of every movie you watch'
    },
    {
      icon: Star,
      title: 'Rate & Review',
      description: 'Give ratings and write detailed reviews'
    },
    {
      icon: Users,
      title: 'Personal Journal',
      description: 'Your private movie diary, just for you'
    },
    {
      icon: BookOpen,
      title: 'Rich Details',
      description: 'Auto-fetch movie info from comprehensive databases'
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Hero Content */}
        <div className="animate-fadeInUp">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass border border-primary/20 mb-8">
            <Film className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm text-primary font-medium">Your Personal Movie Experience</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="hero-text">My Movie</span>
            <br />
            <span className="hero-text">Journal</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Keep track of every movie you watch. Rate, review, and build your personal 
            cinema diary with beautiful glassmorphism design.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/auth/signup">
              <Button size="lg" className="gold-gradient text-black font-semibold px-8 py-3 text-lg hover:scale-105 transition-all duration-200">
                Start Your Journal
              </Button>
            </Link>
            <Link to="/auth/signin">
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-3 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scaleIn">
          {features.map((feature, index) => (
            <div key={index} className="glass-card p-6 hover:bg-white/5 transition-all duration-300">
              <div className="inline-flex p-3 rounded-lg gold-gradient mb-4">
                <feature.icon className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
