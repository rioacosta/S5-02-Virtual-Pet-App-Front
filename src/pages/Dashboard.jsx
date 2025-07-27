import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  const { username: paramUsername } = useParams();
  const isOwnProfile = !paramUsername;

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
  } catch (error) {
    console.error("Error al verificar token:", error);
    navigate("/", { replace: true });
    return;
  }

if (paramUsername) {
  // 👑 Modo admin viendo el perfil de otro usuario
  fetch(`http://localhost:8080/api/admin/users/${paramUsername}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(user => {
      if (user) {
        setUserData(user);
        setBuddy(user.buddys || []);
        const total = (user.buddys || []).reduce((sum, b) => sum + (b.totalMeditationMinutes || 0), 0);
        setTotalMinutes(total);
      } else {
        console.warn("Usuaria no encontrada");
        navigate("/admin", { replace: true });
      }
    })
    .catch(err => console.error("Error al cargar perfil de la usuaria:", err));
  } else {
    // 🧘 Usuario logueado viendo su propio perfil
    fetch("http://localhost:8080/api/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error("Error al cargar usuaria:", err));

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
  }

}, [navigate, paramUsername]);


  const handleLogout = () => {
    localStorage.setItem("loggedOut", "true");
    localStorage.setItem("userId", userData?.username || "usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    window.location.href = "/";
  };
const handleUserUpdate = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("❌ No se encontró el token de sesión");
    return;
  }

  // Crear payload solo con los cambios válidos
  const payload = {};
  if (newUsername.trim() && newUsername !== userData?.username) {
    payload.username = newUsername.trim();
  }
  if (newEmail.trim() && newEmail !== userData?.email) {
    payload.email = newEmail.trim();
  }

  // Si no hay cambios, no enviar nada
  if (Object.keys(payload).length === 0) {
    alert("⚠️ No se detectaron cambios para actualizar");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("No se pudo actualizar la usuaria");
    }

    const result = await response.json();

    const newToken = result?.token;
    if (newToken) {
      console.log("🆕 Nuevo token recibido:", newToken);
      localStorage.setItem("token", newToken);

      const decoded = jwtDecode(newToken);
      localStorage.setItem("roles", JSON.stringify(decoded.roles || []));
      localStorage.setItem("userId", decoded.userId || decoded.id || decoded.sub);

      alert("✅ Datos actualizados");
      window.location.reload();
    } else {
      alert("⚠️ No se recibió un nuevo token");
    }

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
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem",
        position: "relative",
      }}
    >
      {/* Capa translúcida */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.70)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Contenido principal */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Título alineado a la izquierda */}
        <div style={{ position: "top", top: "2rem", left: "2rem", margiTop: "0.5rem",zIndex: 2 }}>
          <h1>{userData?.username || ""} este es tu espacio de paz y amor🧘</h1>
        </div>

        {/* Párrafo de bienvenida centrado */}
        <div style={{
          textAlign: "center",
          marginTop: "6rem",
          marginBottom: "2rem",
          maxWidth: "600px",
          margin: "0 auto",
        }}>
          <p style={{
            marginTop: '0.5rem',
            fontSize: '1.2rem',
            color: '#483D8B',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            padding: '1rem',
            borderRadius: '10px',
          }}>
            🌟 Bienvenida a tu refugio virtual de calma y conexión. Esta app está diseñada para ayudarte a cultivar
            la atención plena, establecer rutinas de autocuidado y compartir momentos zen con tus buddies.
          </p>
        </div>

        {isOwnProfile && (
          <>
            <button onClick={handleLogout} style={styles.logoutButton}>🔒 Cerrar sesión</button>
            <button
              onClick={() => setShowEditPanel(prev => !prev)}
              style={{ ...styles.logoutButton, top: '65px', backgroundColor: '#4CAF50' }}
            >
              ⚙️ Editar Perfil
            </button>
          </>
        )}

        {showEditPanel && (
          <div style={{
            marginTop: '1rem',
            background: '#fff',
            padding: '1rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
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

        <h3 style={{ marginTop: "1rem", marginLeft: "2.5rem", fontSize: "1.3rem", }}>Tus Compañeras de Meditación</h3>
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
    margin: "2rem auto",
    padding: "1.2rem 2rem",                // Espaciado interno más aireado
    backgroundColor: "rgba(255, 245, 238, 0.6)", // Un poco más visible
    borderRadius: "20px",                 // Curva más suave
    backdropFilter: "blur(6px)",          // Ligero aumento del desenfoque
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)", // Sombra más profunda
    width: "90%",
    maxWidth: "600px",                    // Controla que no sea gigante en pantallas grandes
    color: "#4B0082",                     // Texto con más contraste y paz
    //fontFamily: "'Segoe UI', sans-serif",// Fuente suave
    transition: "all 0.3s ease-in-out",   // Animación suave si luego lo haces dinámico
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
    position: "absolute",
    top: "45%",
    left: "6%",
    padding: "12px 20px",
    backgroundColor: "#5bc0de",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    margin: "0.5rem",
  },
  buddysContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "1.5rem",
    marginTop: "0,5rem",
  },
  buddysCard: {
    backgroundColor: "rgba(255, 245, 238, 0.40)",
    backdropFilter: "blur(5px)",
    borderRadius: "12px",
    padding: "1.2rem",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    color: "#483D8B",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  buddysImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top'
  },
};
