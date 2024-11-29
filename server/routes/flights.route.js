import express from 'express';
import { showAllFlights, addNewFlight, searchFlights } from '../controllers/flights.controller.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';

const router = express.Router();

// ...existing code...

router.get('/allFlights', showAllFlights);
router.post('/addFlight', authenticateJWT, addNewFlight);
router.get('/search', searchFlights);

// ...existing code...

export default router;
