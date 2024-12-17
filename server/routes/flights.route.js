import express from 'express';
import { showAllFlights, addNewFlight, searchFlights, searchRoundFlights, updateDepartureTime, deleteFlightById } from '../controllers/flights.controller.js';
import { isAdmin, isCustomer } from '../middlewares/auth.middleware.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { validateNewFlight, validateSearchFlights, validateSearchRoundFlights } from '../validations/flights.validation.js';
import { handleValidationErrors } from '../middlewares/validation.js';

const router = express.Router();

// ...existing code...

router.get('/allFlights', authenticateJWT, isAdmin, showAllFlights);
router.post('/addFlight', authenticateJWT, isAdmin, validateNewFlight, handleValidationErrors, addNewFlight);
router.get('/search', authenticateJWT, isCustomer, validateSearchFlights, handleValidationErrors, searchFlights);
router.get('/searchRound', validateSearchRoundFlights, handleValidationErrors, searchRoundFlights);
router.put('/updateDepartureTime/:flightId', authenticateJWT, isAdmin, updateDepartureTime);
router.delete('/deleteFlight/:flightId', authenticateJWT, isAdmin, deleteFlightById);

// ...existing code...

export default router;
