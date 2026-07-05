import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { RegisterProfilePage } from '@/features/auth/RegisterProfilePage'
import { AdminLayout } from '@/features/admin/AdminLayout'
import { AdminPage } from '@/features/admin/AdminPage'
import { DashboardLayout } from '@/features/dashboard/DashboardLayout'
import { AnalyticsPage } from '@/features/dashboard/pages/AnalyticsPage'
import { AIPage } from '@/features/dashboard/pages/AIPage'
import { DashboardHomePage } from '@/features/dashboard/pages/DashboardHomePage'
import { ProfilePage } from '@/features/dashboard/pages/ProfilePage'
import { SettingsPage } from '@/features/dashboard/pages/SettingsPage'
import { WishesPage } from '@/features/dashboard/pages/WishesPage'
import { LandingPage } from '@/features/landing/LandingPage'
import { LiveEventPage } from '@/pages/LiveEventPage'
import { LiveWallPage } from '@/pages/LiveWallPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PublicGraduatePage } from '@/pages/PublicGraduatePage'
import { StudioGraduatePage } from '@/pages/StudioGraduatePage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/profile" element={<RegisterProfilePage />} />
      <Route path="/create" element={<Navigate to="/register" replace />} />

      {/* Public share link — simple profile only */}
      <Route path="/graduate/:graduateId" element={<PublicGraduatePage />} />
      <Route path="/graduate/:graduateId/studio" element={<StudioGraduatePage />} />
      <Route path="/graduate/:graduateId/live" element={<LiveEventPage />} />
      <Route path="/graduate/:graduateId/wall" element={<LiveWallPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="wishes" element={<WishesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="ai" element={<AIPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPage />} />
      </Route>

      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
