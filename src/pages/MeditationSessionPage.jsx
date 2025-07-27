import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function getAvatarByLevel(buddy) {
  if (!buddy) return "/assets/avatarsNOGB/the-gang.png";

  if (Array.isArray(buddy.avatarStages) && buddy.avatarStages.length > 0) {
    const index = Math.min((buddy.level || 1) - 1, buddy.avatarStages.length - 1);
    const fileName = buddy.avatarStages[index]?.split('/').pop();
    return `/assets/avatarsNOBG/${fileName}`;
  }
  return `/assets/avatarsNOGB/${buddy.avatar || "the-gang.png"}`;
}

function MeditationSessionPage() {
  const { buddyId } = useParams();
  const [buddy, setBuddy] = useState(null);
  const [habitat, setHabitat] = useState('space');
  const [minutes, setMinutes] = useState(10);
  const [isMeditating, setIsMeditating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();
  const [hearts, setHearts] = useState([]);
  const startSound = new Audio('/assets/sounds/ending-sound.mp3');
  const endSound = new Audio('/assets/sounds/ending-sound.mp3');


  const habitatIcon = {
    base_chakra_icon: "/assets/chakras/Chakra_Base.png",
    sacral_chakra_icon: "/assets/chakras/Chakra_Sacral.png",
    plexus_chakra_icon: "/assets/chakras/Chakra_Plexus.png",
    heart_chakra_icon: "/assets/chakras/Chakra_Heart.png",
    throat_chakra_icon: "/assets/chakras/Chakra_Throat.png",
    third_eye_chakra_icon: "/assets/chakras/Chakra_Third_Eye.png",
    crown_chakra_icon: "/assets/chakras/Chakra_Crown.png",
  };

  const habitatImages = {
    base_chakra: "/assets/habitats/1Mount_Shasta.png",
    sacral_chakra: "/assets/habitats/2Titikaka_Lake.png",
    plexus_chakra: "/assets/habitats/3Uluru.png",
    heart_chakra: "/assets/habitats/4Chalice_Well.png",
    throat_chakra: "/assets/habitats/5Giza_Piramid.png",
    third_eye_chakra: "/assets/habitats/6Gunung_Agung.png",
    crown_chakra: "/assets/habitats/7Mount_Kailash.png",
    forest: "/assets/habitats/Woods.png",
    beach: "/assets/habitats/Beach.png",
    mountain: "/assets/habitats/Mountain.png",
    space: "/assets/habitats/Space.png"
  };

  const habitatDescriptions = {
    base_chakra: "El Monte Shasta es la cola del dragón, el Monte Rainer es su boca o cabeza. Esta es la base del sistema energético del planeta.",
    sacral_chakra: "Lago Titikaka este es el centro mundial de la creación de nuevas especies y los avances evolutivos significativos de las especies existentes.",
    plexus_chakra: "Uluru desde donde emerge la voz de la Tierra, es único entre los centros sagrados planetarios.",
    heart_chakra: "Chalice Well, ubicado en Glastonbury, Somerset, es conocido como uno de los lugares más místicos y espirituales de Inglaterra.",
    throat_chakra: "Giza es considerado como el chakra de la garganta; lugar de donde emerge la voz de la Tierra. Este chakra es vital para la estructura de la Tierra.",
    third_eye_chakra: "El Monte Agung, este volcán a menudo llamado el techo de Bali, ofrece impresionantes panoramas y una belleza natural sagrada. Como centro espiritual de los hindúes en la Isla de los Mil Templos.",
    crown_chakra: "Kailash es la montaña más sagrada de los Himalayas y es el centro del Chakra Coronario Terrestre.",
    forest: "Un bosque tranquilo con sonidos de pájaros y brisa suave",
    beach: "Playa relajante con olas suaves y brisa marina",
    mountain: "Montañas serenas con vistas panorámicas y aire puro",
    space: "Vistas cósmicas de estrellas y planetas en la inmensidad del espacio"
  };
  const habitatInspirations = {
    base_chakra: "Piensa en mares rojos.",
    sacral_chakra: "Algunas palabras.",
    plexus_chakra: "Algunas palabras.",
    heart_chakra: "Algunas palabras.",
    throat_chakra: "Algunas palabras.",
    third_eye_chakra: "Algunas palabras.",
    crown_chakra: "Algunas palabras.",
    forest: "🌲 Respira profundo. Siente cómo el bosque te abraza.",
    beach: "🌊 Escucha las olas. Cada una limpia tus pensamientos.",
    mountain: "⛰️ Observa la cima. Tu mente también puede llegar allí.",
    space: "🚀 Flota libre. No hay gravedad para tus preocupaciones."
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/buddys/${buddyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setBuddy(data))
      .catch(err => console.error("Error al cargar mascota:", err));
  }, [buddyId]);

  const startMeditation = () => {
    try {
        startSound.currentTime = 0;
        startSound.play();

        backgroundSound.currentTime = 0;
        backgroundSound.play();
      } catch (e) {
        console.warn('No se pudo reproducir el sonido:', e);
      }

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

    const generateHearts = () => {
    const newHearts = [];
    const screenWidth = window.innerWidth;

    for (let i = 0; i < 15; i++) {
      newHearts.push({
        id: Date.now() + i,
        x: Math.random() * screenWidth,
        bottom: 0,
        size: 20 + Math.random() * 30,
        speed: 1 + Math.random() * 20,
      });
    }

    setHearts(newHearts);
    setTimeout(() => setHearts([]), 3000);
  };

  const finishMeditation = async () => {
    try {
      endSound.currentTime = 0;
      await endSound.play();
    } catch (e) {
      console.warn("No se pudo reproducir el sonido de finalización:", e);
    }

    generateHearts();

    const token = localStorage.getItem('token');

    try {
      await fetch(`http://localhost:8080/api/buddys/${buddyId}/meditate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ minutes, habitat })
      });

    // ⏱ Esperar 3 segundos para mostrar los corazones antes de navegar
    setTimeout(() => {
      setIsMeditating(false);
      navigate(`/buddys/${buddyId}`);
    }, 11000);

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
        backgroundSize: "fixed",
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
            {/* Vista previa del hábitat */}
            <div style={styles.previewContainer}>
              <h2>Sesión de Meditación con {buddy?.name}</h2>
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
                    src={getAvatarByLevel(buddy)}
                    alt={buddy?.name}
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
              <h2>SELECCIONA UN DESTINO PARA TU SESIÓN</h2>
              <div style={styles.habitatOptions}>
                {['base_chakra', 'sacral_chakra', 'plexus_chakra', 'heart_chakra', 'throat_chakra', 'third_eye_chakra', 'crown_chakra', 'forest', 'beach', 'mountain', 'space'].map((hab) => (
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
                      {hab === 'base_chakra' && <img src={habitatIcon.base_chakra_icon}
                                                    alt="Base Chakra"
                                                    style={{ width: '3rem', height: '3rem' }}
                                                  />}
                      {hab === 'sacral_chakra' && <img src={habitatIcon.sacral_chakra_icon}
                                                    alt="Sacral Chakra"
                                                    style={{ width: '3rem', height: '3rem' }}
                                                  />}
                      {hab === 'plexus_chakra' && <img src={habitatIcon.plexus_chakra_icon}
                                                    alt="Plexus Chakra"
                                                    style={{ width: '3rem', height: '3rem' }}
                                                  />}
                      {hab === 'heart_chakra' && <img src={habitatIcon.heart_chakra_icon}
                                                    alt="Heart Chakra"
                                                    style={{ width: '3rem', height: '3rem' }}
                                                  />}
                      {hab === 'throat_chakra' && <img src={habitatIcon.throat_chakra_icon}
                                                       alt="Throat Chakra"
                                                       style={{ width: '3rem', height: '3rem' }}
                                                    />}
                      {hab === 'third_eye_chakra' && <img src={habitatIcon.third_eye_chakra_icon}
                                                       alt="Throat Chakra"
                                                       style={{ width: '3rem', height: '3rem' }}
                                                    />}
                      {hab === 'crown_chakra' && <img src={habitatIcon.crown_chakra_icon}
                                                       alt="Throat Chakra"
                                                       style={{ width: '3rem', height: '3rem' }}
                                                    />}
                      {hab === 'forest' && '🌲'}
                      {hab === 'beach' && '🏖️'}
                      {hab === 'mountain' && '⛰️'}
                      {hab === 'space' && '🚀'}
                    </div>

                    <p style={styles.habitatName}>
                      {hab === 'base_chakra' && 'Chakra Base Terrestre'}
                      {hab === 'sacral_chakra' && 'Chakra Sacro Terrestre'}
                      {hab === 'plexus_chakra' && 'Chakra Plexo Solar Terrestre'}
                      {hab === 'heart_chakra' && 'Chakra Corazón Terrestre'}
                      {hab === 'throat_chakra' && 'Chakra Laríngeo Terrestre'}
                      {hab === 'third_eye_chakra' && 'Chakra Tercer Ojo Terrestre'}
                      {hab === 'crown_chakra' && 'Chakra Coronario Terrestre'}
                      {hab === 'forest' && 'Bosque Vivo'}
                      {hab === 'beach' && 'Playa Fresca'}
                      {hab === 'mountain' && 'Montaña Mistica'}
                      {hab === 'space' && 'Espacio Sideral'}
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
            <p style={styles.habitatInspiration}>
                {habitatInspirations[habitat]}
              </p>
            <div style={styles.timerOverlay}>{formatTime(timeLeft)}</div>

            <div style={styles.avatarAndButton}>
              <img
                src={getAvatarByLevel(buddy)}
                alt={buddy?.name}
                style={styles.avatarMeditating}
              />
              <button
                onClick={() => setIsMeditating(false)}
                style={styles.cancelButton}
              >
                Finalizar Sesión
              </button>

           {/*Aquí insertas el mensaje de transición */}
           {hearts.length > 0 && (
             <p style={{ color: '#5a32a8', marginTop: '1rem', fontSize: '1.1rem' }}>
               ✨ Bien hecho. Regresando...
             </p>
           )}

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
        )}
      </div>
    </div>
  );
}

const styles = {
  previewContainer: {
    textAlign: 'center',
    color: '#5a32a8',
    marginBottom: '2rem',
    fontSize: '1.5rem',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
    position: 'relative',
    top: '-2rem',

  },
  habitatPreview: {
    margin: '1rem 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  previewImage: {
    width: '70%',
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
    //top: auto,
    bottom: 0,
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
    textAlign: 'center',
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
  habitatInspiration: {
  marginTop: '-30rem',
  fontSize: '1.2rem',
  color: '#555',
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  padding: '1rem',
  borderRadius: '10px',
  maxWidth: '600px'
  },
  startButton: {
    padding: '15px 40px',
    fontSize: '1.2rem',
    background: '#66CC66',
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
    //backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%'  // Estira la imagen para llenar el contenedor
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
  heart: {
      position: 'fixed',
      color: 'red',
      textShadow: '0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.7)',
      zIndex: 2000,
      pointerEvents: 'none',
      userSelect: 'none',
      animationFillMode: 'forwards'
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
    backgroundColor: '#5bc0de',    color: 'white',
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

export default MeditationSessionPage;