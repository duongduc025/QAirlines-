import { check, validationResult } from 'express-validator';

const validateUser = [
    check('email').isEmail().withMessage('Địa chỉ email không hợp lệ'),
    check('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    check('fullname').notEmpty().withMessage('Họ và tên là bắt buộc'),
    check('phoneNumber').notEmpty().withMessage('Số điện thoại là bắt buộc'),
];

const validateUpdateUser = [
    check('newEmail').optional().isEmail().withMessage('Địa chỉ email không hợp lệ'),
    check('fullname').notEmpty().withMessage('Họ và tên là bắt buộc'),
    check('phoneNumber').notEmpty().withMessage('Số điện thoại là bắt buộc'),
];

const validateChangePassword = [
    check('currentPassword').notEmpty().withMessage('Mật khẩu hiện tại là bắt buộc'),
    check('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
    check('confirmPassword').notEmpty().withMessage('Xác nhận mật khẩu là bắt buộc'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export { validateUser, validateUpdateUser, validateChangePassword, validate };
