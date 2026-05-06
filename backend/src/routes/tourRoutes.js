import { Router } from 'express';
import { addAnnouncement, announcements, byCode, create, detail, end, join, leave, myTours } from '../controllers/tourController.js';
import { auth, requireRole } from '../middlewares/auth.js';
import { tourCodeLimiter } from '../middlewares/rateLimit.js';
import { tourSchemas, validate } from '../utils/validators.js';

export const tourRouter = Router();

tourRouter.post('/', auth, requireRole('guide'), validate(tourSchemas.create), create);
tourRouter.get('/my', auth, requireRole('guide'), myTours);
tourRouter.get('/code/:tourCode', tourCodeLimiter, validate(tourSchemas.code), byCode);
tourRouter.post('/join', tourCodeLimiter, validate(tourSchemas.join), join);
tourRouter.get('/:id', auth, requireRole('guide', 'admin'), validate(tourSchemas.id), detail);
tourRouter.post('/:id/end', auth, requireRole('guide'), validate(tourSchemas.id), end);
tourRouter.post('/:id/leave', validate(tourSchemas.leave), leave);
tourRouter.post('/:id/announcements', auth, requireRole('guide'), validate(tourSchemas.announcement), addAnnouncement);
tourRouter.get('/:id/announcements', validate(tourSchemas.id), announcements);
