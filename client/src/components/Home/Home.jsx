import React from 'react';
import Navbar from '../shared/Navbar';
import HeroSection from './HeroSection';
import FlightSearchForm from './FlightSearchForm';
import Features from './Features';
import Footer from '../shared/Footer';
import useGetAllBooking from '@/hook/useGetAllBooking';
import RemarkablePromotions from './RemarkablePromotions';
import { useSelector } from 'react-redux';

const Home = () => {
  useGetAllBooking();
  const { allBooking } = useSelector(store => store.booking);
  
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