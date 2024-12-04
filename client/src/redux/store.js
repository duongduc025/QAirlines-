import  { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import flightSlice from './flightSlice';
import bookingSlice from './bookingSlice';

const store = configureStore({
    reducer:{
        auth: authSlice,
        flight: flightSlice,
        booking: bookingSlice
    }
});
export default store;