import express from 'express';
import { getBookingsByUserEmail, getSpecificBookingByUserEmail, createBooking, listAllBookings, cancelBooking } from '../controllers/booking.controller.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';

const router = express.Router();

// ...existing code...

router.get('/bookingslist', listAllBookings); 
router.get('/users/:email/bookings', authenticateJWT, getBookingsByUserEmail);
router.get('/users/:email/bookings/:booking_id', authenticateJWT, getSpecificBookingByUserEmail);
router.post('/bookings', authenticateJWT, createBooking);
router.delete('/bookings/:booking_id', authenticateJWT, cancelBooking);

export default router;
