import { body } from 'express-validator';

// Hàm createBookingValidation kiểm tra thông tin đặt vé
export const createBookingValidation = [
    body('flight_id').notEmpty().withMessage('Flight ID is required'),
    body('ticket_quantity').isInt({ min: 1 }).withMessage('Ticket quantity must be at least 1'),
    body('passengers').isArray({ min: 1 }).withMessage('Passengers information is required'),
    body('passengers.*.fullname').notEmpty().withMessage('Fullname is required'),
    body('passengers.*.gender').notEmpty().withMessage('Gender is required'),
    body('passengers.*.dob').isDate().withMessage('Valid date of birth is required'),
    body('passengers.*.identity_number').notEmpty().withMessage('Identity number is required'),
];

// Hàm createRoundBookingValidation kiểm tra thông tin đặt vé khứ hồi
export const createRoundBookingValidation = [
    body('outbound_flight_id').notEmpty().withMessage('Outbound flight ID is required'),
    body('return_flight_id').notEmpty().withMessage('Return flight ID is required'),
    body('ticket_quantity').isInt({ min: 1 }).withMessage('Ticket quantity must be at least 1'),
    body('passengers').isArray({ min: 1 }).withMessage('Passengers information is required'),
    body('passengers.*.fullname').notEmpty().withMessage('Fullname is required'),
    body('passengers.*.gender').notEmpty().withMessage('Gender is required'),
    body('passengers.*.dob').isDate().withMessage('Valid date of birth is required'),
    body('passengers.*.identity_number').notEmpty().withMessage('Identity number is required'),
];
