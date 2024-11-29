import express from 'express';
import { register, login, updateUser, changePassword, addUser } from '../controllers/user.controller.js';
import { validateUser, validateUpdateUser, validateChangePassword, validate } from '../validations/user.validation.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', validateUser, validate, register);
router.post('/login', validate, login);
router.put('/update/:email', authenticateJWT, validateUpdateUser, validate, updateUser);
router.put('/change-password/:email', authenticateJWT, validateChangePassword, validate, changePassword);
router.post('/add-user', validateUser, validate, addUser);


export default router;
