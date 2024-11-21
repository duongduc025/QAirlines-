import express from 'express';
import { register, login } from '../controllers/user.controller.js';
import { validateUser, validate } from '../validations/user.validation.js';

const router = express.Router();

// ...existing code...
router.post('/register', validateUser, validate, register);
router.post('/login', validate, login);
// ...existing code...

export default router;
