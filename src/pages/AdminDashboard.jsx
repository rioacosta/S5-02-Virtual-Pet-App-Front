import { useEffect, useState } from "react";
import backgroundImage from "../assets/the-temple.png";
import { useNavigate } from "react-router-dom";
import {
  fetchUsersWithPets,
  toggleUserEnabled,
  deleteUser
} from "../services/adminService";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const loadUsers = () => {
    fetchUsersWithPets().then(setUsers);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    loadUsers();
  }, [navigate]);

  const handleToggle = async (username) => {
    await toggleUserEnabled(username);
    loadUsers();
  };

  const handleDelete = async (username) => {
    if (confirm(`¿Eliminar al usuario ${username} y todas sus mascotas?`)) {
      await deleteUser(username);
      loadUsers();
    }
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "100vh", padding: "2rem", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255,255,255,0.85)", zIndex: 0 }}/>
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1>Panel de Administración 🧘‍♀️🔐</h1>
        <p>Usuarios registrados y sus mascotas</p>

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
                    src={pet.avatarUrl || "/default-avatar.png"}
                    alt={pet.name}
                    style={cardStyles.petImage}
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
  }
};
