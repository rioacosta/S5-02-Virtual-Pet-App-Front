import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function PetDetailPage() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/pets/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPet(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar mascota:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={styles.loading}>Cargando...</div>;
  if (!pet) return <div style={styles.error}>Mascota no encontrada</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
       <div style={styles.avatarContainer}>
         {/* Imagen base */}
         <img
           src={pet.avatarUrl || "/default-avatar.png"}
           alt={pet.name}
           style={styles.avatarBase}
         />

         {/* Capas de recompensas como accesorios */}
         {pet.rewards?.map((reward, index) => (
           <img
             key={index}
             src={`/assets/accessories/${reward}.png`} // 💡 Usa carpeta pública
             alt={reward}
             style={styles.accessoryLayer}
             onError={(e) => { e.target.style.display = 'none'; }} // evita error si falta imagen
           />
         ))}
       </div>
        <h1>{pet.name}</h1>
        <Link to={`/meditate/${pet.id}`}>
          <button style={styles.meditateButton}>MEDITAR</button>
        </Link>
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
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  avatarContainer: {
    position: 'relative',
    width: '150px',
    height: '150px',
    margin: '0 auto',
    marginBottom: '1rem'
  },
  avatarBase: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '5px solid #6a11cb'
  },
  accessoryLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' // evita clics sobre el accesorio
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '5px solid #6a11cb',
    marginBottom: '1rem'
  },
  meditateButton: {
    padding: '12px 25px',
    backgroundColor: '#6a11cb',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: '#f0f5ff',
    borderRadius: '10px',
    padding: '1rem',
    textAlign: 'center',
    width: '30%',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#2575fc',
    margin: '0.5rem 0'
  },
  infoCard: {
    backgroundColor: '#e6f7ff',
    borderRadius: '10px',
    padding: '1.5rem',
    textAlign: 'center',
    marginBottom: '2rem',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
  },
  meditationMinutes: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1890ff',
    margin: '0.5rem 0'
  },
  rewardsSection: {
    backgroundColor: '#fff7e6',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
  },
  rewardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '1rem'
  },
  rewardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'white',
    padding: '10px 15px',
    borderRadius: '8px'
  },
  rewardIcon: {
    fontSize: '1.5rem'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem'
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    color: 'red',
    fontSize: '1.2rem'
  }
};

export default PetDetailPage;