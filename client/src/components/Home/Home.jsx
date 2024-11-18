import React from 'react'
import Navbar from '../shared/Navbar'
import HeroSection from './HeroSection'
import FlightSearchForm from './FlightSearchForm'
import Footer from '../shared/Footer'
const Home = () => {
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