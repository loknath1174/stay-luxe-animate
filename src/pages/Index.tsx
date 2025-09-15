import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import SearchResults from '@/components/SearchResults';

const Index = () => {
  const [searchData, setSearchData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (data: any) => {
    setSearchData(data);
    setShowResults(true);
    
    // Smooth scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('search-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleRoomSelect = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />
      
      {/* Search Results */}
      {showResults && (
        <motion.div
          id="search-results"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <SearchResults 
            searchData={searchData} 
            onRoomSelect={handleRoomSelect}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Index;
