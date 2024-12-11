import { body } from 'express-validator';

export const createBookingValidation = [
    body('flight_id').notEmpty().withMessage('ID chuyến bay là bắt buộc'),
    body('ticket_quantity').isInt({ min: 1 }).withMessage('Số lượng vé phải ít nhất là 1'),
    body('passengers').isArray({ min: 1 }).withMessage('Thông tin hành khách là bắt buộc'),
    body('passengers.*.first_name').notEmpty().withMessage('Tên là bắt buộc'),
    body('passengers.*.last_name').notEmpty().withMessage('Họ là bắt buộc'),
    body('passengers.*.email').isEmail().withMessage('Email hợp lệ là bắt buộc'),
    body('passengers.*.phone').notEmpty().withMessage('Số điện thoại là bắt buộc'),
    body('passengers.*.gender').notEmpty().withMessage('Giới tính là bắt buộc'),
    body('passengers.*.dob').isDate().withMessage('Ngày sinh hợp lệ là bắt buộc'),
    body('passengers.*.nationality').notEmpty().withMessage('Quốc tịch là bắt buộc'),
    body('passengers.*.identity_number').notEmpty().withMessage('Số CMND là bắt buộc')
];
