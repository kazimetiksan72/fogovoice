import { Router } from 'express';
import { activeTours, dashboard, guides, historyTours, tourDetail } from '../controllers/adminController.js';
import { auth, requireRole } from '../middlewares/auth.js';
import { tourSchemas, validate } from '../utils/validators.js';

export const adminRouter = Router();

adminRouter.use(auth, requireRole('admin'));
adminRouter.get('/dashboard', dashboard);
adminRouter.get('/guides', guides);
adminRouter.get('/tours/active', activeTours);
adminRouter.get('/tours/history', historyTours);
adminRouter.get('/tours/:id', validate(tourSchemas.id), tourDetail);
