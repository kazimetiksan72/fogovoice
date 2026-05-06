import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/errors.js';

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export async function registerGuide({ name, email, password }) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'Email already registered');
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: 'guide' });
  return { user: user.toSafeJSON(), token: signToken(user) };
}

export async function loginUser({ email, password, role }) {
  const user = await User.findOne({ email: email.toLowerCase(), role });
  if (!user) throw new ApiError(401, 'Invalid credentials');
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, 'Invalid credentials');
  return { user: user.toSafeJSON(), token: signToken(user) };
}

export async function createAdminUser({ name, email, password }) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'Email already registered');
  const passwordHash = await bcrypt.hash(password, 12);
  return User.create({ name, email, passwordHash, role: 'admin' });
}
