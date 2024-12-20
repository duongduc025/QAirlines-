import express from 'express';
import { createPromotion, getImageByPromotionId, deletePromotionById, showAllPromotions } from '../controllers/promotions.controller.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.js';
import { promotionValidationRules } from '../validations/promotions.validation.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

router.post('/createPromotion', authenticateJWT, isAdmin, upload.single('image'), promotionValidationRules, validate, createPromotion);
router.get('/image/:id', getImageByPromotionId);
router.delete('/deletePromotion/:id', authenticateJWT, isAdmin, deletePromotionById);
router.get('/showAllPromotions', showAllPromotions);

export default router;