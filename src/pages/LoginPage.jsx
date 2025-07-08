import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`, {
        username,
        password
      });
      alert('Login successful');
      console.log(response.data);
    } catch (error) {
      alert('Login failed');
      console.error(error);
    }
  };

  return (
   <div
     style={{
       backgroundImage: 'url("src/assets/the temple... Puedes crear una imagen de un templo por dentro sera un templo dedicado a la espiritualidad queer y no dual, en estilo naive y colores pasteles.png")',
       backgroundSize: 'cover',
       backgroundPosition: 'center',
       height: '100vh',
       display: 'flex',
       justifyContent: 'center',
       alignItems: 'center'
     }}
   >
     <form onSubmit={handleLogin} style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '2rem', borderRadius: '8px' }}>
       <h1>Login</h1>
       <input
         type="text"
         value={username}
         onChange={(e) => setUsername(e.target.value)}
         placeholder="Username"
       />
       <input
         type="password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         placeholder="Password"
       />
       <button type="submit">Login</button>
     </form>
   </div>

  );
}
