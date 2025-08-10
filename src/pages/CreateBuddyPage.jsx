// src/pages/CreateBuddyPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const CreateBuddyPage = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const userId = localStorage.getItem('userId');
  const [buddyName, setBuddyName] = useState('');
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const availableBuddys = [
    { id: 1, name: "", image: "public/assets/avatars/Luli.png" },
    { id: 2, name: "", image: "public/assets/avatars/Lilo.png" },
    { id: 3, name: "", image: "public/assets/avatars/Lele.png" },
    { id: 4, name: "", image: "public/assets/avatars/Lolo.png" },
    { id: 5, name: "", image: "public/assets/avatars/Loli.png" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!buddyName.trim()) {
      setError("¡Por favor ingresa un nombre para tu buddy!");
      return;
    }

    if (!selectedBuddy) {
      setError("¡Selecciona un buddy primero!");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/api/buddys/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: buddyName,
          avatar: selectedBuddy.image,
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
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "3rem",
          minHeight: "100vh",
          padding: "1rem",
          }}>
        <div style={styles.card}>
          <h1 style={styles.title}>Crear Un Nuevo Buddy</h1>

          {error && <div style={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nombre de tu Buddy:</label>
              <input
                type="text"
                value={buddyName}
                onChange={(e) => setBuddyName(e.target.value)}
                placeholder="Ej: Flor, Pau, Serena, Pepe..."
                maxLength={20}
                style={styles.input}
                disabled={isSubmitting}
              />
              <small style={styles.counter}>{buddyName.length}/20 caracteres</small>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Selecciona un Buddy:</label>
              <div style={styles.buddysGrid}>
                {availableBuddys.map(buddy => (
                  <div
                    key={buddy.id}
                    style={{
                      ...styles.buddyOption,
                      borderColor: selectedBuddy?.id === buddy.id ? '#6a11cb' : '#ddd',
                      transform: selectedBuddy?.id === buddy.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                    onClick={() => setSelectedBuddy(buddy)}
                  >
                    <div style={styles.buddyImageContainer}>
                      <img
                        src={buddy.image.replace('public/', '/')}
                        alt={buddy.name}
                        style={styles.buddyImage}
                      />
                    </div>
                    <p style={styles.buddyName}>{buddy.name}</p>
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
    </div>
  );

};

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
    backgroundColor: "rgba(255, 245, 238, 0.65)",
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
   buddysGrid: {
     display: 'grid',
     gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
     gap: '3rem',
     justifyItems: 'center',
     width: '100%'
   },
  buddyOption: {
    border: '2px solid #ddd',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: "rgba(240, 255, 240, 0.50)",
    width: '150px',
    height: '170px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
 buddyImageContainer: {
   width: '150px',
   height: '150px',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   overflow: 'hidden',
   borderRadius: '6px',
   marginBottom: '0.5rem'
 },
  buddyImage: {
    maxHeight: '105%',
    maxWidth: '105%',
    objectFit: 'contain'
  },
  buddyName: {
    fontWeight: '600',
    color: '#333',
    margin: 0
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
    zIndex: 1000
  },
  submitButton: {
    padding: '14px 20px',
    backgroundColor: '#9966FF',
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

export default CreateBuddyPage;