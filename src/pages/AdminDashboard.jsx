import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/authUtils";
import {
  fetchUsersWithPets,
  toggleUserEnabled,
  deleteUser
} from "../services/adminService";

function getAvatarByLevel(pet) {
  if (!pet) return "/assets/avatars/the-gang.png";

  if (Array.isArray(pet.avatarStages) && pet.avatarStages.length > 0) {
    const index = Math.min((pet.level || 1) - 1, pet.avatarStages.length - 1);
    const fileName = pet.avatarStages[index]?.split('/').pop();
    return `/assets/avatars/${fileName}`;
  }
  return `/assets/avatars/${pet.avatar || "the-gang.png"}`;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const loadUsers = () => {
    fetchUsersWithPets().then(setUsers);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
      console.warn("Token no encontrado. Redirigiendo...");
      navigate("/", { replace: true });
      return;
    }

    try {
      const expired = isTokenExpired(token);
      if (expired) {
        console.warn("Token expirado. Redirigiendo...");
        localStorage.removeItem("token");
        navigate("/", { replace: true });
        return;
      }

      const roles = JSON.parse(localStorage.getItem("roles") || "[]");
      const isAdmin = roles.includes("ROLE_ADMIN");

      if (!isAdmin) {
        console.warn("Acceso denegado: no es administrador");
        navigate("/dashboard", { replace: true });
        return;
      }

    } catch (error) {
      console.error("Error al verificar token:", error);
      navigate("/", { replace: true });
      return;
    }

    loadUsers();
  }, [navigate]);

  const handleToggle = async (username) => {
    await toggleUserEnabled(username);
    loadUsers();
  };

  const handleDelete = async (username) => {
    if (confirm(`¿Eliminar al usuario ${username} y todas sus buddys?`)) {
      await deleteUser(username);
      loadUsers();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("roles");
    localStorage.setItem("loggedOut", "true");
    navigate("/");
  };

  const goToUserDashboard = () => {
    navigate("/dashboard");
  };

return (
    <div
      style={{
        backgroundImage: `url(/assets/the-temple.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem",
        position: "relative"
      }}
    >
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(255,255,255,0.85)",
        zIndex: 0
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1>Panel de Administración 🧘‍♀️🔐</h1>
        <p>Usuarios registrados y sus buddys</p>

        <button onClick={handleLogout} style={cardStyles.logoutButton}>
          🔒 Cerrar sesión
        </button>

        <button onClick={goToUserDashboard} style={cardStyles.userDashboardButton}>
          🧘 Ir al Dashboard de Usuario
        </button>

        {users.map(user => (
          <div key={user.id} style={cardStyles.userCard}>
            <h2>{user.username} ({user.email})</h2>
            <p>Estado: {user.enabled ? "🟢 Activo" : "🔴 Suspendido"}</p>
            <p>Roles: {user.roles.join(", ")}</p>
            <p>Mascotas: {user.pets.length}</p>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <button onClick={() => handleToggle(user.username)} style={cardStyles.actionButton}>
                {user.enabled ? "🛑 Suspender" : "✅ Reactivar"}
              </button>
              <button onClick={() => handleDelete(user.username)} style={{ ...cardStyles.actionButton, backgroundColor: "#d9534f" }}>
                🗑️ Eliminar
              </button>
            </div>

            <div style={cardStyles.petsGroup}>
              {user.pets.map(pet => (
                <div key={pet.id} style={cardStyles.petCard}>
                  <img
                    src={getAvatarByLevel(pet)}
                    alt={pet.name}
                    style={cardStyles.petImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/avatars/the-gang.png";
                    }}
                  />
                  <h4>{pet.name}</h4>
                  <p>Nivel {pet.level}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyles = {
  userCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    marginBottom: "2rem",
    padding: "1rem 2rem",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  },
  petsGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginTop: "1rem"
  },
  petCard: {
    width: "120px",
    backgroundColor: "#f4f4f4",
    padding: "0.5rem",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  petImage: {
    width: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "0.5rem",
    aspectRatio: "1/1"
  },
  actionButton: {
    padding: "8px 14px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  logoutButton: {
    position: 'absolute',
    top: '0px',
    right: '10px',
    marginBottom: "1.5rem",
    padding: "10px 20px",
    backgroundColor: "#FF6666",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  userDashboardButton: {
    position: 'absolute',
    top: '50px',
    right: '10px',
    marginBottom: "2rem",
    padding: "10px 20px",
    backgroundColor: "#5bc0de",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginLeft: "0.5rem" // CORRECCIÓN AQUÍ: sin espacio entre número y unidad
  }
};