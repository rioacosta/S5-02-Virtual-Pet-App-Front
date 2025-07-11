// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CreatePetPage from './pages/CreatePetPage';
import PetDetailPage from './pages/PetDetailPage';
import MeditationSessionPage from './pages/MeditationSessionPage';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/create-pet"
          element={isAuthenticated ? <CreatePetPage /> : <Navigate to="/" />}
        />
        <Route
          path="/pet/:id"
          element={isAuthenticated ? <PetDetailPage /> : <Navigate to="/" />}
        />
        <Route
          path="/meditate/:petId"
          element={isAuthenticated ? <MeditationSessionPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;