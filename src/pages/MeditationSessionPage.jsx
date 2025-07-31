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
    base_chakra: "En California, la tribu Shasta lo considera un vórtice energético entre los mundos terrenales y espirituales.",
    sacral_chakra: "Los indígenas en Perú le conocen como Isla del Sol y piensan que toda la humanidad proviene de él.",
    plexus_chakra: "Conocido como ombligo del mundo o monte de los colores cambiantes, en Australia.",
    heart_chakra: "Es conocido como uno de los lugares más místicos y espirituales de Inglaterra.",
    throat_chakra: "Giza un lugar donde entre las arenas del tiempo emerge la voz de la Tierra en Egipto.",
    third_eye_chakra: "Este volcán, a menudo llamado el techo de Bali, es un centro espiritual de los hindúes en la Isla de los Mil Templos.",
    crown_chakra: "Kailash es la montaña más sagrada de los Himalayas, la tradición Bon Tibetana lo considera la morada de los dioses",
    forest: "Un bosque tranquilo con sonidos de pájaros y brisa suave",
    beach: "Playa relajante con olas suaves y brisa marina",
    mountain: "Montañas serenas con vistas panorámicas y aire puro",
    space: "Vistas cósmicas de la inmensidad del espacio inundado de estrellas y planetas"
  };
  const habitatInspirations = {
    base_chakra: "Chakra Base Terrestre\nCuna de luz, donde el ser flota en la certeza de lo eterno.\nInhala la luz que emana del origen; aquí el alma recuerda su misión\ny se funde con el cielo interior y exterior.",
    sacral_chakra: "Chakra Sacro Terrestre\nCuna de la existencia, agua sagrada que despierta la sabiduría ancestral.\nDespierta con el corazón tu potencial dormido.\nDeja que flote tu espíritu en el amor de los ancestros.",
    plexus_chakra: "Chakra Plexo Solar Terrestre\nRoca viva que pulsa con el latido del sueño primordial.\nLa tierra roja, gris, ocre canta memorias antiguas en tonalidades armoniosas.\nCamina en silencio y escucha el sueño del mundo.",
    heart_chakra: "Chakra Corazón Terrestre\nEntre nieblas y campanas, el velo entre mundos se abre.\nEscucha el llamado del espíritu que retorna al uno\ndonde la tierra susurra al espíritu.",
    throat_chakra: " Chakra laríngeo terrestre\nBajo las estrellas eternas, el cosmos manifestado talló en piedra con manos de tiempo la Piedra\npara que los vientos que la besan revelaran el orden divino.\ntoma un momento para respirar en la geometría del alma.",
    third_eye_chakra: "Chakra Tercer Ojo Terrestre\nBelleza inmaculada, fuego sagrado que enciende la conciencia\ndesde las entrañas del universo.\nEl volcán despierta tu fuerza y eleva tu alma.",
    crown_chakra: "Chakra Coronario Terrestre\nEje del mundo, donde el silencio abraza lo divino\nEn el trono del silencio, la mente se disuelve.\nLa montaña te mira y te recuerda quién eres.",
    forest: "Todo lo que vive, respira contigo.\n Entre hojas y raíces, el bosque murmura\n en lenguajes antiguos. Cada árbol tiene una historia, cada sombra una enseñanza.\n Respira profundo y recuerda: tú también formas parte de esta danza verde que nutre la tierra.",
    beach: "Siente el pulso del mar en tu interior.\n La arena no se aferra al agua, la deja ir con cada ola que se retira.\n Así también puedes soltar lo que ya no sirve. Que tu respiración fluya como la brisa salada: suave, constante, liberadora.",
    mountain: "En la altura, el silencio se vuelve sabiduría.\n La quietud de la montaña no es ausencia de movimiento, sino presencia plena. Escucha lo que el viento susurra entre las piedras.",
    space: "Eres polvo de estrellas... y luz también.\n Tu conciencia es un universo en expansión.\n Permite que la mente flote sin rumbo, sin juicio, simplemente siendo la inmensidad del espacio inundado de estrellas y planetas"
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
        height: "100vh",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box"
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
      <div style={{ position: "relative", zIndex: 1, height: "100%",
          overflowY: "auto" }}>
        {!isMeditating ? (
          <>
            {/* Vista previa del hábitat */}
            <div style={styles.previewContainer}>
              <h2 style={{ margin: '0 0 0.3rem' }}>
                Sesión de Meditación con {buddy?.name}
              </h2>
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
              <h2>SELECCIONA UN DESTINO PARA LA SESIÓN:<br />¿Sabías que la Tierra también tiene puntos superenergéticos específicos <br /> parecidos a lo que conocemos como chakras?<br />
                    <br />Aquí puedes elegir meditar en uno de esos puntos mágicos o simplemente <br /> un destino natural de tu elección que te transportará a un lugar de paz.

                </h2>
                <div style={styles.habitatOptions}>
                {['base_chakra', 'sacral_chakra', 'plexus_chakra', 'heart_chakra', 'throat_chakra',
                    'third_eye_chakra', 'crown_chakra', 'space', 'beach', 'forest', 'mountain'].map((hab) => (
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
                      {hab === 'base_chakra' && 'Monte Shasta'}
                      {hab === 'sacral_chakra' && 'Lago Titicaca'}
                      {hab === 'plexus_chakra' && 'Monte Uluru'}
                      {hab === 'heart_chakra' && 'Glastonbury'}
                      {hab === 'throat_chakra' && 'Meseta de Giza'}
                      {hab === 'third_eye_chakra' && 'Monte Gunung Agung'}
                      {hab === 'crown_chakra' && 'Monte Kailash'}
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
             <p style={{ color: '#F5F5F5', marginTop: '1rem', fontSize: '1.1rem' }}>
               ✨ Bien hecho. Regresando... ✨
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
    marginTop: '0.2rem',
    fontSize: '1.4rem',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
    position: 'relative',
    top: '0.5rem',
  },
  habitatPreview: {
    //marginTop: "0rem",
    //margin: '0.5rem 0',
    //width: "70%",
    //height: "100%";
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  previewImage: {
    width: '85%',
    height: '390px',
    borderRadius: '12px',
    backgroundSize: 'cover',
    backgroundPosition: '50% 55%' ,// 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '0.5rem',
    marginTop: '0.5rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  previewOverlay: {
    position: 'absolute',
    //top: auto,
    bottom: 0,
    left: 0,
    right: 0,
    padding: '10px',
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    bottom: '25px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '180px',
    height: 'auto',
    zIndex: 2,
    filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))'
  },
  selectionCard: {
    textAlign: 'center',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
    fontSize: '0.95rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '0.1rem',
    margin: '1.5rem auto',
    backgroundColor: "rgba(255, 245, 238, 0.40)",
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '1000px',
    marginTop: "0.3rem",
  },
  habitatOptions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2.5rem',
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
    color: '#5a32a8',
  },
  habitatInspiration: {
      marginTop: '-17rem',
      textAlign: 'center',
      fontSize: '1.5rem',
      color: '#12090E',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      padding: '1rem',
      borderRadius: '10px',
      maxWidth: '550px',
      whiteSpace: 'pre-line',
      //backdropFilter: 'blur(4px)' // Efecto de vidrio esmerilado
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
    padding: '1rem 2rem',
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
    //backgroundColor: '#ff1d20',
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
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: "0.5rem 1.5rem",
    borderRadius: "15px",
    zIndex: 2,
    color: '#5a32a8',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  },
  avatarAndButton: {
    marginTop: "0",
    position: "absolute",
    bottom: "10px", // ubica el conjunto cerca del borde inferior
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 2,
    width: '100%',
  },
  avatarMeditating: {
    width: "220px",
    height: "auto",
    marginBottom: "0.1rem", // junta el avatar al botón
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
    fontSize: '0.80rem',
    //backgroundColor: '#ff1d20',
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
    backgroundColor: '#5bc0de',
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