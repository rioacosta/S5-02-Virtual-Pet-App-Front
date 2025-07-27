import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired } from "../utils/authUtils";

export default function Dashboard() {
  const [buddy, setBuddy] = useState([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [newUsername, setNewUsername] = useState(userData?.username || '');
  const [newEmail, setNewEmail] = useState(userData?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
      console.warn("Token no encontrado. Redirigiendo...");
      navigate("/", { replace: true });
      return;
    }

    try {
      const expired = isTokenExpired(token);
      console.log("¿Token expirado?:", expired);

      if (expired) {
        console.warn("Token expirado. Redirigiendo...");
        localStorage.removeItem("token");
        navigate("/", { replace: true });
        return;
      }
    } catch (error) {
      console.error("Error al verificar token:", error);
      navigate("/", { replace: true });
      return;
    }

    const decoded = jwtDecode(token);
    setUserData({ name: decoded.userId });

    fetch("http://localhost:8080/api/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error("Error al cargar usuario:", err));

    fetch("http://localhost:8080/api/users/buddys", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setBuddy(data);
        const total = data.reduce((sum, buddy) => sum + (buddy.totalMeditationMinutes || 0), 0);
        setTotalMinutes(total);
      })
      .catch(err => console.error("Error al cargar buddy:", err));

  }, [navigate]);

  const handleLogout = () => {
    localStorage.setItem("loggedOut", "true");
    localStorage.setItem("userId", userData?.username || "usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    window.location.href = "/";
  };
  const handleUserUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch("http://localhost:8080/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...userData,
          username: newUsername,
          email: newEmail
        })
      });
      alert("✅ Datos actualizados");
      window.location.reload(); // 👈 fuerza actualización de la vista
    } catch (err) {
      console.error("Error actualizando datos:", err);
      alert("❌ Error al actualizar");
    }
  };

  const handlePasswordChange = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:8080/api/users/change-password?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("🔐 Contraseña actualizada");
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      alert("❌ Error al cambiar contraseña");
    }
  };

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
      console.log(`🐾 Mostrando avatar base: $buddy.avatar}`);
      return `/assets/avatars/${buddy.avatar}`;
    }

    return "/assets/avatars/the-gang.png";
  }

  return (
    <div
      style={{
        backgroundImage: `url(/assets/the-temple.png)`,
        backgroundSize: "flex",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem",
        position: "relative"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          zIndex: 0
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1>{userData?.username || ""} este es tu espacio de paz 🧘</h1>
        <p style={{
          marginTop: '0.5rem',
          fontSize: '1.2rem',
          color: '#555',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          padding: '1rem',
          borderRadius: '10px',
          maxWidth: '600px'
        }}>
          🌟 Bienvenido a tu refugio virtual de calma y conexión. Esta app está diseñada para ayudarte a cultivar la atención plena, establecer rutinas de autocuidado y compartir momentos zen con tus buddies.
        </p>
        <button onClick={handleLogout} style={styles.logoutButton}>
          🔒 Cerrar sesión
        </button>
        <button
          onClick={() => setShowEditPanel(prev => !prev)}
          style={{ ...styles.logoutButton, top: '65px', backgroundColor: '#4CAF50' }}
        >
          ⚙️ Editar Perfil
        </button>

        {showEditPanel && (
          <div style={{ marginTop: '1rem', background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3>Actualizar Datos</h3>
            <input type="text" placeholder="Nuevo nombre" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
            <input type="email" placeholder="Nuevo correo" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            <button onClick={handleUserUpdate}>Guardar cambios</button>

            <h4 style={{ marginTop: '1rem' }}>Cambiar contraseña</h4>
            <input type="password" placeholder="Contraseña actual" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
            <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <button onClick={handlePasswordChange}>Cambiar contraseña</button>
          </div>
        )}

        <div style={styles.meditationCounter}>
          <h2>Tu Tiempo Total Meditado</h2>
          <div style={styles.counter}>{totalMinutes}</div>
          <p>minutos</p>
        </div>

        <Link to="/create">
          <button style={styles.createButton}>➕ Crear buddy</button>
        </Link>

        <h3 style={{ marginTop: "2rem" }}>Tus Compañeros de Meditación</h3>
        <div style={styles.buddysContainer}>
          {buddy.map((buddy) => (
            <Link to={`/buddys/${buddy.id}`} key={buddy.id} style={{ textDecoration: "none" }}>
              <div style={styles.buddysCard}>
                <img
                  src={getAvatarByLevel(buddy)}
                  alt={buddy.name}
                  style={styles.buddysImage}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/avatars/the-gang.png";
                  }}
                />
                <h3>{buddy.name}</h3>
                <p>Nivel {buddy.level || 1}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


const styles = {
  meditationCounter: {
    textAlign: "center",
    margin: "2rem 0",
    padding: "1.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: "12px",
    backdropFilter: "blur(5px)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  counter: {
    fontSize: "4rem",
    fontWeight: "bold",
    color: "#9966FF",
    margin: "0.5rem 0",
  },
  logoutButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    marginBottom: "1.5rem",
    padding: "10px 20px",
    backgroundColor: "#FF6666",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  createButton: {
    padding: "12px 20px",
    backgroundColor: "#5bc0de",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    //display: "block",
    margin: "0 auto",
  },
  buddysContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "1.5rem",
    marginTop: "1.5rem",
  },
  buddysCard: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(5px)",
    borderRadius: "12px",
    padding: "1.2rem",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    color: "#333",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  buddysImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top'
  },
};
