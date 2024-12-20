import express from 'express';
import { showAllFlights, addNewFlight, searchFlights, searchRoundFlights, updateDepartureTime, deleteFlightById } from '../controllers/flights.controller.js';
import { isAdmin, isCustomer } from '../middlewares/auth.middleware.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { validateNewFlight, validateSearchFlights, validateSearchRoundFlights } from '../validations/flights.validation.js';
import { handleValidationErrors } from '../middlewares/validation.js';

const router = express.Router();

// Hiển thị tất cả các chuyến bay
router.get('/allFlights', authenticateJWT, isAdmin, showAllFlights);

// Thêm chuyến bay mới
router.post('/addFlight', authenticateJWT, isAdmin, validateNewFlight, handleValidationErrors, addNewFlight);

// Tìm kiếm chuyến bay
router.get('/search', authenticateJWT, isCustomer, validateSearchFlights, handleValidationErrors, searchFlights);

// Tìm kiếm chuyến bay khứ hồi
router.get('/searchRound', authenticateJWT, isCustomer, validateSearchRoundFlights, handleValidationErrors, searchRoundFlights);

// Cập nhật thời gian khởi hành của chuyến bay
router.put('/updateDepartureTime/:flightId', authenticateJWT, isAdmin, updateDepartureTime);

// Xóa chuyến bay theo ID
router.delete('/deleteFlight/:flightId', authenticateJWT, isAdmin, deleteFlightById);

export default router;
