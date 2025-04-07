import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistroForm from './components/RegistroForm';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import LogoutButton from './components/LogoutButton';
import './App.css';


function Confirmacion() {
  return (
    <div className="container">
      <h2>Inicio de sesión exitoso</h2>
      <p>¡Bienvenido, estás registrado!</p>
      <LogoutButton />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistroForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/confirmacion" element={<Confirmacion />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
