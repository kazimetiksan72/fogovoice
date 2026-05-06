import { getAdminDashboard, getTourForUser, listGuidesForAdmin, listToursByStatus } from '../services/tourService.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/errors.js';

export const dashboard = asyncHandler(async (_req, res) => ok(res, { stats: await getAdminDashboard() }));
export const guides = asyncHandler(async (_req, res) => ok(res, { guides: await listGuidesForAdmin() }));
export const activeTours = asyncHandler(async (_req, res) => ok(res, { tours: await listToursByStatus('active') }));
export const historyTours = asyncHandler(async (_req, res) => ok(res, { tours: await listToursByStatus('ended') }));
export const tourDetail = asyncHandler(async (req, res) => ok(res, { tour: await getTourForUser({ id: req.params.id, user: req.user }) }));
