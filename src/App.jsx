//src/App.jsx
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isTokenExpired } from './utils/authUtils';

import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateBuddyPage from './pages/CreateBuddyPage';
import BuddyDetailPage from './pages/BuddyDetailPage';
import MeditationSessionPage from './pages/MeditationSessionPage';

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      setIsAuthenticated(false);
      setIsAdmin(false);
    } else {
      const roles = JSON.parse(localStorage.getItem("roles") || "[]");
      setIsAdmin(roles.includes("ROLE_ADMIN"));
      setIsAuthenticated(true);
    }
  }, [location]);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated
              ? isAdmin
                ? <Navigate to="/admin" replace />
                : <Navigate to="/dashboard" replace />
              : <AuthPage />
          }
        />
        <Route
          path="/dashboard/:username?"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/admin"
          element={
            isAuthenticated === null
              ? <div>Cargando...</div>
              : isAuthenticated && isAdmin
                ? <AdminDashboard />
                : <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="/create"
          element={isAuthenticated ? <CreateBuddyPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/buddys/:id"
          element={isAuthenticated ? <BuddyDetailPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/meditate/:buddyId"
          element={isAuthenticated ? <MeditationSessionPage /> : <Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

export default App;
