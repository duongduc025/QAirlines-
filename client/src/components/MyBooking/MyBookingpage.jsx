import React from 'react'
import Navbar from '../shared/Navbar'
import MyBooking from './MyBooking'
import Footer from '../shared/Footer'
import useGetAllBooking from '@/hook/useGetAllBooking';
const MyBookingpage = () => {
  
  useGetAllBooking();
  return (
    <>
           <Navbar/>
         <MyBooking/>
        <Footer/>
    </>
  )
}

export default MyBookingpage