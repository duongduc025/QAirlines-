import express from 'express';
import { addPlane, deletePlane, showAllAirplanes } from '../controllers/airplanes.controller.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { validateAddPlane, validateDeletePlane } from '../validations/airplanes.validation.js';

const router = express.Router();

router.post('/addPlane', authenticateJWT, isAdmin, validateAddPlane, addPlane);
router.delete('/delete/:id', authenticateJWT, isAdmin, validateDeletePlane, deletePlane);
router.get('/showAll', authenticateJWT, isAdmin, showAllAirplanes);

export default router;
