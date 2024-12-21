import { body } from 'express-validator';

// Hàm createBookingValidation kiểm tra thông tin đặt vé
export const createBookingValidation = [
    body('flight_id').notEmpty().withMessage('Mã chuyến bay là bắt buộc'),
    body('ticket_quantity').isInt({ min: 1 }).withMessage('Số lượng vé phải ít nhất là 1'),
    body('passengers').isArray({ min: 1 }).withMessage('Thông tin hành khách là bắt buộc'),
    body('passengers.*.fullname').notEmpty().withMessage('Họ và tên là bắt buộc'),
    body('passengers.*.gender').notEmpty().withMessage('Giới tính là bắt buộc'),
    body('passengers.*.dob').isDate().withMessage('Ngày sinh hợp lệ là bắt buộc'),
    body('passengers.*.identity_number').notEmpty().withMessage('Số CMND là bắt buộc'),
];

// Hàm createRoundBookingValidation kiểm tra thông tin đặt vé khứ hồi
export const createRoundBookingValidation = [
    body('outbound_flight_id').notEmpty().withMessage('Mã chuyến bay đi là bắt buộc'),
    body('return_flight_id').notEmpty().withMessage('Mã chuyến bay về là bắt buộc'),
    body('ticket_quantity').isInt({ min: 1 }).withMessage('Số lượng vé phải ít nhất là 1'),
    body('passengers').isArray({ min: 1 }).withMessage('Thông tin hành khách là bắt buộc'),
    body('passengers.*.fullname').notEmpty().withMessage('Họ và tên là bắt buộc'),
    body('passengers.*.gender').notEmpty().withMessage('Giới tính là bắt buộc'),
    body('passengers.*.dob').isDate().withMessage('Ngày sinh hợp lệ là bắt buộc'),
    body('passengers.*.identity_number').notEmpty().withMessage('Số CMND là bắt buộc'),
];
