import { body } from 'express-validator';

export const bookingValidation = [
  body('user_id').isMongoId(),
  body('flight_id').isMongoId(),
  body('tickets').isArray(),
  body('tickets.*.seat_class').isIn(['normal', 'economy']),
  body('tickets.*.ticket_price').isFloat({ min: 0 }),
  body('tickets.*.ticket_quantity').isInt({ min: 1 })
];
