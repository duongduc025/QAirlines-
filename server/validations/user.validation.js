import { check, validationResult } from 'express-validator';

// Hàm validateUser kiểm tra thông tin người dùng khi đăng ký
const validateUser = [
    check('email').isEmail().withMessage('Địa chỉ email không hợp lệ'),
    check('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    check('fullname').notEmpty().withMessage('Họ và tên là bắt buộc'),
    check('phoneNumber').notEmpty().withMessage('Số điện thoại là bắt buộc'),
    check('role').notEmpty().withMessage('Vai trò là bắt buộc').isIn(['user', 'admin']).withMessage('Vai trò không hợp lệ')
];

// Hàm validateUpdateUser kiểm tra thông tin người dùng khi cập nhật
const validateUpdateUser = [
    check('newEmail').optional().isEmail().withMessage('Địa chỉ email không hợp lệ'),
    check('fullname').notEmpty().withMessage('Họ và tên là bắt buộc'),
    check('phoneNumber').notEmpty().withMessage('Số điện thoại là bắt buộc'),
    check('role').optional().isIn(['user', 'admin']).withMessage('Vai trò không hợp lệ')
];

// Hàm validateChangePassword kiểm tra thông tin khi người dùng đổi mật khẩu
const validateChangePassword = [
    check('currentPassword').notEmpty().withMessage('Mật khẩu hiện tại là bắt buộc'),
    check('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
    check('confirmPassword').notEmpty().withMessage('Xác nhận mật khẩu là bắt buộc'),
];

// Hàm validate kiểm tra kết quả của các hàm kiểm tra trên
const validate = (req, res, next) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
    }
    next(); 
};

export { validateUser, validateUpdateUser, validateChangePassword, validate };
