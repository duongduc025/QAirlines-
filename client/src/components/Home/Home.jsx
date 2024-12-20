import React from 'react';
import Navbar from '../shared/Navbar';
import HeroSection from './HeroSection';
import QAirlineIntro from './FlightSearchForm';
import Features from './Features';
import Footer from '../shared/Footer';
import RemarkablePromotions from './RemarkablePromotions';

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <QAirlineIntro />
      <Features />
      <RemarkablePromotions />
      <Footer /> 
    </div>
  );
};

export default Home;