import express from 'express';
import { showAllFlights, addNewFlight, searchFlights, updateDepartureTime } from '../controllers/flights.controller.js';
import { isAdmin, isCustomer } from '../middlewares/auth.middleware.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';

const router = express.Router();

// ...existing code...

router.get('/allFlights', authenticateJWT, isAdmin, showAllFlights);
router.post('/addFlight', authenticateJWT, isAdmin, addNewFlight);
router.get('/search', authenticateJWT, isCustomer, searchFlights);
router.patch('/updateDepartureTime/:flightId', authenticateJWT, isAdmin, updateDepartureTime);

// ...existing code...

export default router;
