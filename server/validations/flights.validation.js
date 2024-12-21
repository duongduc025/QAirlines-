import { body, query } from 'express-validator';

// Hàm validateNewFlight kiểm tra thông tin chuyến bay mới
export const validateNewFlight = [
    body('flight_code').notEmpty().withMessage('Flight code is required'),
    body('airplane_code').notEmpty().withMessage('Airplane code is required'),
    body('departure_location').notEmpty().withMessage('Departure location is required'),
    body('destination').notEmpty().withMessage('Destination is required'),
    body('travel_time').isNumeric().withMessage('Travel time must be a number'),
    body('departure_time').isISO8601().toDate().withMessage('Departure time must be a valid date'),
    body('economy_seats').isInt({ min: 1 }).withMessage('Economy seats must be a positive integer'),
    body('economy_price').isNumeric().withMessage('Economy price must be a number'),
];

// Hàm validateSearchFlights kiểm tra thông tin tìm kiếm chuyến bay
export const validateSearchFlights = [
    query('departure_location').notEmpty().withMessage('Departure location is required'),
    query('destination').notEmpty().withMessage('Destination is required'),
    query('departure_date').isISO8601().toDate().withMessage('Departure date must be a valid date'),
    query('ticket_quantity').isInt({ min: 1 }).withMessage('Ticket quantity must be a positive integer')
];

// Hàm validateSearchRoundFlights kiểm tra thông tin tìm kiếm chuyến bay khứ hồi
export const validateSearchRoundFlights = [
    query('departure_location').notEmpty().withMessage('Departure location is required'),
    query('destination').notEmpty().withMessage('Destination is required'),
    query('departure_date').isISO8601().toDate().withMessage('Departure date must be a valid date'),
    query('return_date').isISO8601().toDate().withMessage('Return date must be a valid date'),
    query('ticket_quantity').isInt({ min: 1 }).withMessage('Ticket quantity must be a positive integer')
];