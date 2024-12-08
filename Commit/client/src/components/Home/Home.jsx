import React from 'react'
import Navbar from '../shared/Navbar'
import HeroSection from './HeroSection'
import FlightSearchForm from './FlightSearchForm'
import Footer from '../shared/Footer'
import useGetAllBooking from '@/hook/useGetAllBooking'
import { useSelector } from 'react-redux'
const Home = () => {
  useGetAllBooking();
  console.log("Home");
  const { allBooking } = useSelector(state => state.booking);
  console.log(allBooking);
  return (
    <>
    <div>
    <Navbar/>
    <HeroSection/>
    <FlightSearchForm/>
    <Footer/>
    </div>
    </>
  )
}

export default Home