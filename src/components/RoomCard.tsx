import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Users, Bed, Wifi, Car, Coffee, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    images: string[];
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    capacity: number;
    bedType: string;
    amenities: string[];
    size: string;
    view: string;
    isRefundable?: boolean;
    isPopular?: boolean;
  };
  onQuickView?: (roomId: string) => void;
  onBook?: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onQuickView, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const amenityIcons: { [key: string]: React.ComponentType<any> } = {
    wifi: Wifi,
    parking: Car,
    breakfast: Coffee,
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  const discountPercentage = room.originalPrice 
    ? Math.round((1 - room.price / room.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Card className="overflow-hidden shadow-soft hover:shadow-strong transition-all duration-300 border-border-light bg-card">
        {/* Image Carousel */}
        <div className="relative h-64 overflow-hidden">
          {room.isPopular && (
            <Badge className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground">
              Popular
            </Badge>
          )}

          <motion.button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isLiked ? 'text-cta fill-cta' : 'text-muted-foreground'
              }`} 
            />
          </motion.button>

          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={room.images[currentImageIndex]}
              alt={room.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              exit={{ opacity: 0 }}
              onLoad={() => setImageLoaded(true)}
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {room.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {room.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
              {room.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Quick View Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button
              variant="glass"
              size="sm"
              onClick={() => onQuickView?.(room.id)}
              className="backdrop-blur-md"
            >
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </motion.div>
        </div>

        <CardContent className="p-6">
          {/* Room Info */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg text-card-foreground leading-tight">
                {room.name}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {room.size} • {room.view} view
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm font-medium">{room.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({room.reviewCount})
              </span>
            </div>
          </div>

          {/* Room Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{room.capacity} guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{room.bedType}</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex gap-2 mb-4">
            {room.amenities.slice(0, 3).map((amenity) => {
              const IconComponent = amenityIcons[amenity.toLowerCase()];
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-xs"
                >
                  {IconComponent && <IconComponent className="w-3 h-3" />}
                  <span className="capitalize">{amenity}</span>
                </div>
              );
            })}
            {room.amenities.length > 3 && (
              <div className="px-2 py-1 bg-secondary rounded-md text-xs text-muted-foreground">
                +{room.amenities.length - 3} more
              </div>
            )}
          </div>

          {/* Pricing and CTA */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-card-foreground">
                  ${room.price}
                </span>
                {room.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${room.originalPrice}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  /night
                </span>
              </div>
              {discountPercentage > 0 && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {discountPercentage}% off
                </Badge>
              )}
              {room.isRefundable && (
                <p className="text-xs text-success mt-1">Free cancellation</p>
              )}
            </div>

            <Button
              variant="cta"
              size="sm"
              onClick={() => onBook?.(room.id)}
              className="px-6"
            >
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RoomCard;