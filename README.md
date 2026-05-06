# Tour Guide Web App

Web tabanlı canlı sesli tur MVP'si. Tek monorepo içinde Express/MongoDB backend ve React/Vite/Tailwind frontend bulunur. Azure App Service'te tek Node process olarak çalışır; production'da frontend build'i backend tarafından servis edilir.

## Lokal

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## Azure App Service

App Service startup command:

```bash
npm start
```

Build command:

```bash
npm run azure:build
```

Azure Configuration içine backend env değerlerini ekleyin. `CLIENT_ORIGIN` ve `ADMIN_ORIGIN` production domaininiz olmalı.
