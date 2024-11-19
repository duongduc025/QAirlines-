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
import Account from './components/user/Account'


const appRouter = createBrowserRouter([
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

  {path: '/account',
  element: <Account />
  },

])

function App() {

  return (
    <>
    <RouterProvider router={appRouter}/>
    </>
  )
}

export default App
