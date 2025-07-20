import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function getAvatarByLevel(pet) {
  if (!pet) return "/assets/avatarsMeditating/the-gang.png";

  if (Array.isArray(pet.avatarStages) && pet.avatarStages.length > 0) {
    const index = Math.min((pet.level || 1) - 1, pet.avatarStages.length - 1);
    const fileName = pet.avatarStages[index]?.split('/').pop();
    return `/assets/avatarsMeditating/${fileName}`;
  }
  return `/assets/avatarsMeditating/${pet.avatar || "the-gang.png"}`;
}

function MeditationSessionPage() {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [habitat, setHabitat] = useState('forest');
  const [minutes, setMinutes] = useState(10);
  const [isMeditating, setIsMeditating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  const habitatImages = {
    forest: "/assets/habitats/Woods.png",
    beach: "/assets/habitats/Beach.png",
    mountain: "/assets/habitats/Mountain.png",
    space: "/assets/habitats/Space.png"
  };

  const habitatDescriptions = {
    forest: "Un bosque tranquilo con sonidos de pájaros y brisa suave",
    beach: "Playa relajante con olas suaves y brisa marina",
    mountain: "Montañas serenas con vistas panorámicas y aire puro",
    space: "Vistas cósmicas de estrellas y planetas en la inmensidad del espacio"
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/pets/${petId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPet(data))
      .catch(err => console.error("Error al cargar mascota:", err));
  }, [petId]);

  const startMeditation = () => {
    setIsMeditating(true);
    setTimeLeft(minutes * 60);
  };

  useEffect(() => {
    let timer;
    if (isMeditating && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isMeditating && timeLeft === 0) {
      finishMeditation();
    }
    return () => clearInterval(timer);
  }, [isMeditating, timeLeft]);

  const finishMeditation = async () => {
    setIsMeditating(false);
    const token = localStorage.getItem('token');

    try {
      await fetch(`http://localhost:8080/api/pets/${petId}/meditate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ minutes, habitat })
      });
      navigate(`/pet/${petId}`);
    } catch (err) {
      console.error('Error al guardar meditación:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
      {/* Capa blanca semitransparente en el fondo */}
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

      {/* Contenido principal encima */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {!isMeditating ? (
          <>
            <h1 style={styles.title}>Sesión de Meditación con {pet?.name}</h1>

            {/* Vista previa del hábitat */}
            <div style={styles.previewContainer}>
              <h2>Vista Previa del Hábitat</h2>
              <div style={styles.habitatPreview}>
                <div
                  style={{
                    ...styles.previewImage,
                    backgroundImage: `url(${habitatImages[habitat]})`,
                    position: 'relative'
                  }}
                >
                  <div style={styles.previewOverlay}>
                    <p style={styles.habitatDescription}>{habitatDescriptions[habitat]}</p>
                  </div>
                  <img
                    src={getAvatarByLevel(pet)}
                    alt={pet?.name}
                    style={styles.previewAvatar}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/avatars/the-gang.png";
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={styles.selectionCard}>
              <h2>Selecciona un Hábitat</h2>
              <div style={styles.habitatOptions}>
                {['forest', 'beach', 'mountain', 'space'].map((hab) => (
                  <div
                    key={hab}
                    style={{
                      ...styles.habitatOption,
                      borderColor: habitat === hab ? '#6a11cb' : '#ddd',
                      backgroundColor: habitat === hab ? '#f0e6ff' : '#fff'
                    }}
                    onClick={() => setHabitat(hab)}
                  >
                    <div style={styles.habitatIcon}>
                      {hab === 'forest' && '🌲'}
                      {hab === 'beach' && '🏖️'}
                      {hab === 'mountain' && '⛰️'}
                      {hab === 'space' && '🚀'}
                    </div>

                    <p style={styles.habitatName}>
                      {hab === 'forest' && 'Bosque'}
                      {hab === 'beach' && 'Playa'}
                      {hab === 'mountain' && 'Montaña'}
                      {hab === 'space' && 'Espacio'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.selectionCard}>
              <h2>Duración de la Sesión</h2>
              <div style={styles.durationControl}>
                <button
                  onClick={() => setMinutes(prev => Math.max(1, prev - 5))}
                  style={styles.durationButton}
                  aria-label="Reducir duración"
                >
                  -
                </button>
                <div style={styles.durationDisplay}>{minutes} minutos</div>
                <button
                  onClick={() => setMinutes(prev => Math.min(120, prev + 5))}
                  style={styles.durationButton}
                  aria-label="Aumentar duración"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={startMeditation}
              style={styles.startButton}
            >
              Comenzar Meditación
            </button>

            <Link to="/dashboard">
              <button style={styles.floatingBackButton}>⬅ Volver al Dashboard</button>
            </Link>
          </>
        ) : (
          <div style={{
            ...styles.meditationScreen,
            backgroundImage: `url(${habitatImages[habitat]})`
          }}>
            <div style={styles.timerOverlay}>{formatTime(timeLeft)}</div>

            <div style={styles.avatarAndButton}>
              <img
                src={getAvatarByLevel(pet)}
                alt={pet?.name}
                style={styles.avatarMeditating}
              />
              <button
                onClick={() => setIsMeditating(false)}
                style={styles.cancelButton}
              >
                Finalizar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  title: {
    textAlign: 'center',
    color: '#5a32a8',
    marginBottom: '2rem',
    fontSize: '2.5rem',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  },
  previewContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: '15px',
    padding: '1.5rem',
    margin: '2rem auto',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
    maxWidth: '800px'
  },
  habitatPreview: {
    margin: '1rem 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  previewImage: {
    width: '100%',
    height: '300px',
    borderRadius: '12px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '10px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'white',
    textAlign: 'center',
    fontSize: '1.1rem'
  },
  habitatDescription: {
    margin: 0,
    fontWeight: '500'
  },
  previewAvatar: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '180px',
    height: 'auto',
    zIndex: 2,
    filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))'
  },
  selectionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '1.5rem',
    margin: '2rem auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '800px'
  },
  habitatOptions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    marginTop: '1rem',
    flexWrap: 'wrap'
  },
  habitatOption: {
    border: '2px solid #ddd',
    borderRadius: '10px',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    width: '120px',
    textAlign: 'center',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
    }
  },
  habitatIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem'
  },
  habitatName: {
    fontWeight: 'bold',
    margin: 0,
    color: '#333'
  },
  durationControl: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    marginTop: '1rem'
  },
  durationButton: {
    width: '50px',
    height: '50px',
    fontSize: '1.5rem',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(145deg, #9966FF, #7a4fcc)',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'scale(1.05)'
    },
    '&:active': {
      transform: 'scale(0.95)'
    }
  },
  durationDisplay: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    minWidth: '100px',
    textAlign: 'center',
    color: '#5a32a8'
  },
  startButton: {
    padding: '15px 40px',
    fontSize: '1.2rem',
    background: 'linear-gradient(145deg, #4CAF50, #3d8b40)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    margin: '1rem auto',
    display: "block",
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    transition: 'all 0.3s',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.25)'
    }
  },
  meditationScreen: {
    borderRadius: '15px',
    padding: '3rem 2rem',
    minHeight: '85vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    margin: '0 auto',
    maxWidth: '900px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    // Añade estas propiedades:
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },
  timerOverlay: {
    position: "absolute",
    top: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "4rem",
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: "0.5rem 1.5rem",
    borderRadius: "15px",
    zIndex: 2,
    color: '#5a32a8',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  },
  avatarAndButton: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    zIndex: 2,
    width: '100%'
  },
  avatarMeditating: {
    width: "220px",
    height: "auto",
    filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.3))'
  },
  cancelButton: {
    padding: '12px 30px',
    background: 'linear-gradient(145deg, #ff4d4f, #cc3e40)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },
  floatingBackButton: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    background: 'linear-gradient(145deg, #9966FF, #7a4fcc)',
    color: 'white',
    padding: '12px 25px',
    borderRadius: '30px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    transition: 'all 0.3s',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)'
    }
  }
};

export default MeditationSessionPage;