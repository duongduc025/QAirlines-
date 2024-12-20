import express from 'express';
import { getBookingByUserId, getSpecificBookingById, createBooking, createRoundBooking, listAllBookings, cancelBooking } from '../controllers/booking.controller.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin, isCustomer } from '../middlewares/auth.middleware.js';
import { createBookingValidation, createRoundBookingValidation } from '../validations/booking.validation.js';
import { handleValidationErrors } from '../middlewares/validation.js';

const router = express.Router();

// Liệt kê tất cả các đặt chỗ
router.get('/bookingslist', authenticateJWT, isAdmin, listAllBookings);

// Lấy danh sách đặt chỗ của người dùng theo ID
router.get('/users/:_id/bookings', authenticateJWT, isCustomer, getBookingByUserId);

// Lấy thông tin đặt chỗ cụ thể theo ID
router.get('/:booking_id', getSpecificBookingById);

// Tạo đặt chỗ mới
router.post('/bookings', authenticateJWT, isCustomer, createBookingValidation, handleValidationErrors, createBooking);

// Tạo đặt chỗ khứ hồi
router.post('/round-bookings', authenticateJWT, isCustomer, createRoundBookingValidation, handleValidationErrors, createRoundBooking);

// Hủy đặt chỗ theo ID
router.delete('/bookings/:booking_id', authenticateJWT, isCustomer, cancelBooking);

export default router;
