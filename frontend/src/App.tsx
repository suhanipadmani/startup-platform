import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleGuard from './components/common/RoleGuard';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

import Login from './components/auth/LoginForm';
import Register from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPasswordForm';
import ResetPassword from './components/auth/ResetPasswordForm';
import FounderDashboard from './pages/founder/FounderDashboard';
import SubmitIdea from './pages/founder/SubmitIdea';
import ProjectDetails from './pages/founder/ProjectDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingReviews from './pages/admin/PendingReviews';
import ReviewHistory from './pages/admin/ReviewHistory';
import UsersList from './pages/admin/UsersList';
import ProfilePage from './pages/Profile/ProfilePage';
import EditProfilePage from './pages/Profile/EditProfilePage';
import ChangePasswordPage from './pages/Profile/ChangePasswordPage';
import EditIdea from './pages/founder/EditIdea';
import StartupIdeaList from './pages/founder/StartupIdeaList';

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Founder Routes */}
              <Route
                path="/founder"
                element={
                  <ProtectedRoute>
                    <RoleGuard role="founder">
                      <FounderDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/founder/submit"
                element={
                  <ProtectedRoute>
                    <RoleGuard role="founder">
                      <SubmitIdea />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/founder/projects/:id"
                element={
                  <ProtectedRoute>
                    <RoleGuard role="founder">
                      <ProjectDetails />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/founder/ideas/:id/edit"
                element={
                  <ProtectedRoute>
                    <RoleGuard role="founder">
                      <EditIdea />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/founder/ideas"
                element={
                  <ProtectedRoute>
                    <RoleGuard role="founder">
                      <StartupIdeaList />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <RoleGuard role="admin">
                      <AdminDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reviews/pending"
                element={
                  <ProtectedRoute>
                    <RoleGuard role="admin">
                      <PendingReviews />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reviews/history"
                element={
                  <ProtectedRoute>
                    <RoleGuard role="admin">
                      <ReviewHistory />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <RoleGuard role="admin">
                      <UsersList />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              {/* User Profile - Shared */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePasswordPage />
                  </ProtectedRoute>
                }
              />

            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
export default App;
