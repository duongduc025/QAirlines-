import express from 'express';
import { register, login, updateUser, changePassword, addUser, loginWithToken, listAllUserBookingInPeriod, getDelayNotices, updateDelayNotices } from '../controllers/user.controller.js';
import { validateUser, validateUpdateUser, validateChangePassword, validate } from '../validations/user.validation.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin, isCustomer } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Đăng ký người dùng mới
router.post('/register', validateUser, validate, register);

// Đăng nhập người dùng
router.post('/login', validate, login);

// Cập nhật thông tin người dùng
router.put('/update/:_id', authenticateJWT, validateUpdateUser, validate, updateUser);

// Thay đổi mật khẩu người dùng
router.put('/change-password/:_id', authenticateJWT, validateChangePassword, validate, changePassword);

// Thêm người dùng mới
router.post('/add-user', addUser);

// Đăng nhập bằng token
router.post('/loginWithToken', validate, loginWithToken);

// Liệt kê tất cả các đặt chỗ của người dùng trong một khoảng thời gian
router.get('/listAllUserBookingInPeriod', authenticateJWT, isAdmin, listAllUserBookingInPeriod);

// Lấy thông báo trễ của người dùng
router.get('/delayNotices/:userId', authenticateJWT, isCustomer, getDelayNotices);

// Cập nhật thông báo trễ của người dùng
router.put('/updateDelayNotices/:userId', authenticateJWT, isCustomer, updateDelayNotices);

export default router;
