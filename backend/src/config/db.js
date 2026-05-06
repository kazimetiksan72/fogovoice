import mongoose from 'mongoose';
import { env } from './env.js';
import { logger, serializeError } from '../utils/logger.js';

function getMongoHost(uri) {
  if (!uri) return undefined;
  const withoutProtocol = uri.replace(/^mongodb(\+srv)?:\/\//, '');
  const withoutCredentials = withoutProtocol.includes('@') ? withoutProtocol.split('@').slice(1).join('@') : withoutProtocol;
  return withoutCredentials.split('/')[0];
}

export async function connectDb() {
  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);

  mongoose.connection.on('connected', () => logger.info('mongo:connected'));
  mongoose.connection.on('disconnected', () => logger.warn('mongo:disconnected'));
  mongoose.connection.on('reconnected', () => logger.info('mongo:reconnected'));
  mongoose.connection.on('error', (error) => logger.error('mongo:error', { error: serializeError(error) }));

  logger.info('mongo:connect:start', {
    hasUri: Boolean(env.mongodbUri),
    dbHost: getMongoHost(env.mongodbUri)
  });

  try {
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });
    logger.info('mongo:connect:success', { readyState: mongoose.connection.readyState });
  } catch (error) {
    logger.error('mongo:connect:failed', { error: serializeError(error) });
    throw error;
  }
}


/// hop
