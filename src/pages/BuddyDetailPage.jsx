import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BuddyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buddy, setBuddy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [hearts, setHearts] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [meditationHistory, setMeditationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const avatarContainerRef = useRef(null);

// Cargar datos del buddy
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/buddys/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("🐶 Buddy data:", data);
        setBuddy(data);
        setNewName(data.name);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar buddy:", err);
        setLoading(false);
      });
  }, [id]);

// Cargar historial de meditación
useEffect(() => {
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/buddys/${id}/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("👉 Historial recibido:", response.data);
      setMeditationHistory(response.data);
      console.log(meditationHistory)
    } catch (error) {
      console.error("❌ Error al cargar historial:", error);
      console.log("Error completo:", error);
      setMeditationHistory([]);
    }
  };

  fetchHistory();
}, [id]);

  // Manejar edición del nombre
  const handleNameUpdate = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/buddys/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...buddy, name: newName })
    })
      .then(res => res.json())
      .then(updatedBuddy => {
        setBuddy(updatedBuddy);
        setIsEditing(false);
      })
      .catch(err => console.error("Error actualizando nombre:", err));
  };

  // Manejar abrazo
  const handleHug = () => {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8080/api/buddys/${id}/hug`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(updatedBuddy => {
        setBuddy(updatedBuddy);
        generateHearts();
      })
      .catch(err => console.error("Error al abrazar:", err));
  };

  // Manejar eliminación de buddy
  const handleDeleteBuddy = () => {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8080/api/buddys/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (response.ok) {
          navigate('/dashboard');
        } else {
          console.error('Error al eliminar el buddy');
          alert('No se pudo eliminar el buddy');
        }
      })
      .catch(err => {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el buddy');
      });
  };

  // Generar corazones animados
  const generateHearts = () => {
    const newHearts = [];
    const screenWidth = window.innerWidth;

    for (let i = 0; i < 15; i++) {
      newHearts.push({
        id: Date.now() + i,
        x: Math.random() * screenWidth,
        bottom: 0,
        size: 20 + Math.random() * 30,
        speed: 1 + Math.random() * 6,
      });
    }

    setHearts(newHearts);
    setTimeout(() => setHearts([]), 3000);
  };

  // Formatear fecha para el historial
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) return <div style={styles.loading}>Cargando...</div>;
  if (!buddy) return <div style={styles.error}>Buddy no encontrado</div>;

  function getAvatarByLevel(buddy) {
    if (Array.isArray(buddy.avatarStages) && buddy.avatarStages.length > 0) {
      const index = Math.min((buddy.level || 1) - 1, buddy.avatarStages.length - 1);
      const stage = buddy.avatarStages[index];
      if (stage) {
        return stage;
      }
    }

    if (buddy.avatar) {
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
          zIndex: 0,
          pointerEvents: "none"
        }}
      />

      <button
        onClick={() => setShowDeleteConfirmation(true)}
        style={styles.deleteButtonTop}
      >
        🗑️ Eliminar Buddy
      </button>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={styles.header}>
          <div ref={avatarContainerRef} style={styles.avatarContainer}>
            <img
              src={getAvatarByLevel(buddy)}
              alt={buddy.name}
              style={styles.avatarBase}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/avatars/the-gang.png";
              }}
            />

            {buddy.rewards?.map((reward, index) => (
              <img
                key={index}
                src={`/assets/accessories/${reward}.png`}
                alt={reward}
                style={styles.accessoryLayer}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ))}
          </div>

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
                <h1 style={styles.buddyName}>{buddy.name}</h1>
                <button onClick={() => setIsEditing(true)} style={styles.editButton} title="Editar nombre">✏️</button>
              </div>
            )}
          </div>

          <div style={styles.actionButtons}>
            <button onClick={handleHug} style={styles.hugButton}>
              <span style={styles.hugIcon}>🤗</span> ABRAZAR
            </button>
            <Link to={`/meditate/${buddy.id}`}>
              <button style={styles.meditateButton}>
                <span style={styles.meditateIcon}>🧘</span> MEDITAR
              </button>
            </Link>
          </div>
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h3>Nivel</h3>
            <p style={styles.statValue}>{buddy.level || 1}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Experiencia</h3>
            <p style={styles.statValue}>{buddy.experience || 0} XP</p>
          </div>
          <div style={styles.statCard}>
            <h3>Felicidad</h3>
            <p style={styles.statValue}>{buddy.happiness || 100}%</p>
          </div>
        </div>

        <div style={styles.infoCard}>
          <h2>Meditación Total</h2>
          <p style={styles.meditationMinutes}>{buddy.totalMeditationMinutes || 0} minutos</p>
        </div>

        <div style={styles.historySection}>
          <h2
            style={styles.historyHeader}
            onClick={() => setShowHistory(!showHistory)}
          >
            Historial de Sesiones
            <span style={styles.historyToggle}>
              {showHistory ? '▲' : '▼'}
            </span>
          </h2>

          {showHistory && (
            <div style={styles.historyContent}>
              {meditationHistory.length === 0 ? (
                <p>No hay sesiones registradas aún</p>
              ) : (
                <ul style={styles.historyList}>
                  {meditationHistory.map((session, index) => (
                    <li key={index} style={styles.historyItem}>
                      <div>
                        <strong>Fecha:</strong> {formatDate(session.date || session.sessionDate)}
                      </div>
                      <div>
                        <strong>Duración:</strong> {session.minutes ?? session.duration ?? 0} minutos
                      </div>
                      <div>
                        <strong>Hábitat:</strong> {session.habitat || 'Desconocido'}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {buddy.rewards?.length > 0 && (
          <div style={styles.rewardsSection}>
            <h2>Premios Obtenidos</h2>
            <div style={styles.rewardsContainer}>
              {buddy.rewards.map((reward, index) => (
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

        {showDeleteConfirmation && (
          <div style={styles.confirmationModal}>
            <div style={styles.modalContent}>
              <h2>¿Eliminar a {buddy.name}?</h2>
              <p>Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar permanentemente a tu buddy?</p>

              <div style={styles.modalButtons}>
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  style={styles.cancelModalButton}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteBuddy}
                  style={styles.confirmDeleteButton}
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
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
  deleteButtonTop: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: '#FF6666',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '30px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: 100,
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#ff1d20',
      transform: 'scale(1.05)'
    }
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
    padding: '20px',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  avatarContainer: {
    position: 'relative',
    width: '200px',
    height: '240px',
    margin: '0 auto',
    marginBottom: '1.5rem',
    borderRadius: '50% / 40%',
    overflow: 'hidden',
    border: '6px solid #9966FF',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  },
  avatarBase: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top'
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
    objectPosition: 'top'
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
  buddyName: {
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
    alignItems: 'center',
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
    alignItems: 'center',
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
  historySection: {
    backgroundColor: 'rgba(245, 245, 245, 0.9)',
    borderRadius: '15px',
    margin: '2rem auto',
    maxWidth: '800px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
  },
  historyHeader: {
    backgroundColor: '#9966FF',
    color: 'white',
    padding: '15px 20px',
    margin: 0,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.4rem'
  },
  historyToggle: {
    fontSize: '1.2rem'
  },
  historyContent: {
    padding: '20px',
    backgroundColor: 'white'
  },
  historyList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  historyItem: {
    padding: '15px',
    borderBottom: '1px solid #eee',
    '&:last-child': {
      borderBottom: 'none'
    }
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
  },
  confirmationModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '15px',
    maxWidth: '500px',
    width: '90%',
    textAlign: 'center'
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  cancelModalButton: {
    padding: '12px 25px',
    backgroundColor: '#999',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#777'
    }
  },
  confirmDeleteButton: {
    padding: '12px 25px',
    backgroundColor: '#ff4d4f',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#ff1d20'
    }
  }
};

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

export default BuddyDetailPage;