import { body } from 'express-validator';

export const createBookingValidation = [
    body('flight_id').notEmpty().withMessage('Flight ID is required'),
    body('ticket_quantity').isInt({ min: 1 }).withMessage('Ticket quantity must be at least 1'),
    body('passengers').isArray({ min: 1 }).withMessage('Passengers information is required'),
    body('passengers.*.fullname').notEmpty().withMessage('Fullname is required'),
    body('passengers.*.email').isEmail().withMessage('Valid email is required'),
    body('passengers.*.phone').notEmpty().withMessage('Phone number is required'),
    body('passengers.*.gender').notEmpty().withMessage('Gender is required'),
    body('passengers.*.dob').isDate().withMessage('Valid date of birth is required'),
    body('passengers.*.nationality').notEmpty().withMessage('Nationality is required'),
    body('passengers.*.identity_number').notEmpty().withMessage('Identity number is required')
];
