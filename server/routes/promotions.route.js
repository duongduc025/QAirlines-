import express from 'express';
import { createPromotion } from '../controllers/promotions.controller.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';

const router = express.Router();

// Example endpoint for creating a promotion
router.post('/createPromotion', authenticateJWT, isAdmin,createPromotion);

export default router;