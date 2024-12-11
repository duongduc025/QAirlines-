import express from 'express';
import { createNotice, getImageByNoticeId } from '../controllers/notices.controller.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/createNotice', authenticateJWT, isAdmin, upload.single('image'), createNotice);
router.get('/image/:id', getImageByNoticeId);

export default router;