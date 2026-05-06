import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout } from './layout/PublicLayout';
import { GuideLayout } from './layout/GuideLayout';
import { AdminLayout } from './layout/AdminLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LandingPage } from './pages/public/LandingPage';
import { TouristJoinPage } from './pages/public/TouristJoinPage';
import { QRScannerPage } from './pages/public/QRScannerPage';
import { TouristListeningPage } from './pages/public/TouristListeningPage';
import { GuideLoginPage } from './pages/guide/GuideLoginPage';
import { GuideRegisterPage } from './pages/guide/GuideRegisterPage';
import { GuideDashboardPage } from './pages/guide/GuideDashboardPage';
import { CreateTourPage } from './pages/guide/CreateTourPage';
import { GuideTourDetailPage } from './pages/guide/GuideTourDetailPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminGuidesPage } from './pages/admin/AdminGuidesPage';
import { AdminToursPage } from './pages/admin/AdminToursPage';
import { AdminTourDetailPage } from './pages/admin/AdminTourDetailPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/join" element={<TouristJoinPage />} />
            <Route path="/join/:tourCode" element={<TouristJoinPage />} />
            <Route path="/scan" element={<QRScannerPage />} />
            <Route path="/listen/:tourCode" element={<TouristListeningPage />} />
            <Route path="/guide/login" element={<GuideLoginPage />} />
            <Route path="/guide/register" element={<GuideRegisterPage />} />
          </Route>
          <Route element={<ProtectedRoute type="guide" />}>
            <Route element={<GuideLayout />}>
              <Route path="/guide" element={<GuideDashboardPage />} />
              <Route path="/guide/tours/new" element={<CreateTourPage />} />
              <Route path="/guide/tours/:id" element={<GuideTourDetailPage />} />
            </Route>
          </Route>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute type="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/guides" element={<AdminGuidesPage />} />
              <Route path="/admin/tours/active" element={<AdminToursPage type="active" />} />
              <Route path="/admin/tours/history" element={<AdminToursPage type="history" />} />
              <Route path="/admin/tours/:id" element={<AdminTourDetailPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
