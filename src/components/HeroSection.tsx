import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Play, Star, Users, Award } from 'lucide-react';
import SearchBar from './SearchBar';
import heroImage from '@/assets/hero-hotel.jpg';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onSearch?: (searchData: any) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  const stats = [
    { icon: Star, value: '4.9', label: 'Guest Rating' },
    { icon: Users, value: '10K+', label: 'Happy Guests' },
    { icon: Award, value: '25+', label: 'Awards Won' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      setParallaxOffset(scrolled * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (heroRef.current && imageRef.current && contentRef.current) {
      const tl = gsap.timeline();
      
      // Hero entrance animation
      tl.fromTo(imageRef.current, 
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }
      )
      .fromTo(contentRef.current.children,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power2.out" },
        "-=1"
      );

      // Parallax effect
      gsap.to(imageRef.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        ref={imageRef}
        className="absolute inset-0 parallax-hero"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div ref={contentRef} className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6"
          >
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-sm font-medium">Luxury Hospitality Excellence</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Discover Your
            <span className="block text-accent">Perfect Stay</span>
          </h1>

          {/* Subheadline */}
          <p className="text-body text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience luxury and comfort in the world's finest hotels. Book with confidence and create unforgettable memories.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="cta" size="xl" className="text-lg">
              Check Availability
            </Button>
            <Button variant="glass" size="xl" className="text-lg">
              <Play className="w-5 h-5 mr-2" />
              Take a Tour
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-md mx-auto mb-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={onSearch} className="max-w-6xl mx-auto" />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;