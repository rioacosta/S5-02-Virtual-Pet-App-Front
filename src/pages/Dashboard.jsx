import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired } from "../utils/authUtils";

export default function Dashboard() {
  const [pets, setPets] = useState([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

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

    fetch("http://localhost:8080/api/v1/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error("Error al cargar usuario:", err));

    fetch("http://localhost:8080/api/pets", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPets(data);
        const total = data.reduce((sum, pet) => sum + (pet.totalMeditationMinutes || 0), 0);
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
        <button onClick={handleLogout} style={styles.logoutButton}>
          🔒 Cerrar sesión
        </button>

        <div style={styles.meditationCounter}>
          <h2>Tu Tiempo Total Meditado</h2>
          <div style={styles.counter}>{totalMinutes}</div>
          <p>minutos</p>
        </div>

        <Link to="/create-pet">
          <button style={styles.createButton}>➕ Crear buddy</button>
        </Link>

        <h3 style={{ marginTop: "2rem" }}>Tus Compañeros de Meditación</h3>
        <div style={styles.petsContainer}>
          {pets.map((pet) => (
            <Link to={`/pet/${pet.id}`} key={pet.id} style={{ textDecoration: "none" }}>
              <div style={styles.petCard}>
                <img
                  src={getAvatarByLevel(pet)}
                  alt={pet.name}
                  style={styles.petImage}
                  onError={(e) => {
                    e.currentTarget.onerror = null; // Evita bucle infinito si también falla esta
                    e.currentTarget.src = "/assets/avatars/the-gang.png";
                  }}
                />
                <h3>{pet.name}</h3>
                <p>Nivel {pet.level || 1}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
function getAvatarByLevel(pet) {
  if (Array.isArray(pet.avatarStages) && pet.avatarStages.length > 0) {
    const index = Math.min((pet.level || 1) - 1, pet.avatarStages.length - 1);
    const stage = pet.avatarStages[index];
    if (stage) {
      console.log(`🐾 Mostrando stage: ${stage}`);
      return stage;
    }
  }

  if (pet.avatar) {
    console.log(`🐾 Mostrando avatar base: ${pet.avatar}`);
    return `/assets/avatars/${pet.avatar}`;
  }

  return "/assets/avatars/the-gang.png";
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
    color: "#6a11cb",
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
    backgroundColor: "#66CC33",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    display: "block",
    margin: "0 auto",
  },
  petsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "1.5rem",
    marginTop: "1.5rem",
  },
  petCard: {
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
  petImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top'
  },
};
