import express from 'express';
import { register, login, updateUser, changePassword, addUser, loginWithToken, listAllUserBookingInPeriod, getDelayNotices, updateDelayNotices } from '../controllers/user.controller.js';
import { validateUser, validateUpdateUser, validateChangePassword, validate } from '../validations/user.validation.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin, isCustomer } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', validateUser, validate, register);
router.post('/login', validate, login);
router.put('/update/:_id', authenticateJWT, validateUpdateUser, validate, updateUser);
router.put('/change-password/:_id', authenticateJWT, validateChangePassword, validate, changePassword);
router.post('/add-user', addUser);
router.post('/loginWithToken', validate, loginWithToken);
router.get('/listAllUserBookingInPeriod', authenticateJWT, isAdmin, listAllUserBookingInPeriod);
router.get('/delayNotices/:userId', authenticateJWT, isCustomer, getDelayNotices);
router.put('/updateDelayNotices/:userId', authenticateJWT, isCustomer, updateDelayNotices);

export default router;
