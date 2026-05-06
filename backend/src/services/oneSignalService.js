import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export async function sendPushToPlayers({ playerIds, title, message, data = {} }) {
  const ids = [...new Set((playerIds || []).filter(Boolean))];
  if (!ids.length || !env.oneSignalAppId || !env.oneSignalRestApiKey) {
    logger.info('onesignal:send:skipped', {
      recipients: ids.length,
      configured: Boolean(env.oneSignalAppId && env.oneSignalRestApiKey),
      type: data.type
    });
    return { skipped: true, recipients: ids.length };
  }

  logger.info('onesignal:send:start', { recipients: ids.length, title, type: data.type });
  const response = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Basic ${env.oneSignalRestApiKey}`
    },
    body: JSON.stringify({
      app_id: env.oneSignalAppId,
      include_player_ids: ids,
      headings: { en: title, tr: title },
      contents: { en: message, tr: message },
      data
    })
  });

  if (!response.ok) {
    const text = await response.text();
    logger.error('onesignal:send:failed', { status: response.status, body: text });
    return { skipped: false, error: text };
  }
  const result = await response.json();
  logger.info('onesignal:send:success', { recipients: ids.length, notificationId: result.id });
  return result;
}
