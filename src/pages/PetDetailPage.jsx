import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

function PetDetailPage() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [hearts, setHearts] = useState([]);
  const avatarContainerRef = useRef(null);

  // Cargar datos de la mascota
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/pets/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("🐶 Pet data:", data);
        setPet(data);
        setNewName(data.name);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar mascota:", err);
        setLoading(false);
      });
  }, [id]);

  // Manejar edición del nombre
  const handleNameUpdate = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/pets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...pet, name: newName })
    })
      .then(res => res.json())
      .then(updatedPet => {
        setPet(updatedPet);
        setIsEditing(false);
      })
      .catch(err => console.error("Error actualizando nombre:", err));
  };

  // Manejar abrazo
  const handleHug = () => {
    const token = localStorage.getItem('token');

    // Llamada al endpoint
    fetch(`http://localhost:8080/api/pets/${id}/hug`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(updatedPet => {
        setPet(updatedPet);

        // Generar corazones animados
        generateHearts();
      })
      .catch(err => console.error("Error al abrazar:", err));
  };

  // Generar corazones animados
  const generateHearts = () => {
    const newHearts = [];
    const screenWidth = window.innerWidth;

    // Generar corazones en la parte inferior de la pantalla
    for (let i = 0; i < 15; i++) {
      newHearts.push({
        id: Date.now() + i,
        x: Math.random() * screenWidth, // Posición horizontal aleatoria
        bottom: 0, // Comienzan en la parte inferior
        size: 20 + Math.random() * 30,
        speed: 1 + Math.random() * 3,
        //opacity: 1
      });
    }

    setHearts(newHearts);
    //Limpiar corazones despues de reproducir
    setTimeout(() => setHearts([]), 3000);
  };

  if (loading) return <div style={styles.loading}>Cargando...</div>;
  if (!pet) return <div style={styles.error}>Mascota no encontrada</div>;

    function getAvatarByLevel(pet) {
      if (Array.isArray(pet.avatarStages) && pet.avatarStages.length > 0) {
        const index = Math.min((pet.level || 1) - 1, pet.avatarStages.length - 1);
        const stage = pet.avatarStages[index];
        if (stage) {
          return stage;
        }
      }

      if (pet.avatar) {
        return `/assets/avatars/${pet.avatar}`;
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
          position: "relative"
        }}
      >
        {/* Capa blanca semitransparente */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            zIndex: 0,
            pointerEvents: "none"
          }}
        />

        {/* Contenido principal */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={styles.header}>
            <div ref={avatarContainerRef} style={styles.avatarContainer}>

                        {/* Imagen base */}
    	<img
          src={getAvatarByLevel(pet)}
          alt={pet.name}
          style={styles.avatarBase}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/avatars/the-gang.png";
          }}
        />

              {/* Capas de recompensas como accesorios */}
              {pet.rewards?.map((reward, index) => (
                <img
                  key={index}
                  src={`/assets/accessories/${reward}.png`}
                  alt={reward}
                  style={styles.accessoryLayer}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ))}
            </div>

            {/* Nombre editable */}
            <div style={styles.nameContainer}>
              {isEditing ? (
                <div style={styles.editContainer}>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={styles.nameInput}
                    autoFocus
                  />
                  <button onClick={handleNameUpdate} style={styles.saveButton}>✓</button>
                  <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>✕</button>
                </div>
              ) : (
                <div style={styles.editContainer}>
                  <h1 style={styles.petName}>{pet.name}</h1>
                  <button onClick={() => setIsEditing(true)} style={styles.editButton} title="Editar nombre">✏️</button>
                </div>
              )}
            </div>

            {/* Botones de acciones */}
            <div style={styles.actionButtons}>
              <button onClick={handleHug} style={styles.hugButton}>
                <span style={styles.hugIcon}>🤗</span> ABRAZAR
              </button>
              <Link to={`/meditate/${pet.id}`}>
                <button style={styles.meditateButton}>
                  <span style={styles.meditateIcon}>🧘</span> MEDITAR
                </button>
              </Link>
            </div>
          </div>

          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <h3>Nivel</h3>
              <p style={styles.statValue}>{pet.level || 1}</p>
            </div>
            <div style={styles.statCard}>
              <h3>Experiencia</h3>
              <p style={styles.statValue}>{pet.experience || 0} XP</p>
            </div>
            <div style={styles.statCard}>
              <h3>Felicidad</h3>
              <p style={styles.statValue}>{pet.happiness || 100}%</p>
            </div>
          </div>

          <div style={styles.infoCard}>
            <h2>Meditación Total</h2>
            <p style={styles.meditationMinutes}>{pet.totalMeditationMinutes || 0} minutos</p>
          </div>

          {pet.rewards?.length > 0 && (
            <div style={styles.rewardsSection}>
              <h2>Premios Obtenidos</h2>
              <div style={styles.rewardsContainer}>
                {pet.rewards.map((reward, index) => (
                  <div key={index} style={styles.rewardItem}>
                    <div style={styles.rewardIcon}>🏆</div>
                    <p>{reward}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link to="/dashboard">
            <button style={styles.floatingBackButton}>⬅ Volver al Dashboard</button>
          </Link>

          {/* Animación de corazones */}

          {hearts.map(heart => (
            <div
              key={heart.id}
              style={{
                ...styles.heart,
                left: `${heart.x}px`,
                bottom: `${heart.bottom}px`,
                width: `${heart.size}px`,
                height: `${heart.size}px`,
                fontSize: `${heart.size}px`,
                animation: `floatUp ${heart.speed}s ease-out forwards`
              }}
            >
              💙
            </div>
          ))}
        </div>
      </div>
    );

}

const styles = {
  container: {
      position: 'relative',
      backgroundImage: 'url("/assets/the-temple.png")',
      backgroundSize: 'flex',
      backgroundPosition: 'center',
      minHeight: '100vh',
      padding: '2rem',
      zIndex: 0
    },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
    padding: '20px',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',        // ← nuevo: limita el ancho
    marginLeft: 'auto',       // ← centra horizontalmente
    marginRight: 'auto'       // ← centra horizontalmente
  },
  // CAMBIO CLAVE: Contenedor ovalado con enfoque en la parte superior
    avatarContainer: {
      position: 'relative',
      width: '200px',  // Ancho aumentado para el óvalo
      height: '240px', // Alto aumentado para el óvalo
      margin: '0 auto',
      marginBottom: '1.5rem',
      borderRadius: '50% / 40%', // Forma ovalada (horizontal 50%, vertical 40%)
      overflow: 'hidden', // Importante para recortar la imagen
      border: '6px solid #9966FF',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    },
    // CAMBIO CLAVE: Enfocar la parte superior de la imagen
    avatarBase: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'top' // Muestra la parte superior de la imagen
    },
    accessoryLayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 10,
      objectFit: 'cover',
      objectPosition: 'top' // Asegura que los accesorios también se alineen arriba
    },
  nameContainer: {
    margin: '1rem 0',
    minHeight: '60px'
  },
  editContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  petName: {
    margin: 0,
    fontSize: '2.2rem',
    color: '#4b0082',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  },
  nameInput: {
    padding: '10px 15px',
    fontSize: '1.5rem',
    borderRadius: '10px',
    border: '2px solid #9370db',
    width: '250px',
    textAlign: 'center',
    outline: 'none'
  },
  editButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '5px',
    color: '#6a5acd',
    transition: 'transform 0.3s',
    ':hover': {
      transform: 'scale(1.2)'
    }
  },
  saveButton: {
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    cursor: 'pointer',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    cursor: 'pointer',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '1.5rem',
    flexWrap: 'wrap'
  },
  hugButton: {
    padding: '14px 30px',
    backgroundColor: '#9966FF',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    //display: 'flex',
    alignItems: 'fixed',
    gap: '10px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 8px rgba(255, 105, 180, 0.3)',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 12px rgba(255, 105, 180, 0.4)'
    }
  },
  hugIcon: {
    fontSize: '1.2rem'
  },
  meditateButton: {
    padding: '14px 30px',
    backgroundColor: '#9966FF',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    //display: 'flex',
    alignItems: 'fixed',
    gap: '10px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 8px rgba(106, 17, 203, 0.3)',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 12px rgba(106, 17, 203, 0.4)'
    }
  },
  meditateIcon: {
    fontSize: '1.5rem'
  },
  floatingBackButton: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    backgroundColor: '#5bc0de',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '30px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#4d0a9e',
      transform: 'scale(1.05)'
    }
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '15px'
  },
  statCard: {
    backgroundColor: 'rgba(240, 245, 255, 0.9)',
    borderRadius: '15px',
    padding: '1.5rem',
    textAlign: 'center',
    minWidth: '180px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    border: '2px solid #e6e6fa'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2575fc',
    margin: '0.5rem 0',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  },
  infoCard: {
    backgroundColor: 'rgba(230, 247, 255, 0.9)',
    borderRadius: '15px',
    padding: '1.5rem',
    textAlign: 'center',
    marginBottom: '2rem',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    border: '2px solid #b0e0e6'
  },
  meditationMinutes: {
    fontSize: '2.8rem',
    fontWeight: 'bold',
    color: '#1890ff',
    margin: '0.5rem 0',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  },
  rewardsSection: {
    backgroundColor: 'rgba(255, 247, 230, 0.9)',
    borderRadius: '15px',
    padding: '1.5rem',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    border: '2px solid #f0e68c'
  },
  rewardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '1rem',
    justifyContent: 'center'
  },
  rewardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'white',
    padding: '12px 18px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    minWidth: '180px'
  },
  rewardIcon: {
    fontSize: '1.8rem'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.5rem',
    color: '#6a5acd'
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    color: '#ff0000',
    fontSize: '1.5rem'
  },
  heart: {
    position: 'fixed',
    color: 'red',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.7)',
    zIndex: 2000,
    pointerEvents: 'none',
    userSelect: 'none',
    animationFillMode: 'forwards'
  }
};

// Insertar la animación CSS en el documento
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes floatUp {
    0% {
      opacity: 1;
      bottom: 0;
      transform: translateY(0) rotate(0deg);
    }
    100% {
      opacity: 0;
      bottom: 100vh;
      transform: translateY(0) rotate(360deg);
    }
  }
`;
document.head.appendChild(styleElement);

export default PetDetailPage;