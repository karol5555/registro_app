
import React, { useEffect, useState } from 'react';
import API from '../api';
import LogoutButton from './LogoutButton';

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await API.get('/usuarios');
        setUsuarios(res.data);
      } catch {
        alert('No tienes acceso como admin');
      }
    };
    fetchUsuarios();
  }, []);

  return (
    <div className="container">
      <h2>Usuarios Registrados</h2>
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>{u.nombre} – {u.correo} – {u.rol}</li>
        ))}
      </ul>
      <LogoutButton />
    </div>
  );
}
