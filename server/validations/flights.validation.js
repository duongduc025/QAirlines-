import { body } from 'express-validator';

export const validateFlight = [
  body('airplane_id').notEmpty().withMessage('Airplane ID is required'),
  body('departure_location').notEmpty().withMessage('Departure location is required'),
  body('destination_location').notEmpty().withMessage('Destination location is required'),
  body('travel_time').isISO8601().toDate().withMessage('Travel time must be a valid date'),
  body('arrival_time').isISO8601().toDate().withMessage('Arrival time must be a valid date'),
  body('normal_seats').isInt({ min: 0 }).withMessage('Normal seats must be a non-negative integer'),
  body('economy_seats').isInt({ min: 0 }).withMessage('Economy seats must be a non-negative integer'),
  body('normal_ticket_price').isFloat({ min: 0 }).withMessage('Normal ticket price must be a non-negative number'),
  body('economy_ticket_price').isFloat({ min: 0 }).withMessage('Economy ticket price must be a non-negative number')
];
