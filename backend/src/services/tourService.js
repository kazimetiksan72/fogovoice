import { nanoid } from 'nanoid';
import { Announcement } from '../models/Announcement.js';
import { Tour } from '../models/Tour.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { createGuideToken, createTouristToken } from './livekitService.js';
import { sendPushToPlayers } from './oneSignalService.js';

async function generateTourCode() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = String(Math.floor(1000000 + Math.random() * 9000000));
    if (!(await Tour.exists({ tourCode: code }))) return code;
  }
  throw new ApiError(500, 'Could not generate unique tour code');
}

export const populateTour = async (id) => {
  const tour = await Tour.findById(id).populate('guideId', 'name email');
  if (!tour) throw new ApiError(404, 'Tour not found');
  return tour;
};

export async function createTour({ title, guide }) {
  logger.info('tour:create:start', { guideId: guide._id.toString(), title });
  const tourCode = await generateTourCode();
  const livekitRoomName = `tour-${tourCode}-${nanoid(8)}`;
  const tour = await Tour.create({ title, guideId: guide._id, tourCode, livekitRoomName });
  logger.info('tour:create:success', { tourId: tour._id.toString(), guideId: guide._id.toString(), tourCode });
  return populateTour(tour._id);
}

export const listMyTours = (guideId) => Tour.find({ guideId }).sort({ createdAt: -1 }).populate('guideId', 'name email');

export async function getTourForUser({ id, user }) {
  const tour = await populateTour(id);
  if (user.role === 'guide' && tour.guideId._id.toString() !== user._id.toString()) throw new ApiError(403, 'Forbidden');
  return tour;
}

export async function endTour({ id, guide }) {
  logger.info('tour:end:start', { tourId: id, guideId: guide._id.toString() });
  const tour = await Tour.findById(id);
  if (!tour) throw new ApiError(404, 'Tour not found');
  if (tour.guideId.toString() !== guide._id.toString()) throw new ApiError(403, 'Forbidden');
  if (tour.status !== 'ended') {
    tour.status = 'ended';
    tour.endedAt = new Date();
    tour.participants.forEach((p) => {
      if (p.isConnected) {
        p.isConnected = false;
        p.leftAt = new Date();
      }
    });
    await tour.save();
    await sendPushToPlayers({
      playerIds: tour.participants.map((p) => p.oneSignalPlayerId),
      title: 'Tur sona erdi',
      message: `${tour.title} turu sona erdi.`,
      data: { type: 'tour-ended', tourId: tour._id.toString() }
    });
  }
  logger.info('tour:end:success', { tourId: id, guideId: guide._id.toString() });
  return populateTour(tour._id);
}

export async function getByCode(tourCode) {
  const tour = await Tour.findOne({ tourCode }).populate('guideId', 'name email');
  if (!tour || tour.status !== 'active') throw new ApiError(404, 'Active tour not found');
  return tour;
}

export async function joinTour({ tourCode, touristName, oneSignalPlayerId }) {
  logger.info('tour:join:start', { tourCode, hasOneSignalPlayerId: Boolean(oneSignalPlayerId) });
  const tour = await getByCode(tourCode);
  const participantId = `tourist-${nanoid(12)}`;
  tour.participants.push({ participantId, name: touristName, oneSignalPlayerId, joinedAt: new Date(), isConnected: true });
  await tour.save();
  const livekitToken = await createTouristToken({ identity: participantId, name: touristName, roomName: tour.livekitRoomName });
  logger.info('tour:join:success', { tourId: tour._id.toString(), tourCode, participantId });
  return { participantId, livekitToken, livekitRoomName: tour.livekitRoomName, tour };
}

export async function leaveTour({ tourId, participantId }) {
  logger.info('tour:leave:start', { tourId, participantId });
  const tour = await Tour.findById(tourId);
  if (!tour) throw new ApiError(404, 'Tour not found');
  const participant = tour.participants.find((p) => p.participantId === participantId);
  if (!participant) throw new ApiError(404, 'Participant not found');
  participant.isConnected = false;
  participant.leftAt = new Date();
  await tour.save();
  logger.info('tour:leave:success', { tourId, participantId });
  return { participantId };
}

export async function getGuideLiveKitToken({ tourId, guide }) {
  logger.info('livekit:guide-token:start', { tourId, guideId: guide._id.toString() });
  const tour = await Tour.findById(tourId);
  if (!tour || tour.status !== 'active') throw new ApiError(404, 'Active tour not found');
  if (tour.guideId.toString() !== guide._id.toString()) throw new ApiError(403, 'Forbidden');
  const livekitToken = await createGuideToken({ identity: `guide-${guide._id}`, name: guide.name, roomName: tour.livekitRoomName });
  logger.info('livekit:guide-token:success', { tourId, guideId: guide._id.toString(), roomName: tour.livekitRoomName });
  return { livekitToken, livekitRoomName: tour.livekitRoomName };
}

export async function getTouristLiveKitToken({ tourCode, touristName }) {
  const tour = await getByCode(tourCode);
  const identity = `tourist-${nanoid(12)}`;
  const livekitToken = await createTouristToken({ identity, name: touristName, roomName: tour.livekitRoomName });
  return { identity, livekitToken, livekitRoomName: tour.livekitRoomName };
}

export async function createAnnouncement({ tourId, guide, message }) {
  logger.info('announcement:create:start', { tourId, guideId: guide._id.toString(), messageLength: message.length });
  const tour = await Tour.findById(tourId);
  if (!tour || tour.status !== 'active') throw new ApiError(404, 'Active tour not found');
  if (tour.guideId.toString() !== guide._id.toString()) throw new ApiError(403, 'Forbidden');
  const announcement = await Announcement.create({ tourId, guideId: guide._id, message });
  await sendPushToPlayers({
    playerIds: tour.participants.filter((p) => p.isConnected).map((p) => p.oneSignalPlayerId),
    title: tour.title,
    message,
    data: { type: 'announcement', tourId: tour._id.toString(), announcementId: announcement._id.toString() }
  });
  logger.info('announcement:create:success', { tourId, guideId: guide._id.toString(), announcementId: announcement._id.toString() });
  return announcement;
}

export const listAnnouncements = (tourId) => Announcement.find({ tourId }).sort({ createdAt: 1 });

export async function getAdminDashboard() {
  const [guideCount, activeTourCount, endedTourCount, participantAggregation] = await Promise.all([
    User.countDocuments({ role: 'guide' }),
    Tour.countDocuments({ status: 'active' }),
    Tour.countDocuments({ status: 'ended' }),
    Tour.aggregate([{ $project: { count: { $size: '$participants' } } }, { $group: { _id: null, total: { $sum: '$count' } } }])
  ]);
  return { guideCount, activeTourCount, endedTourCount, participantCount: participantAggregation[0]?.total || 0 };
}

export async function listGuidesForAdmin() {
  return User.aggregate([
    { $match: { role: 'guide' } },
    { $lookup: { from: 'tours', localField: '_id', foreignField: 'guideId', as: 'tours' } },
    { $project: { name: 1, email: 1, createdAt: 1, tourCount: { $size: '$tours' } } },
    { $sort: { createdAt: -1 } }
  ]);
}

export const listToursByStatus = (status) => Tour.find({ status }).sort({ createdAt: -1 }).populate('guideId', 'name email');
