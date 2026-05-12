import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { adminRouter } from './routes/adminRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { livekitRouter } from './routes/livekitRoutes.js';
import { tourRouter } from './routes/tourRoutes.js';
import { logger, serializeError } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
const app = express();
const allowedOrigins = [env.clientOrigin, env.adminOrigin].filter(Boolean);

app.set('trust proxy', 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true
  })
);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(requestLogger);

app.get('/api/health', (_req, res) => res.json({ success: true, message: 'OK' }));
app.get('/api/health/db', (_req, res) => {
  const state = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.json({ success: true, state });
});
app.use('/api/auth', authRouter);
app.use('/api/tours', tourRouter);
app.use('/api/livekit', livekitRouter);
app.use('/api/admin', adminRouter);

app.use(express.static(frontendDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  return res.sendFile(path.join(frontendDist, 'index.html'), (error) => {
    if (error) next();
  });
});

app.use(notFound);
app.use(errorHandler);

connectDb()
  .then(() => app.listen(env.port, () => logger.info('server:listening', { port: env.port, nodeEnv: process.env.NODE_ENV || 'development' })))
  .catch((error) => {
    logger.error('server:start:failed', { error: serializeError(error) });
    process.exit(1);
  });
