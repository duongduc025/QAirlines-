import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/shared/Navbar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home/Home'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Promotion from './components/promotion/promotion'
import Flightpage from './components/Booking/Flightpage'
import MyBookingpage from './components/MyBooking/MyBookingpage'
import UserAccount from './components/user/UserAccount'
import AdminHome from './components/admin/AdminHome'
import AdminPromotion from './components/admin/AdminPromotion'
import AdminAirCraft from './components/admin/AdminAirCraft'
import AdminFlight from './components/admin/AdminFlight'
import AdminBooking from './components/admin/AdminBooking'
import BookingDetail from './components/MyBooking/BookingDetail'
import PostDetail from './components/promotion/PostDetail'

const appRouter = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminHome />
  },
  {
    path: '/admin/promotions',
    element: <AdminPromotion />
  },
  {
    path: '/admin/aircrafts',
    element: <AdminAirCraft />
  },
  {
    path: '/admin/flights',
    element: <AdminFlight />
  },
  {
    path: '/admin/bookings',
    element: <AdminBooking />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/promotion',
    element: <Promotion />
  },
  {
  path: '/flight',
  element: <Flightpage />
  },
  {
  path: '/mybookings',
  element: <MyBookingpage />
  },
  {
    path: '/account',
    element: <UserAccount />
  },
  {
    path: '/bookingdetail',
    element: <BookingDetail />
  },
  {
    path: '/bookingdetail/:id',
    element: <BookingDetail />
  },
  {
    path: '/promotion/detail',
    element: <PostDetail />
  },

])
const AdminRouter = createBrowserRouter([
  {
    path: '/',
    element: <AdminHome />
  },
])


function App() {
  const isAdmin = false;
  return (
    <>
      <RouterProvider router={isAdmin ? AdminRouter : appRouter}/>
    </>
  )
}

export default App
