import { body, query } from 'express-validator';

// Hàm validateNewFlight kiểm tra thông tin chuyến bay mới
export const validateNewFlight = [
    body('flight_code').notEmpty().withMessage('Mã chuyến bay là bắt buộc'),
    body('airplane_code').notEmpty().withMessage('Mã máy bay là bắt buộc'),
    body('departure_location').notEmpty().withMessage('Điểm khởi hành là bắt buộc'),
    body('destination').notEmpty().withMessage('Điểm đến là bắt buộc'),
    body('travel_time').isNumeric().withMessage('Thời gian bay phải là số'),
    body('departure_time').isISO8601().toDate().withMessage('Thời gian khởi hành phải là ngày hợp lệ'),
    body('economy_seats').isInt({ min: 1 }).withMessage('Số ghế hạng phổ thông phải là số nguyên dương'),
    body('economy_price').isNumeric().withMessage('Giá vé hạng phổ thông phải là số'),
];

// Hàm validateSearchFlights kiểm tra thông tin tìm kiếm chuyến bay
export const validateSearchFlights = [
    query('departure_location').notEmpty().withMessage('Điểm khởi hành là bắt buộc'),
    query('destination').notEmpty().withMessage('Điểm đến là bắt buộc'),
    query('departure_date').isISO8601().toDate().withMessage('Ngày khởi hành phải là ngày hợp lệ'),
    query('ticket_quantity').isInt({ min: 1 }).withMessage('Số lượng vé phải là số nguyên dương')
];

// Hàm validateSearchRoundFlights kiểm tra thông tin tìm kiếm chuyến bay khứ hồi
export const validateSearchRoundFlights = [
    query('departure_location').notEmpty().withMessage('Điểm khởi hành là bắt buộc'),
    query('destination').notEmpty().withMessage('Điểm đến là bắt buộc'),
    query('departure_date').isISO8601().toDate().withMessage('Ngày khởi hành phải là ngày hợp lệ'),
    query('return_date').isISO8601().toDate().withMessage('Ngày trở về phải là ngày hợp lệ'),
    query('ticket_quantity').isInt({ min: 1 }).withMessage('Số lượng vé phải là số nguyên dương')
];