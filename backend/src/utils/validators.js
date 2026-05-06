import { z } from 'zod';
import { ApiError } from './errors.js';

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
    if (!result.success) {
      return next(new ApiError(400, result.error.issues.map((issue) => issue.message).join(', ')));
    }
    req.validated = result.data;
    next();
  };
}

export const authSchemas = {
  guideRegister: z.object({
    body: z.object({ name: z.string().min(2).max(80), email: z.string().email(), password: z.string().min(6).max(128) })
  }),
  login: z.object({
    body: z.object({ email: z.string().email(), password: z.string().min(6).max(128) })
  })
};

export const tourSchemas = {
  create: z.object({ body: z.object({ title: z.string().min(2).max(120) }) }),
  id: z.object({ params: z.object({ id: z.string().min(1) }) }),
  code: z.object({ params: z.object({ tourCode: z.string().regex(/^\d{7}$/) }) }),
  join: z.object({
    body: z.object({
      tourCode: z.string().regex(/^\d{7}$/),
      touristName: z.string().min(2).max(80),
      oneSignalPlayerId: z.string().optional().nullable()
    })
  }),
  leave: z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({ participantId: z.string().min(1) })
  }),
  announcement: z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({ message: z.string().min(1).max(500) })
  })
};
