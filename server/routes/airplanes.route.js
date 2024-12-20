import express from 'express';
import { addPlane, deletePlane, showAllAirplanes } from '../controllers/airplanes.controller.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { validateAddPlane, validateDeletePlane } from '../validations/airplanes.validation.js';

const router = express.Router();

// Thêm máy bay mới
router.post('/addPlane', authenticateJWT, isAdmin, validateAddPlane, addPlane);

// Xóa máy bay theo ID
router.delete('/delete/:id', authenticateJWT, isAdmin, validateDeletePlane, deletePlane);

// Hiển thị tất cả các máy bay
router.get('/showAll', authenticateJWT, isAdmin, showAllAirplanes);

export default router;
