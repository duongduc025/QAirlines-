import express from 'express';
import { searchFlights, addFlight } from '../controllers/flights.controller.js';

const router = express.Router();

router.post('/searchFlights', searchFlights);
router.post('/addFlight', addFlight);

export default router;
