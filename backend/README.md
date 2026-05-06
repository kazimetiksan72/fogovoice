# Backend

Express, MongoDB, JWT, LiveKit Cloud token üretimi ve OneSignal Web Push servislerini içerir.

## Kurulum

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Kökten:

```bash
npm install
npm run dev
```

## Environment

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/tour-guide-web-app
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_URL=
ONESIGNAL_APP_ID=
ONESIGNAL_REST_API_KEY=
CLIENT_ORIGIN=http://localhost:5173
ADMIN_ORIGIN=http://localhost:5173
```

## LiveKit Cloud

LiveKit Cloud projesinden `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` değerlerini alın. Rehber tokenları publish/subscribe, turist tokenları sadece subscribe yetkilidir.

## OneSignal Web Push

OneSignal Web Push app oluşturun. App ID ve REST API Key değerlerini env'e ekleyin. Frontend turist tura katıldıktan sonra OneSignal player id değerini backend'e gönderir.

## Test Kullanıcıları

Guide:

```bash
curl -X POST http://localhost:5000/api/auth/guide/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo Guide","email":"guide@example.com","password":"secret123"}'
```

Admin:

```bash
npm run seed:admin -- "Demo Admin" admin@example.com secret123
```

## API Endpointleri

- `POST /api/auth/guide/register`
- `POST /api/auth/guide/login`
- `POST /api/auth/admin/login`
- `GET /api/auth/me`
- `POST /api/tours`
- `GET /api/tours/my`
- `GET /api/tours/:id`
- `POST /api/tours/:id/end`
- `GET /api/tours/code/:tourCode`
- `POST /api/tours/join`
- `POST /api/tours/:id/leave`
- `POST /api/livekit/guide-token`
- `POST /api/livekit/tourist-token`
- `POST /api/tours/:id/announcements`
- `GET /api/tours/:id/announcements`
- `GET /api/admin/dashboard`
- `GET /api/admin/guides`
- `GET /api/admin/tours/active`
- `GET /api/admin/tours/history`
- `GET /api/admin/tours/:id`

## Azure

Kök dizinde `npm run azure:build` frontend build üretir. `npm start` backend'i başlatır ve `frontend/dist` içeriğini servis eder.
