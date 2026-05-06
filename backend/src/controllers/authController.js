import { loginUser, registerGuide } from '../services/authService.js';
import { created, ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/errors.js';

export const guideRegister = asyncHandler(async (req, res) => created(res, await registerGuide(req.body), 'Guide registered'));
export const guideLogin = asyncHandler(async (req, res) => ok(res, await loginUser({ ...req.body, role: 'guide' }), 'Guide logged in'));
export const adminLogin = asyncHandler(async (req, res) => ok(res, await loginUser({ ...req.body, role: 'admin' }), 'Admin logged in'));
export const me = asyncHandler(async (req, res) => ok(res, { user: req.user.toSafeJSON() }));
