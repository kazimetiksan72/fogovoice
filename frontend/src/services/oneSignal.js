import { config } from '../utils/config';

let sdkPromise = null;

function loadSdk() {
  if (!config.oneSignalAppId) return Promise.resolve(null);
  if (window.OneSignalDeferred) return Promise.resolve(window.OneSignalDeferred);
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve) => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    const script = document.createElement('script');
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    script.defer = true;
    script.onload = () => resolve(window.OneSignalDeferred);
    document.head.appendChild(script);
  });
  return sdkPromise;
}

export async function initOneSignal() {
  const deferred = await loadSdk();
  if (!deferred) return null;
  deferred.push(async (OneSignal) => {
    await OneSignal.init({ appId: config.oneSignalAppId, allowLocalhostAsSecureOrigin: true });
  });
  return deferred;
}

export async function requestWebPushPlayerId() {
  if (!config.oneSignalAppId) return null;
  await initOneSignal();
  return new Promise((resolve) => {
    window.OneSignalDeferred.push(async (OneSignal) => {
      const permission = OneSignal.Notifications.permission;
      if (!permission) await OneSignal.Notifications.requestPermission();
      const id = OneSignal.User.PushSubscription.id;
      resolve(id || null);
    });
  });
}
