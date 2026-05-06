import { Router } from 'express';
import { z } from 'zod';
import { guideToken, touristToken } from '../controllers/tourController.js';
import { auth, requireRole } from '../middlewares/auth.js';
import { validate } from '../utils/validators.js';

export const livekitRouter = Router();

livekitRouter.post('/guide-token', auth, requireRole('guide'), validate(z.object({ body: z.object({ tourId: z.string().min(1) }) })), guideToken);
livekitRouter.post('/tourist-token', validate(z.object({ body: z.object({ tourCode: z.string().regex(/^\d{7}$/), touristName: z.string().min(2).max(80) }) })), touristToken);
