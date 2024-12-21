import { body } from 'express-validator';

// Hàm promotionValidationRules kiểm tra thông tin khuyến mãi
export const promotionValidationRules = [
    body('title').notEmpty().withMessage('Tiêu đề là bắt buộc'),
    body('category').notEmpty().withMessage('Danh mục là bắt buộc')
        .isIn(['Khuyến mãi', 'Giới thiệu', 'Tin tức', 'Thông báo']).withMessage('Danh mục không hợp lệ'),
    body('brief').notEmpty().withMessage('Tóm tắt là bắt buộc'),
    body('mark').notEmpty().withMessage('Đánh dấu là bắt buộc'),
    body('content').notEmpty().withMessage('Nội dung là bắt buộc'),
    body('image').optional().isString().withMessage('Hình ảnh phải là chuỗi')
];
