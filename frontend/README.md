# Frontend

React, Vite, Tailwind CSS, React Router, Axios, LiveKit Web SDK, QR üretme/tarama ve OneSignal Web Push entegrasyonu içeren tek web uygulaması.

## Kurulum

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Kökten backend ile birlikte:

```bash
npm install
npm run dev
```

## Environment

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_LIVEKIT_URL=wss://your-project.livekit.cloud
VITE_ONESIGNAL_APP_ID=
VITE_APP_PUBLIC_URL=http://localhost:5173
```

## Sayfalar

- `/`: Landing
- `/join`, `/join/:tourCode`: Turist katılım
- `/scan`: Web kamera ile QR tarama
- `/listen/:tourCode`: Turist dinleme ekranı
- `/guide/login`, `/guide/register`
- `/guide`: Rehber dashboard
- `/guide/tours/new`
- `/guide/tours/:id`
- `/admin/login`
- `/admin`
- `/admin/guides`
- `/admin/tours/active`
- `/admin/tours/history`
- `/admin/tours/:id`

## LiveKit Cloud

`VITE_LIVEKIT_URL` frontend için gereklidir. Rehber mikrofon track'i sadece `Mikrofonu Aç` butonundan sonra publish edilir. Turist ekranında mikrofon erişimi yoktur; iOS Safari autoplay kısıtları için `Dinlemeyi Başlat` butonu kullanılır.

## OneSignal Web Push

`VITE_ONESIGNAL_APP_ID` girildiğinde OneSignal SDK dinamik yüklenir. Turist tura katılırken izin opsiyonel olarak istenir ve player id backend'e gönderilir.

TODO: Production'da OneSignal Web Push için gerekli service worker dosyalarını OneSignal dashboard yönergelerine göre public köke ekleyin.

## Azure

Kök dizinde `npm run azure:build` çalıştırılır. Backend `frontend/dist` klasörünü servis eder.
