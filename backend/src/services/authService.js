import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export async function registerGuide({ name, email, password }) {
  logger.info('auth:guide-register:start', { email });
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'Email already registered');
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: 'guide' });
  logger.info('auth:guide-register:success', { userId: user._id.toString(), email });
  return { user: user.toSafeJSON(), token: signToken(user) };
}

export async function loginUser({ email, password, role }) {
  logger.info('auth:login:start', { email, role });
  const user = await User.findOne({ email: email.toLowerCase(), role });
  if (!user) {
    logger.warn('auth:login:user-not-found', { email, role });
    throw new ApiError(401, 'Invalid credentials');
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    logger.warn('auth:login:invalid-password', { email, role, userId: user._id.toString() });
    throw new ApiError(401, 'Invalid credentials');
  }
  logger.info('auth:login:success', { email, role, userId: user._id.toString() });
  return { user: user.toSafeJSON(), token: signToken(user) };
}

export async function createAdminUser({ name, email, password }) {
  logger.info('auth:admin-create:start', { email });
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'Email already registered');
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: 'admin' });
  logger.info('auth:admin-create:success', { userId: user._id.toString(), email });
  return user;
}
