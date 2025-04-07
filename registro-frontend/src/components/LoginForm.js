import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';


export default function LoginForm() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await API.post('/login', { correo, contrasena });
      localStorage.setItem('token', res.data.token);

      // Decodificar el token para extraer el rol
      const decoded = JSON.parse(atob(res.data.token.split('.')[1]));

      if (decoded.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/confirmacion');
      }
    } catch (err) {
      console.error(err);
      setMsg('Correo o contraseña incorrectos');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {msg && <p style={{ color: 'red' }}>{msg}</p>}
    </div>
  );
}
