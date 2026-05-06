import { AccessToken } from 'livekit-server-sdk';
import { env } from '../config/env.js';
import { ApiError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

function ensureLiveKitConfigured() {
  if (!env.livekitApiKey || !env.livekitApiSecret) throw new ApiError(500, 'LiveKit credentials are not configured');
}

export async function createGuideToken({ identity, name, roomName }) {
  ensureLiveKitConfigured();
  logger.info('livekit:create-guide-token', { identity, roomName });
  const token = new AccessToken(env.livekitApiKey, env.livekitApiSecret, { identity, name, ttl: '6h' });
  token.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true, canPublishData: true });
  return token.toJwt();
}

export async function createTouristToken({ identity, name, roomName }) {
  ensureLiveKitConfigured();
  logger.info('livekit:create-tourist-token', { identity, roomName });
  const token = new AccessToken(env.livekitApiKey, env.livekitApiSecret, { identity, name, ttl: '6h' });
  token.addGrant({ roomJoin: true, room: roomName, canPublish: false, canSubscribe: true, canPublishData: false });
  return token.toJwt();
}
