import { body, query } from 'express-validator';

export const validateNewFlight = [
    body('flight_code').notEmpty().withMessage('Flight code is required'),
    body('airplane_code').notEmpty().withMessage('Airplane code is required'),
    body('ticket_price').isNumeric().withMessage('Ticket price must be a number'),
    body('departure_location').notEmpty().withMessage('Departure location is required'),
    body('destination').notEmpty().withMessage('Destination is required'),
    body('travel_time').isNumeric().withMessage('Travel time must be a number'),
    //Đầu vào cần được chuyển sang dạng: 2024-12-04T10:00:00Z
    body('arrival_time').isISO8601().toDate().withMessage('Arrival time must be a valid date'),
    body('departure_time').isISO8601().toDate().withMessage('Departure time must be a valid date'),
    body('estimated_arrival').isISO8601().toDate().withMessage('Estimated arrival must be a valid date'),
    body('economy_seats').isInt({ min: 1 }).withMessage('Economy seats must be a positive integer'),
    body('economy_price').isNumeric().withMessage('Economy price must be a number')
];

export const validateSearchFlights = [
    query('departure_location').notEmpty().withMessage('Departure location is required'),
    query('destination').notEmpty().withMessage('Destination is required'),
    //Đầu vào cần được chuyển sang dạng: 2024-12-04T10:00:00Z
    query('departure_date').isISO8601().toDate().withMessage('Departure date must be a valid date'),
    query('ticket_quantity').isInt({ min: 1 }).withMessage('Ticket quantity must be a positive integer')
];
