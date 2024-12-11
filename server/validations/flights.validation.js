import { body, query } from 'express-validator';

export const validateNewFlight = [
    body('flight_code').notEmpty().withMessage('Mã chuyến bay là bắt buộc'),
    body('airplane_code').notEmpty().withMessage('Mã máy bay là bắt buộc'),
    body('ticket_price').isNumeric().withMessage('Giá vé phải là một số'),
    body('departure_location').notEmpty().withMessage('Địa điểm khởi hành là bắt buộc'),
    body('destination').notEmpty().withMessage('Điểm đến là bắt buộc'),
    body('travel_time').isNumeric().withMessage('Thời gian di chuyển phải là một số'),
    body('arrival_time').isISO8601().toDate().withMessage('Thời gian đến phải là một ngày hợp lệ'),
    body('departure_time').isISO8601().toDate().withMessage('Thời gian khởi hành phải là một ngày hợp lệ'),
    body('estimated_arrival').isISO8601().toDate().withMessage('Thời gian đến dự kiến phải là một ngày hợp lệ'),
    body('economy_seats').isInt({ min: 1 }).withMessage('Số ghế hạng phổ thông phải là một số nguyên dương'),
    body('economy_price').isNumeric().withMessage('Giá vé hạng phổ thông phải là một số')
];

export const validateSearchFlights = [
    query('departure_location').notEmpty().withMessage('Địa điểm khởi hành là bắt buộc'),
    query('destination').notEmpty().withMessage('Điểm đến là bắt buộc'),
    query('departure_date').isISO8601().toDate().withMessage('Ngày khởi hành phải là một ngày hợp lệ'),
    query('ticket_quantity').isInt({ min: 1 }).withMessage('Số lượng vé phải là một số nguyên dương')
];
