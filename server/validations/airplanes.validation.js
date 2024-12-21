import { body, param } from 'express-validator';

// Hàm validateAddPlane kiểm tra thông tin thêm máy bay
export const validateAddPlane = [
  body('airplane_code').isString().notEmpty().withMessage('Mã máy bay là bắt buộc'),
  body('model').isString().notEmpty().withMessage('Mẫu máy bay là bắt buộc'),
  body('capacity').isInt({ min: 1 }).withMessage('Sức chứa phải là số nguyên dương'),
  body('manufacture_date').isISO8601().toDate().withMessage('Ngày sản xuất phải là ngày hợp lệ')
];

// Hàm validateDeletePlane kiểm tra thông tin xóa máy bay
export const validateDeletePlane = [
  param('id').isMongoId().withMessage('ID máy bay không hợp lệ')
];
