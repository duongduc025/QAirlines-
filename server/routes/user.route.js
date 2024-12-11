import express from 'express';
import multer from 'multer';
import { register, login, updateUser, changePassword, addUser, loginWithToken, listAllUserBookingInPeriod } from '../controllers/user.controller.js';
import { validateUser, validateUpdateUser, validateChangePassword, validate } from '../validations/user.validation.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'src/uploads/avatars');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/register', upload.single('avatar'), validateUser, validate, register);
router.post('/login', validate, login);
router.put('/update/:_id', authenticateJWT, validateUpdateUser, validate, updateUser);
router.put('/change-password/:_id', authenticateJWT, validateChangePassword, validate, changePassword);
router.post('/add-user', validateUser, validate, addUser);
router.post('/loginWithToken', validate, loginWithToken);
router.get('/listAllUserBookingInPeriod', authenticateJWT, isAdmin, listAllUserBookingInPeriod);

export default router;
