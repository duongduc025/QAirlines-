import React from 'react';
import Navbar from '../shared/Navbar';
import HeroSection from './HeroSection';
import FlightSearchForm from './FlightSearchForm';
import Features from './Features';
import Footer from '../shared/Footer';
import useGetAllBooking from '@/hook/useGetAllBooking';
import RemarkablePromotions from './RemarkablePromotions';
import { useSelector } from 'react-redux';
import useGetAllPromotion from '@/hook/useGetAllPromotion';
import { use } from 'react';

const Home = () => {
  useGetAllPromotion();
  useGetAllBooking();
  
  return (
    <>
      <div>
        <Navbar />
        <HeroSection />
        <FlightSearchForm />
        <Features />
        <RemarkablePromotions />
        <Footer /> 
      </div>
    </>
  );
};

export default Home;