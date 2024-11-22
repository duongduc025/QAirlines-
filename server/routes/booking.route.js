import express from 'express';
import { createBooking, getBookingByBookingId, getBookingsByUserId } from '../controllers/booking.controller.js';
import { bookingValidation } from '../validations/booking.validation.js'; // Import validation

const router = express.Router();

router.post('/book', bookingValidation, createBooking); // Use validation

router.get('/booking/:bookingId', getBookingByBookingId); // Add new route
router.get('/user/:userId/bookings', getBookingsByUserId); // Add new route to get bookings by user ID

export default router;
