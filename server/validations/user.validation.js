import { check, validationResult } from 'express-validator';

const validateUser = [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('fullname').notEmpty().withMessage('Full name is required'),
    check('phoneNumber').notEmpty().withMessage('Phone number is required'),
    check('role').notEmpty().withMessage('Role is required').isIn(['user', 'admin']).withMessage('Invalid role')
];

const validateUpdateUser = [
    check('newEmail').optional().isEmail().withMessage('Invalid email address'),
    check('fullname').notEmpty().withMessage('Full name is required'),
    check('phoneNumber').notEmpty().withMessage('Phone number is required'),
    check('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
];

const validateChangePassword = [
    check('currentPassword').notEmpty().withMessage('Current password is required'),
    check('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    check('confirmPassword').notEmpty().withMessage('Confirm password is required'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
    }
    next(); 
};

export { validateUser, validateUpdateUser, validateChangePassword, validate };
