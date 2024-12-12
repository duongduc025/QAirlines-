import express from 'express';
import { addPlane, deletePlane } from '../controllers/airplanes.controller.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';

const router = express.Router();

router.post('/addPlane', authenticateJWT,isAdmin, addPlane);
router.delete('/delete/:id', authenticateJWT,isAdmin, deletePlane);

export default router;
