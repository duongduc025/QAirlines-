import { check, validationResult } from 'express-validator';

// Hàm validateUser kiểm tra thông tin người dùng khi đăng ký
const validateUser = [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('fullname').notEmpty().withMessage('Full name is required'),
    check('phoneNumber').notEmpty().withMessage('Phone number is required'),
];

// Hàm validateUpdateUser kiểm tra thông tin người dùng khi cập nhật
const validateUpdateUser = [
    check('newEmail').optional().isEmail().withMessage('Invalid email address'),
    check('fullname').notEmpty().withMessage('Full name is required'),
    check('phoneNumber').notEmpty().withMessage('Phone number is required'),
];

// Hàm validateChangePassword kiểm tra thông tin khi người dùng đổi mật khẩu
const validateChangePassword = [
    check('currentPassword').notEmpty().withMessage('Current password is required'),
    check('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    check('confirmPassword').notEmpty().withMessage('Confirm password is required'),
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
