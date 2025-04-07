import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';


export default function RegistroForm() {
  const [form, setForm] = useState({
    nombre: '',
    edad: '',
    correo: '',
    contrasena: '',
    telefono: ''
  });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/register', form);
      setMsg('¡Registro exitoso!');
    } catch (err) {
      setMsg('Error al registrar');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <input name="edad" type="number" placeholder="Edad" onChange={handleChange} required />
        <input name="correo" type="email" placeholder="Correo" onChange={handleChange} required />
        <input name="contrasena" type="password" placeholder="Contraseña" onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" onChange={handleChange} required />
        <button type="submit">Registrarse</button>
      </form>

      {msg && <p>{msg}</p>}

      {/* Botón para ir a login */}
      <p>¿Ya tienes cuenta?</p>
      <button onClick={() => navigate('/login')}>Iniciar sesión</button>
    </div>
  );
}
