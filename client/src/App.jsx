import { useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import useGetAllPromotion from './hook/useGetAllPromotion'
import useGetAllBooking from './hook/useGetAllBooking'
import useGetAllBookingsAdmin from './hook/useGetAllBookingsAdmin'
import useGetAllAirCraft from './hook/useGetAllAirCraft'
import useGetAllFlight from './hook/useGetAllFlight'

import { setUser } from './redux/authSlice'
import { setAllBooking } from './redux/bookingSlice'
import { toast } from 'react-toastify'

import Home from './components/Home/Home'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Promotion from './components/promotion/promotion'
import MyBookingpage from './components/MyBooking/MyBookingpage'
import UserAccount from './components/user/UserAccount'
import AdminHome from './components/admin/AdminHome'
import AdminPromotion from './components/admin/AdminPromotion'
import AdminAirCraft from './components/admin/AdminAirCraft'
import AdminFlight from './components/admin/AdminFlight'
import AdminBooking from './components/admin/AdminBooking'
import BookingDetail from './components/MyBooking/BookingDetail'
import FlightPage from './components/Booking/FlightPage'
import { LOCAL_STORAGE_TOKEN_NAME } from './utils/constraint'



// Function to check if user is authenticated
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(store => store.auth);
  return user ? children : <Navigate to="/login" replace />;
};

// Guest navigation links
const guessNavLinks = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/home',
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
  // {
  //   path: '/flight',
  //   element: <Flightpage />
  // },
  {
    path: '*',
    element: <Navigate to="/" replace />
  },
  {
    path: '/mybookings',
    element: <ProtectedRoute><MyBookingpage /></ProtectedRoute>
  },
  {
    path: 'flight',
    element: <ProtectedRoute><FlightPage /></ProtectedRoute>
  }

])

// User navigation routes
const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/home',
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
    path: 'flight',
    element: <ProtectedRoute><FlightPage /></ProtectedRoute>
  },
  {
    path: '/mybookings',
    element: <ProtectedRoute><MyBookingpage /></ProtectedRoute>
  },
  {
    path: '/account',
    element: <UserAccount />
  },
  {
    path: '/bookingdetail/:id',
    element: <BookingDetail />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])

// Admin navigation routes
const AdminRouter = createBrowserRouter([
  {
    path: '/',
    element: <AdminHome />
  },
  {
    path: '/home',
    element: <AdminHome />
  },
  {
    path: '/promotions',
    element: <AdminPromotion />
  },
  {
    path: '/aircrafts',
    element: <AdminAirCraft />
  },
  {
    path: '/flights',
    element: <AdminFlight />
  },
  {
    path: '/bookings',
    element: <AdminBooking />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  useGetAllPromotion();
  useGetAllBooking();


  const handleLogout = async () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    dispatch(setUser(null));    
    dispatch(setAllBooking([]));
  }

  useEffect(() => {
    const logoutTimer = setTimeout(() => {
      handleLogout();
    }, 3600000); 

    return () => clearTimeout(logoutTimer);
  }, [dispatch]);

  // Determine which router to use based on user role
  const router = user?.role === 'admin' 
    ? AdminRouter 
    : (user?.role === 'user' 
      ? appRouter 
      : guessNavLinks);

  return <RouterProvider router={router} />;
}

export default App;