import express from 'express';
import { createNotice, getImageByNoticeId, deleteNoticeById } from '../controllers/notices.controller.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.js';
import { validateCreateNotice, validate } from '../validations/notices.validation.js';

const router = express.Router();

router.post('/createNotice', authenticateJWT, isAdmin, upload.single('image'), validateCreateNotice, validate, createNotice);
router.get('/image/:id', getImageByNoticeId);
router.delete('/deleteNotice/:id', authenticateJWT, isAdmin, deleteNoticeById);

export default router;