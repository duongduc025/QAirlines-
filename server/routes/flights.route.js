import express from 'express';
import { searchFlights, addFlight, flightsAll, flightsDelete, flightsDetail } from '../controllers/flights.controller.js';
import { validateFlight } from '../validations/flights.validation.js';

const router = express.Router();

router.post('/searchFlights', searchFlights);
router.post('/addFlight', validateFlight, addFlight);
router.get('/flightsAll', flightsAll);
router.delete('/flightsDelete/:id', flightsDelete);
router.get('/flightsDetail/:id', flightsDetail);

export default router;
