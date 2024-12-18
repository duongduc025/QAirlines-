import express from 'express';
import { register, login, updateUser, changePassword, addUser, loginWithToken, listAllUserBookingInPeriod, getDelayNotices } from '../controllers/user.controller.js';
import { validateUser, validateUpdateUser, validateChangePassword, validate } from '../validations/user.validation.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', validateUser, validate, register);
router.post('/login', validate, login);
router.put('/update/:_id', authenticateJWT, validateUpdateUser, validate, updateUser);
router.put('/change-password/:_id', authenticateJWT, validateChangePassword, validate, changePassword);
router.post('/add-user', validateUser, validate, addUser);
router.post('/loginWithToken', validate, loginWithToken);
router.get('/listAllUserBookingInPeriod', authenticateJWT, isAdmin, listAllUserBookingInPeriod);
router.get('/delayNotices/:userId', authenticateJWT, getDelayNotices);

export default router;
