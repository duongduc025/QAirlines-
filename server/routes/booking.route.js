import express from 'express';
import { getBookingsByUserEmail, getSpecificBookingByUserEmail, createBooking, listAllBookings, cancelBooking } from '../controllers/booking.controller.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin, isCustomer } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ...existing code...

router.get('/bookingslist',  authenticateJWT, isAdmin, listAllBookings); 
router.get('/users/:email/bookings', authenticateJWT, isCustomer, getBookingsByUserEmail);
router.get('/users/:email/bookings/:booking_id', authenticateJWT, isCustomer, getSpecificBookingByUserEmail);
router.post('/bookings', authenticateJWT, isCustomer, createBooking);
router.delete('/bookings/:booking_id', authenticateJWT, isCustomer, cancelBooking);

export default router;
