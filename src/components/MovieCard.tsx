
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Calendar } from 'lucide-react';

interface MovieCardProps {
  id: string;
  title: string;
  poster: string;
  rating: number;
  review: string;
  year: number;
  runtime?: number;
  genre?: string;
  isFavorite?: boolean;
}

const MovieCard = ({ 
  id, 
  title, 
  poster, 
  rating, 
  review, 
  year, 
  runtime, 
  genre,
  isFavorite = false 
}: MovieCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'text-primary fill-primary' 
            : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <Card className="glass-card border-white/20 hover:border-primary/30 transition-all duration-300 hover:scale-105 group">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={poster || '/placeholder.svg'}
            alt={title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {isFavorite && (
            <div className="absolute top-2 right-2">
              <Badge className="gold-gradient text-black font-semibold">
                Favorite
              </Badge>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-white text-lg line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{year}</span>
            </div>
            {runtime && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{runtime}min</span>
              </div>
            )}
          </div>
          
          {genre && (
            <Badge variant="outline" className="mb-3 text-xs border-white/20 text-gray-300">
              {genre}
            </Badge>
          )}
          
          <div className="flex items-center space-x-1 mb-3">
            {renderStars(rating)}
            <span className="text-sm text-gray-400 ml-2">({rating}/5)</span>
          </div>
          
          <p className="text-gray-400 text-sm line-clamp-3 mb-4">
            {review}
          </p>
          
          <Link to={`/movie/${id}`}>
            <div className="w-full text-center py-2 px-4 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-all duration-200 font-medium">
              Read More
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
