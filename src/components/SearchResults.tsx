import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SortAsc, Grid, List, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RoomCard from './RoomCard';
import roomLuxury from '@/assets/room-luxury.jpg';
import roomSuite from '@/assets/room-suite.jpg';
import roomStandard from '@/assets/room-standard.jpg';

interface SearchResultsProps {
  searchData?: any;
  onRoomSelect?: (roomId: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchData, onRoomSelect }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const amenities = [
    'WiFi',
    'Parking',
    'Breakfast',
    'Pool',
    'Gym',
    'Spa',
    'Restaurant',
    'Room Service'
  ];

  const rooms = [
    {
      id: '1',
      name: 'Executive Suite with City View',
      images: [roomLuxury, roomSuite, roomStandard],
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviewCount: 124,
      capacity: 4,
      bedType: 'King Bed',
      amenities: ['wifi', 'parking', 'breakfast', 'pool'],
      size: '450 sq ft',
      view: 'City',
      isRefundable: true,
      isPopular: true,
    },
    {
      id: '2',
      name: 'Deluxe Ocean View Room',
      images: [roomSuite, roomLuxury, roomStandard],
      price: 249,
      rating: 4.9,
      reviewCount: 89,
      capacity: 2,
      bedType: 'Queen Bed',
      amenities: ['wifi', 'breakfast', 'pool', 'spa'],
      size: '380 sq ft',
      view: 'Ocean',
      isRefundable: true,
    },
    {
      id: '3',
      name: 'Standard City Room',
      images: [roomStandard, roomLuxury, roomSuite],
      price: 189,
      originalPrice: 229,
      rating: 4.6,
      reviewCount: 203,
      capacity: 2,
      bedType: 'Double Bed',
      amenities: ['wifi', 'parking'],
      size: '320 sq ft',
      view: 'City',
      isRefundable: false,
    },
    {
      id: '4',
      name: 'Presidential Suite',
      images: [roomLuxury, roomSuite, roomStandard],
      price: 599,
      rating: 5.0,
      reviewCount: 45,
      capacity: 6,
      bedType: 'King Bed + Sofa',
      amenities: ['wifi', 'parking', 'breakfast', 'pool', 'spa', 'gym'],
      size: '800 sq ft',
      view: 'Panoramic',
      isRefundable: true,
      isPopular: true,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredRooms = rooms.filter(room => {
    const inPriceRange = room.price >= priceRange[0] && room.price <= priceRange[1];
    const hasSelectedAmenities = selectedAmenities.length === 0 || 
      selectedAmenities.some(amenity => room.amenities.includes(amenity.toLowerCase()));
    
    return inPriceRange && hasSelectedAmenities;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleQuickView = (roomId: string) => {
    onRoomSelect?.(roomId);
  };

  const handleBook = (roomId: string) => {
    onRoomSelect?.(roomId);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-64 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6">
        {/* Search Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span>{searchData?.location || 'New York City'}</span>
            <span>•</span>
            <span>{searchData?.checkIn || '2024-03-15'} - {searchData?.checkOut || '2024-03-18'}</span>
            <span>•</span>
            <span>{searchData?.guests || 2} guests, {searchData?.rooms || 1} room</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {filteredRooms.length} rooms found
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Price per night</label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000}
                  step={10}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Amenities</label>
                <div className="space-y-2">
                  {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAmenities([...selectedAmenities, amenity]);
                          } else {
                            setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                          }
                        }}
                      />
                      <label htmlFor={amenity} className="text-sm">{amenity}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 1000]);
                  setSelectedAmenities([]);
                }}
                className="w-full"
              >
                Reset Filters
              </Button>
            </Card>
          </motion.div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SortAsc className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon-sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon-sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Room Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${sortBy}-${JSON.stringify(selectedAmenities)}-${priceRange.join('-')}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
              >
                {sortedRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RoomCard
                      room={room}
                      onQuickView={handleQuickView}
                      onBook={handleBook}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredRooms.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-muted-foreground mb-4">
                  No rooms match your current filters
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceRange([0, 1000]);
                    setSelectedAmenities([]);
                  }}
                >
                  Reset Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;