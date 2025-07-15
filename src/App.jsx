import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreatePetPage from './pages/CreatePetPage';
import PetDetailPage from './pages/PetDetailPage';
import MeditationSessionPage from './pages/MeditationSessionPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const location = useLocation();

  useEffect(() => {
    // Se actualiza la autenticación en cada cambio de ruta
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, [location]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated
              ? JSON.parse(localStorage.getItem("roles") || "[]").includes("ROLE_ADMIN")
                ? <Navigate to="/admin" replace />
                : <Navigate to="/dashboard" replace />
              : <AuthPage />
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />}
        />
       <Route
         path="/admin"
         element={
           isAuthenticated && JSON.parse(localStorage.getItem("roles") || "[]").includes("ROLE_ADMIN")
             ? <AdminDashboard />
             : <Navigate to="/dashboard" replace />
         }
       />
        <Route
          path="/create-pet"
          element={isAuthenticated ? <CreatePetPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/pet/:id"
          element={isAuthenticated ? <PetDetailPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/meditate/:petId"
          element={isAuthenticated ? <MeditationSessionPage /> : <Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

export default App;
