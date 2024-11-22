import express from 'express';
import { createBooking } from '../controllers/booking.controller.js';
import { bookingValidation } from '../validations/booking.validation.js'; // Import validation

const router = express.Router();

router.post('/book', bookingValidation, createBooking); // Use validation

export default router;
