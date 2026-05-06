import { env } from '../config/env.js';

export async function sendPushToPlayers({ playerIds, title, message, data = {} }) {
  const ids = [...new Set((playerIds || []).filter(Boolean))];
  if (!ids.length || !env.oneSignalAppId || !env.oneSignalRestApiKey) {
    return { skipped: true, recipients: ids.length };
  }

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
    console.error('OneSignal error:', text);
    return { skipped: false, error: text };
  }
  return response.json();
}
