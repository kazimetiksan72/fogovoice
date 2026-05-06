export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  livekitUrl: import.meta.env.VITE_LIVEKIT_URL || '',
  oneSignalAppId: import.meta.env.VITE_ONESIGNAL_APP_ID || '',
  publicUrl: import.meta.env.VITE_APP_PUBLIC_URL || window.location.origin
};
