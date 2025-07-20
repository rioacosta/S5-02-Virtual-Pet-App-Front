import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function MeditationSessionPage() {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [habitat, setHabitat] = useState('forest');
  const [minutes, setMinutes] = useState(10);
  const [isMeditating, setIsMeditating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

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
            <h1>Sesión de Meditación con {pet?.name}</h1>

            <div style={styles.selectionCard}>
              <h2>Selecciona un Hábitat</h2>
              <div style={styles.habitatOptions}>
                {['forest', 'beach', 'mountain', 'space'].map((hab) => (
                  <div
                    key={hab}
                    style={{
                      ...styles.habitatOption,
                      borderColor: habitat === hab ? '#6a11cb' : '#ddd'
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
                >
                  -
                </button>
                <div style={styles.durationDisplay}>{minutes} minutos</div>
                <button
                  onClick={() => setMinutes(prev => Math.min(120, prev + 5))}
                  style={styles.durationButton}
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
          <div style={styles.meditationScreen}>
            <div style={styles.timer}>{formatTime(timeLeft)}</div>
            <div style={styles.habitatVisual}>
              {habitat === 'forest' && '🌳🌲🦌🌿🌞'}
              {habitat === 'beach' && '🏖️🌊🐚☀️🌴'}
              {habitat === 'mountain' && '⛰️🌨️🦅🌲🚶'}
              {habitat === 'space' && '🚀🌌🪐⭐🌠'}
            </div>
            <p style={styles.meditationText}>Respira profundamente...</p>
            <button
              onClick={() => setIsMeditating(false)}
              style={styles.cancelButton}
            >
              Finalizar Sesión
            </button>
          </div>
        )}
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
  selectionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '1.5rem',
    margin: '2rem 0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
    width: '120px'
  },
  habitatIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem'
  },
  habitatName: {
    fontWeight: 'bold',
    margin: 0
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
    background: '#9966FF',
    color: 'white',
    cursor: 'pointer'
  },
  durationDisplay: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    minWidth: '100px'
  },
  startButton: {
    padding: '15px 40px',
    fontSize: '1.2rem',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '1rem',
    margin: "1rem auto",
    display: "block"
  },
  meditationScreen: {
    backgroundColor: '#e6f7ff',
    borderRadius: '15px',
    padding: '3rem 2rem',
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  timer: {
    fontSize: '5rem',
    fontWeight: 'bold',
    margin: '1rem 0',
    color: '#1890ff'
  },
  habitatVisual: {
    fontSize: '3rem',
    margin: '2rem 0'
  },
  meditationText: {
    fontSize: '1.8rem',
    color: '#333',
    margin: '1rem 0'
  },
  cancelButton: {
    padding: '10px 25px',
    background: '#ff4d4f',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '2rem',
    fontWeight: 'bold'
  },
  floatingBackButton: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    backgroundColor: '#9966FF',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '30px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 1000
  }
};

export default MeditationSessionPage;