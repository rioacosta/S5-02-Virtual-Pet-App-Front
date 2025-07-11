// src/pages/CreatePetPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreatePetPage() {
  const navigate = useNavigate();
  const [petName, setPetName] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Aquí defines las rutas a tus imágenes de mascotas
  const availablePets = [
    { id: 1, name: "Luli", image: "/src/assets/Luli.png" },
    { id: 2, name: "Lele", image: "/src/assets/Lele.png" },
    { id: 3, name: "Lilo", image: "/src/assets/Lilo.png" },
    { id: 4, name: "Lolo", image: "/src/assets/Lolo.png" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!petName.trim()) {
      setError("¡Por favor ingresa un nombre para tu mascota!");
      return;
    }

    if (!selectedPet) {
      setError("¡Selecciona una mascota primero!");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // Simulamos una petición a la API
      const response = await fetch('http://localhost:8080/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: petName,
          avatarUrl: selectedPet.image,
          type: selectedPet.name
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la mascota');
      }

      // Redirigir al dashboard después de crear
      navigate('/dashboard');

    } catch (err) {
      console.error('Error:', err);
      setError('Hubo un problema al crear tu mascota. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Crear Nueva Mascota</h1>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre de tu mascota:</label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Ej: Estrella, Paz, Serenidad..."
              maxLength={20}
              style={styles.input}
              disabled={isSubmitting}
            />
            <small style={styles.counter}>{petName.length}/20 caracteres</small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Selecciona una mascota:</label>
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
              "Crear Mascota"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

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