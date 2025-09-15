import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Calendar, MapPin, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface SearchBarProps {
  onSearch?: (searchData: SearchData) => void;
  className?: string;
}

interface SearchData {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '' }) => {
  const [searchData, setSearchData] = useState<SearchData>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1,
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const locations = [
    'New York City, NY',
    'Los Angeles, CA', 
    'San Francisco, CA',
    'Miami, FL',
    'Chicago, IL',
    'Las Vegas, NV'
  ];

  useEffect(() => {
    if (searchRef.current) {
      gsap.fromTo(searchRef.current, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.5 }
      );
    }
  }, []);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchData);
    }
    
    // Animate search to compact form
    if (searchRef.current) {
      gsap.to(searchRef.current, {
        scale: 0.9,
        y: -20,
        duration: 0.6,
        ease: "power2.inOut"
      });
    }
  };

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchData.location.toLowerCase())
  );

  return (
    <motion.div
      ref={searchRef}
      className={`relative z-20 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="glass border-border-light/50 shadow-strong backdrop-blur-luxury">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Where to?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="City or hotel name"
                  value={searchData.location}
                  onChange={(e) => {
                    setSearchData({ ...searchData, location: e.target.value });
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(searchData.location.length > 0)}
                  className="pl-10 h-12 bg-card/80 border-border-light focus:border-primary focus:ring-primary"
                />
                
                <AnimatePresence>
                  {showSuggestions && filteredLocations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-card border border-border-light rounded-lg shadow-medium z-50"
                    >
                      {filteredLocations.map((location, index) => (
                        <motion.button
                          key={location}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => {
                            setSearchData({ ...searchData, location });
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{location}</span>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Check In */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Check in
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                  className="pl-10 h-12 bg-card/80 border-border-light focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            {/* Check Out */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Check out
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                  className="pl-10 h-12 bg-card/80 border-border-light focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            {/* Guests & Rooms */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Guests & Rooms
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={searchData.guests}
                    onChange={(e) => setSearchData({ ...searchData, guests: parseInt(e.target.value) || 1 })}
                    className="pl-10 h-12 bg-card/80 border-border-light focus:border-primary focus:ring-primary"
                  />
                </div>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={searchData.rooms}
                  onChange={(e) => setSearchData({ ...searchData, rooms: parseInt(e.target.value) || 1 })}
                  className="w-16 h-12 bg-card/80 border-border-light focus:border-primary focus:ring-primary text-center"
                />
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              variant="cta"
              size="lg"
              className="h-12 px-8"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SearchBar;