import express from 'express';
import { addPlane, deletePlane, showAllAirplanes } from '../controllers/airplanes.controller.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';

const router = express.Router();

router.post('/addPlane', authenticateJWT,isAdmin, addPlane);
router.delete('/delete/:id', authenticateJWT,isAdmin, deletePlane);
router.get('/showAll', authenticateJWT, isAdmin, showAllAirplanes);

export default router;
