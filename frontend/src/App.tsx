import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import { ErrorBoundary } from './components/ErrorBoundary';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import FounderDashboard from './pages/founder/FounderDashboard';
import SubmitIdea from './pages/founder/SubmitIdea';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProjectDetails from './pages/founder/ProjectDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

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
              path="/admin"
              element={
                <ProtectedRoute>
                  <RoleGuard role="admin">
                    <AdminDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
