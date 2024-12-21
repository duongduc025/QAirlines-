import { body } from 'express-validator';

// Hàm promotionValidationRules kiểm tra thông tin khuyến mãi
export const promotionValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('category').notEmpty().withMessage('Category is required')
        .isIn(['Khuyến mãi', 'Giới thiệu', 'Tin tức', 'Thông báo']).withMessage('Invalid category'),
    body('brief').notEmpty().withMessage('Brief is required'),
    body('mark').notEmpty().withMessage('Mark is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('image').optional().isString().withMessage('Image must be a string')
];
