import express from 'express';
import { getBookingsByUserEmail, getSpecificBookingByUserEmail } from '../controllers/booking.controller.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';

const router = express.Router();

// ...existing code...

router.get('/users/:email/bookings', authenticateJWT, getBookingsByUserEmail);
router.get('/users/:email/bookings/:booking_id', authenticateJWT, getSpecificBookingByUserEmail);

export default router;
