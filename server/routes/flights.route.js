import express from 'express';
import { searchFlights, addFlight, flightsAll } from '../controllers/flights.controller.js';

const router = express.Router();

router.post('/searchFlights', searchFlights);
router.post('/addFlight', addFlight);
router.get('/flightsAll', flightsAll);

export default router;
