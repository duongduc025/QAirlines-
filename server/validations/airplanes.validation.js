import { body, param } from 'express-validator';

// Hàm validateAddPlane kiểm tra thông tin thêm máy bay
export const validateAddPlane = [
  body('airplane_code').isString().notEmpty().withMessage('Airplane code is required'),
  body('model').isString().notEmpty().withMessage('Model is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('manufacture_date').isISO8601().toDate().withMessage('Manufacture date must be a valid date')
];

// Hàm validateDeletePlane kiểm tra thông tin xóa máy bay
export const validateDeletePlane = [
  param('id').isMongoId().withMessage('Invalid airplane ID')
];
