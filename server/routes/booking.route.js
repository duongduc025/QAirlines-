import express from 'express';
import { getBookingByUserId, getSpecificBookingByUserId, createBooking, createRoundBooking, listAllBookings, cancelBooking } from '../controllers/booking.controller.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin, isCustomer } from '../middlewares/auth.middleware.js';
import { createBookingValidation, createRoundBookingValidation } from '../validations/booking.validation.js';
import { handleValidationErrors } from '../middlewares/validation.js';

const router = express.Router();

// ...existing code...

router.get('/bookingslist', authenticateJWT, isAdmin, listAllBookings);
router.get('/users/:_id/bookings', authenticateJWT, isCustomer, getBookingByUserId);
router.get('/users/:_id/bookings/:booking_id', authenticateJWT, isCustomer, getSpecificBookingByUserId);
router.post('/bookings', authenticateJWT, isCustomer, createBookingValidation, handleValidationErrors, createBooking);
router.post('/round-bookings', authenticateJWT, isCustomer, createRoundBookingValidation, handleValidationErrors, createRoundBooking);
router.delete('/bookings/:booking_id', authenticateJWT, isCustomer, cancelBooking);

export default router;
