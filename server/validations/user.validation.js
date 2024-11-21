import { check, validationResult } from 'express-validator';

const validateUser = [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('fullname').notEmpty().withMessage('Full name is required'),
    check('phoneNumber').notEmpty().withMessage('Phone number is required'),
    check('role').notEmpty().withMessage('Role is required'),
    check('user_type').notEmpty().withMessage('User type is required'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export { validateUser, validate };
