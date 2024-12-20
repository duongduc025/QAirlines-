import { body, param } from 'express-validator';

export const validateAddPlane = [
  body('airplane_code').isString().notEmpty().withMessage('Airplane code is required'),
  body('model').isString().notEmpty().withMessage('Model is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('manufacture_date').isISO8601().toDate().withMessage('Manufacture date must be a valid date')
];

export const validateDeletePlane = [
  param('id').isMongoId().withMessage('Invalid airplane ID')
];
