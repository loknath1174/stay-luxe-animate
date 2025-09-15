import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  ArrowLeft, 
  Star, 
  Users, 
  Bed, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell,
  Waves,
  UtensilsCrossed,
  Tv,
  AirVent,
  Shield,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import roomLuxury from '@/assets/room-luxury.jpg';
import roomSuite from '@/assets/room-suite.jpg';
import roomStandard from '@/assets/room-standard.jpg';

const RoomDetail: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Mock room data - in real app, this would come from API
  const room = {
    id: roomId,
    name: 'Executive Suite with City View',
    images: [roomLuxury, roomSuite, roomStandard, roomLuxury, roomSuite],
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviewCount: 124,
    capacity: 4,
    bedType: 'King Bed + Sofa Bed',
    size: '450 sq ft',
    view: 'City Skyline',
    description: 'Experience luxury in our spacious Executive Suite featuring floor-to-ceiling windows with breathtaking city views. This elegantly appointed suite combines modern amenities with sophisticated design elements for the discerning traveler.',
    facilities: [
      { icon: Wifi, name: 'High-Speed WiFi', description: 'Complimentary fiber internet' },
      { icon: Car, name: 'Valet Parking', description: 'Secure underground parking' },
      { icon: Coffee, name: 'Premium Coffee', description: 'Nespresso machine & selection' },
      { icon: Dumbbell, name: 'Fitness Center', description: '24/7 state-of-the-art gym' },
      { icon: Waves, name: 'Pool & Spa', description: 'Rooftop infinity pool' },
      { icon: UtensilsCrossed, name: 'Room Service', description: '24-hour gourmet dining' },
      { icon: Tv, name: '65" Smart TV', description: '4K with streaming services' },
      { icon: AirVent, name: 'Climate Control', description: 'Individual temperature control' },
      { icon: Shield, name: 'Safe & Secure', description: 'Digital safe & key card access' },
    ],
    amenities: [
      'King size bed with premium linens',
      'Marble bathroom with rain shower',
      'Spacious work desk with ergonomic chair',
      'Mini-bar with premium selections',
      'Blackout curtains for optimal rest',
      'Complimentary daily housekeeping',
      'Express check-in/check-out',
      'Concierge services'
    ],
    policies: {
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      cancellation: 'Free cancellation until 24 hours before arrival',
      smoking: 'Non-smoking room',
      pets: 'Pet-friendly (additional fee applies)'
    }
  };

  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(imageRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }
      );
    }
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 1;
  };

  const totalPrice = room.price * calculateNights();
  const discountAmount = room.originalPrice ? (room.originalPrice - room.price) * calculateNights() : 0;

  const handleBookNow = () => {
    setShowBookingSummary(true);
    // In real app, navigate to booking/payment flow
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-luxury border-b border-border-light">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Button>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-accent fill-accent" />
              <span className="font-semibold">{room.rating}</span>
              <span className="text-muted-foreground">({room.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div ref={imageRef} className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={room.images[currentImageIndex]}
                    alt={`${room.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Navigation */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white shadow-medium transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white shadow-medium transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                  {currentImageIndex + 1} / {room.images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {room.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Room Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-display mb-2">{room.name}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Up to {room.capacity} guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{room.bedType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{room.size} • {room.view}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  ${room.price}/night
                </Badge>
              </div>

              <p className="text-body text-muted-foreground leading-relaxed">
                {room.description}
              </p>
            </motion.div>

            {/* Facilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    Facilities & Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {room.facilities.map((facility, index) => (
                      <motion.div
                        key={facility.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <facility.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-sm">{facility.name}</h4>
                          <p className="text-xs text-muted-foreground">{facility.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Room Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Policies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Check-in: {room.policies.checkIn} • Check-out: {room.policies.checkOut}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{room.policies.cancellation}</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• {room.policies.smoking}</p>
                      <p>• {room.policies.pets}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <Card className="shadow-strong">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Reserve Your Stay</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${room.price}</div>
                      {room.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          ${room.originalPrice}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">per night</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Check-in</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-12"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {checkInDate ? format(checkInDate, 'MMM dd') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={checkInDate}
                            onSelect={setCheckInDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Check-out</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-12"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {checkOutDate ? format(checkOutDate, 'MMM dd') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={checkOutDate}
                            onSelect={setCheckOutDate}
                            disabled={(date) => date < (checkInDate || new Date())}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Guests</label>
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <span className="text-sm">Adults</span>
                      <div className="flex items-center gap-3">
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{guests}</span>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() => setGuests(Math.min(room.capacity, guests + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  {checkInDate && checkOutDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2 py-4 border-t border-border-light"
                    >
                      <div className="flex justify-between text-sm">
                        <span>${room.price} × {calculateNights()} nights</span>
                        <span>${totalPrice}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-success">
                          <span>Discount</span>
                          <span>-${discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Taxes & fees</span>
                        <span>${Math.round(totalPrice * 0.15)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border-light">
                        <span>Total</span>
                        <span>${totalPrice + Math.round(totalPrice * 0.15)}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Book Button */}
                  <Button
                    variant="cta"
                    size="lg"
                    className="w-full"
                    onClick={handleBookNow}
                    disabled={!checkInDate || !checkOutDate}
                  >
                    {checkInDate && checkOutDate ? 'Reserve Now' : 'Select Dates'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Free cancellation • No hidden fees • Instant confirmation
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <AnimatePresence>
        {showBookingSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBookingSummary(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl p-6 max-w-md w-full shadow-strong"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Booking Confirmed!</h3>
                <p className="text-muted-foreground">
                  Your reservation for {room.name} has been confirmed.
                </p>
                <div className="bg-secondary rounded-lg p-4 text-left text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>{checkInDate ? format(checkInDate, 'MMM dd, yyyy') : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>{checkOutDate ? format(checkOutDate, 'MMM dd, yyyy') : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{guests}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total:</span>
                    <span>${totalPrice + Math.round(totalPrice * 0.15)}</span>
                  </div>
                </div>
                <Button
                  variant="cta"
                  className="w-full"
                  onClick={() => setShowBookingSummary(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomDetail;