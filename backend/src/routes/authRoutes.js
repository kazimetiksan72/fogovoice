import { Router } from 'express';
import { adminLogin, guideLogin, guideRegister, me } from '../controllers/authController.js';
import { auth } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimit.js';
import { authSchemas, validate } from '../utils/validators.js';

export const authRouter = Router();

authRouter.post('/guide/register', authLimiter, validate(authSchemas.guideRegister), guideRegister);
authRouter.post('/guide/login', authLimiter, validate(authSchemas.login), guideLogin);
authRouter.post('/admin/login', authLimiter, validate(authSchemas.login), adminLogin);
authRouter.get('/me', auth, me);
