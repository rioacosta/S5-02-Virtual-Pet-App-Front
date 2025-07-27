import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isTokenExpired } from "../utils/authUtils";
import {
  fetchUsersWithBuddys,
  toggleUserEnabled,
  deleteUser,
  createAdmin,
  updateUserRoles,
  updateUserData
} from "../services/adminService";

  function getAvatarByLevel(buddy) {
    if (Array.isArray(buddy.avatarStages) && buddy.avatarStages.length > 0) {
      const index = Math.min((buddy.level || 1) - 1, buddy.avatarStages.length - 1);
      const stage = buddy.avatarStages[index];
      if (stage) {
        console.log(`🐾 Mostrando stage: ${stage}`);
        return stage;
      }
    }

    if (buddy.avatar) {
        console.log(`🐾 Mostrando avatar base: ${buddy.avatar}`);
      return `/assets/avatars/${buddy.avatar}`;
    }

    return "/assets/avatars/the-gang.png";
  }


export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: ""
  });

  const loadUsers = () => {
    fetchUsersWithBuddys().then(setUsers);
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
        console.warn("Acceso denegado: no es administradore");
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
    if (confirm(`¿Eliminar a la usuaria ${username} y todas sus buddys?`)) {
      try {
        await deleteUser(username);
        loadUsers();
      } catch (error) {
        if (error.response?.status === 400) {
          alert(error.response.data.message); // Ej. "No puedes eliminarte a ti mismo."
        } else {
          console.error("Error al eliminar usuaria:", error);
          alert("Error inesperado al eliminar usuaria");
        }
      }
    }
  };

  const handleUpdateRoles = async (username, newRoles) => {
    try {
      await updateUserRoles(username, newRoles);
      loadUsers();
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.message); // Ej. "No puedes quitarte el rol ADMIN."
      } else {
        console.error("Error al actualizar roles:", error);
        alert("Error inesperado al actualizar roles");
      }
    }
  };

  const handleCreateAdmin = async () => {
    try {
      await createAdmin(newAdmin);
      alert("Administradore creade exitosamente 🎉");
      setNewAdmin({ username: "", email: "", password: "" });
      loadUsers();
    } catch (error) {
      console.error("Error creando administradore:", error);
      alert("No se pudo crear el administradore");
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
        backgroundColor: "rgba(255,255,255,0.70)",
        zIndex: 0
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1>Panel de Administración 🧘‍♀️🔐</h1>
        <p>Usuarias registradas y sus buddys</p>

        <button onClick={handleLogout} style={cardStyles.logoutButton}>
          🔒 Cerrar sesión
        </button>

        <button onClick={goToUserDashboard} style={cardStyles.userDashboardButton}>
          🧘 Ir al Dashboard de Usuaria
        </button>
        <div style={{
          backgroundColor: "rgba(72, 209, 204, 0.35)",
          padding: "1rem",
          borderRadius: "10px",
          marginBottom: "2rem"
        }}>
          <h3>Crear nueve Administradore 👑</h3>
          <input
            placeholder="Nombre de usuaria"
            value={newAdmin.username}
            onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })}
            style={{ marginRight: "0.5rem" }}
          />
          <input
            placeholder="Email"
            value={newAdmin.email}
            onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
            style={{ marginRight: "0.5rem" }}
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={newAdmin.password}
            onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
            style={{ marginRight: "0.5rem" }}
          />
          <button onClick={handleCreateAdmin} style={cardStyles.actionButton}>
            🚀 Crear Admin
          </button>
        </div>

        {users.map(user => (
          <div key={user.id} style={cardStyles.userCard}>
            <h2>
              <a
                href={`/dashboard/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#007bff", fontWeight: "bold" }}
              >
                {user.username}
              </a> ({user.email})
            </h2>
            <p>Estado: {user.enabled ? "🟢 Activo" : "🔴 Suspendido"}</p>
            <p>Roles: {user.roles.join(", ")}</p>
            <p>Buddys: {user.buddys.length}</p>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <button onClick={() => handleToggle(user.username)} style={cardStyles.actionButton}>
                {user.enabled ? "🛑 Suspender" : "✅ Reactivar"}
              </button>
              <button onClick={() => handleDelete(user.username)} style={{ ...cardStyles.actionButton, backgroundColor: "#d9534f" }}>
                🗑️ Eliminar
              </button>
            </div>

            <div style={cardStyles.buddysGroup}>
              {user.buddys.map(buddy => (

                <a
                  href={`/buddys/${buddy.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={buddy.id}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={cardStyles.buddyCard}>
                    <img
                      src={getAvatarByLevel(buddy)}
                      alt={buddy.name}
                      style={cardStyles.buddyImage}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/avatars/the-gang.png";
                      }}
                    />
                    <h4>{buddy.name}</h4>
                    <p>Nivel {buddy.level}</p>
                  </div>
                </a>
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
    backgroundColor: "rgba(255, 245, 238, 0.40)",
    marginBottom: "2rem",
    padding: "1rem 2rem",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  },
  buddysGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginTop: "1rem"
  },
  buddyCard: {
    width: "120px",
    backgroundColor: "#f4f4f4",
    padding: "0.5rem",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  buddyImage: {
    width: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "0.5rem",
    aspectRatio: "1/1"
  },
  actionButton: {
    padding: "8px 14px",
    backgroundColor: "#5bc0de",
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
    marginLeft: "0.5rem"
  }
};