import express from 'express';
import { createNotice } from '../controllers/notices.controller.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/createNotice', authenticateJWT, isAdmin, createNotice);

export default router;
