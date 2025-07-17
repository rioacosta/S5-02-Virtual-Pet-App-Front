// src/pages/CreatePetPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const CreatePetPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [petName, setPetName] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const availablePets = [
    { id: 1, name: "Luli", image: "public/assets/avatars/Luli.png" },
    { id: 2, name: "Lele", image: "public/assets/avatars/Lele.png" },
    { id: 3, name: "Lilo", image: "public/assets/avatars/Lilo.png" },
    { id: 4, name: "Lolo", image: "public/assets/avatars/Lolo.png" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!petName.trim()) {
      setError("¡Por favor ingresa un nombre para tu buddy!");
      return;
    }

    if (!selectedPet) {
      setError("¡Selecciona un buddy primero!");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8080/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: petName,
          avatar: selectedPet.image,
          ownerId: userId
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear buddy');
      }

      toast.success("🐾 ¡Buddy creado exitosamente!");
      navigate('/dashboard');

    } catch (err) {
      console.error('Error:', err);
      toast.error("⚠️ Hubo un problema al crear tu buddy");
      setError('Error al crear buddy');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Crear Un Nuevo Buddy</h1>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre de tu Buddy:</label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Ej: Pepe, Pipo, Paco..."
              maxLength={20}
              style={styles.input}
              disabled={isSubmitting}
            />
            <small style={styles.counter}>{petName.length}/20 caracteres</small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Selecciona un Buddy:</label>
            <div style={styles.petsGrid}>
              {availablePets.map(pet => (
                <div
                  key={pet.id}
                  style={{
                    ...styles.petOption,
                    borderColor: selectedPet?.id === pet.id ? '#6a11cb' : '#ddd',
                    transform: selectedPet?.id === pet.id ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onClick={() => setSelectedPet(pet)}
                >
                  <div style={styles.petImageContainer}>
                    <img
                      src={pet.image}
                      alt={pet.name}
                      style={styles.petImage}
                    />
                  </div>
                  <p style={styles.petName}>{pet.name}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span style={styles.spinner}></span> Creando...
              </>
            ) : (
              "Crear Buddy"
            )}
          </button>
          <Link to="/dashboard">
            <button style={styles.floatingBackButton}>⬅ Volver al Dashboard</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

// Estilos mejorados
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '1rem',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '800px',
    textAlign: 'center'
  },
  title: {
    color: '#4a4a4a',
    marginBottom: '1.5rem',
    fontSize: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.8rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '600',
    color: '#4a4a4a',
    textAlign: 'left',
    fontSize: '1.1rem',
    marginBottom: '0.5rem'
  },
  input: {
    padding: '12px 15px',
    borderRadius: '10px',
    border: '2px solid #e0e0e0',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
    outline: 'none',
    '&:focus': {
      borderColor: '#6a11cb'
    }
  },
  counter: {
    textAlign: 'right',
    color: '#888',
    fontSize: '0.85rem'
  },
  petsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1.5rem',
    marginTop: '0.5rem'
  },
  petOption: {
    border: '2px solid #ddd',
    borderRadius: '12px',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#f9f9f9',
    '&:hover': {
      backgroundColor: '#f0f0f0'
    }
  },
  petImageContainer: {
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.8rem'
  },
  petImage: {
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain'
  },
  petName: {
    fontWeight: '600',
    color: '#333',
    margin: 0
  },
  floatingBackButton: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    backgroundColor: '#6a11cb',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '30px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 1000
  },
  submitButton: {
    padding: '14px 20px',
    backgroundColor: '#6a11cb',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '1rem',
    '&:disabled': {
      backgroundColor: '#9e9e9e',
      cursor: 'not-allowed'
    },
    '&:hover:not(:disabled)': {
      backgroundColor: '#4d0d9e'
    }
  },
  spinner: {
    border: '3px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTop: '3px solid white',
    width: '20px',
    height: '20px',
    animation: 'spin 1s linear infinite'
  },
  errorAlert: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontWeight: '500'
  }
};

// Añade esto en tu CSS global para la animación del spinner
// O puedes usar styled-components si prefieres
document.head.insertAdjacentHTML(
  'beforeend',
  '<style>@keyframes spin {0% { transform: rotate(0deg); }100% { transform: rotate(360deg); }}</style>'
);

export default CreatePetPage;