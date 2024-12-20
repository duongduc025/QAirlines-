import express from 'express';
import { createPromotion, getImageByPromotionId, deletePromotionById, showAllPromotions } from '../controllers/promotions.controller.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.js';
import { promotionValidationRules } from '../validations/promotions.validation.js';

const router = express.Router();

// Tạo khuyến mãi mới
router.post('/createPromotion', authenticateJWT, isAdmin, upload.single('image'), promotionValidationRules, createPromotion);

// Lấy hình ảnh khuyến mãi theo ID
router.get('/image/:id', getImageByPromotionId);

// Xóa khuyến mãi theo ID
router.delete('/deletePromotion/:id', authenticateJWT, isAdmin, deletePromotionById);

// Hiển thị tất cả các khuyến mãi
router.get('/showAllPromotions', showAllPromotions);

export default router;