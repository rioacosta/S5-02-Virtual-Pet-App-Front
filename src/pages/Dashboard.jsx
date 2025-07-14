import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/the-temple.png";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const [pets, setPets] = useState([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // ✅ Decodificar token y guardar nombre
    const decoded = jwtDecode(token);
    console.log("Usuario desde token:", decoded);
    setUserData({ name: decoded.userId });

    // ✅ Obtener datos del backend (opcional si necesitas más info)
    fetch("http://localhost:8080/api/v1/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Datos del backend:", data);
        setUserData(data);
      })
      .catch(err => console.error("Error al cargar usuario:", err));


    // ✅ Obtener mascotas
    fetch("http://localhost:8080/api/pets", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPets(data);
        const total = data.reduce((sum, pet) => sum + (pet.totalMeditationMinutes || 0), 0);
        setTotalMinutes(total);
      })
      .catch(err => console.error("Error al cargar mascotas:", err));
  }, [navigate]);


  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      padding: "2rem",
      position: "relative"
    }}>
      {/* Overlay para legibilidad */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        zIndex: 0
      }}/>

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1>Bienvenido {userData?.username || ''} 🧘</h1>

        {/* Contador de meditación */}
        <div style={styles.meditationCounter}>
          <h2>Tiempo Total Meditado</h2>
          <div style={styles.counter}>{totalMinutes}</div>
          <p>minutos</p>
        </div>

        <Link to="/create-pet">
          <button style={styles.createButton}>
            ➕ Crear nueva mascota
          </button>
        </Link>

        <h3 style={{ marginTop: '2rem' }}>Tus Compañeros de Meditación</h3>
        <div style={styles.petsContainer}>
          {pets.map((pet) => (
            <Link
              to={`/pet/${pet.id}`}
              key={pet.id}
              style={{ textDecoration: 'none' }}
            >
              <div style={styles.petCard}>
                <img
                  src={pet.avatarUrl || "/default-avatar.png"}
                  alt={pet.name}
                  style={styles.petImage}
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

const styles = {
  meditationCounter: {
    textAlign: 'center',
    margin: '2rem 0',
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '12px',
    backdropFilter: 'blur(5px)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  },
  counter: {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#6a11cb',
    margin: '0.5rem 0'
  },
  createButton: {
    padding: "12px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 'bold',
    display: 'block',
    margin: '0 auto'
  },
  petsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "1.5rem",
    marginTop: "1.5rem"
  },
  petCard: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(5px)",
    borderRadius: "12px",
    padding: "1.2rem",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    color: '#333',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'translateY(-5px)'
    }
  },
  petImage: {
    width: "100%",
    borderRadius: "50%",
    aspectRatio: "1/1",
    objectFit: "cover",
    marginBottom: '0.8rem',
    border: '3px solid #6a11cb'
  }
};