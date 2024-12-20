import { check, validationResult } from 'express-validator';

const validateCreateNotice = [
    check('title').notEmpty().withMessage('Title is required'),
    check('category').isIn(['Khuyến mãi', 'Giới thiệu', 'Tin tức', 'Thông báo']).withMessage('Invalid category'),
    check('brief').notEmpty().withMessage('Brief is required'),
    check('mark').notEmpty().withMessage('Mark is required'),
    check('content').notEmpty().withMessage('Content is required'),
    check('image').notEmpty().withMessage('Image is required')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export { validateCreateNotice, validate };
