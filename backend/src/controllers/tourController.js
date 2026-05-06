import {
  createAnnouncement,
  createTour,
  endTour,
  getByCode,
  getGuideLiveKitToken,
  getTourForUser,
  getTouristLiveKitToken,
  joinTour,
  leaveTour,
  listAnnouncements,
  listMyTours
} from '../services/tourService.js';
import { created, ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/errors.js';

export const create = asyncHandler(async (req, res) => created(res, { tour: await createTour({ title: req.body.title, guide: req.user }) }, 'Tour created'));
export const myTours = asyncHandler(async (req, res) => ok(res, { tours: await listMyTours(req.user._id) }));
export const detail = asyncHandler(async (req, res) => ok(res, { tour: await getTourForUser({ id: req.params.id, user: req.user }) }));
export const end = asyncHandler(async (req, res) => ok(res, { tour: await endTour({ id: req.params.id, guide: req.user }) }, 'Tour ended'));
export const byCode = asyncHandler(async (req, res) => {
  const tour = await getByCode(req.params.tourCode);
  ok(res, { tour: { id: tour._id, _id: tour._id, title: tour.title, tourCode: tour.tourCode, status: tour.status, guide: tour.guideId } });
});
export const join = asyncHandler(async (req, res) => created(res, await joinTour(req.body), 'Joined tour'));
export const leave = asyncHandler(async (req, res) => ok(res, await leaveTour({ tourId: req.params.id, participantId: req.body.participantId }), 'Left tour'));
export const guideToken = asyncHandler(async (req, res) => ok(res, await getGuideLiveKitToken({ tourId: req.body.tourId, guide: req.user })));
export const touristToken = asyncHandler(async (req, res) => ok(res, await getTouristLiveKitToken(req.body)));
export const addAnnouncement = asyncHandler(async (req, res) => created(res, { announcement: await createAnnouncement({ tourId: req.params.id, guide: req.user, message: req.body.message }) }, 'Announcement created'));
export const announcements = asyncHandler(async (req, res) => ok(res, { announcements: await listAnnouncements(req.params.id) }));
