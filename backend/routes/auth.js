const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware para verificar token y rol
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ msg: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Token inválido' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado. Solo admin.' });
  }
  next();
};

// 📝 REGISTRO
router.post('/register', async (req, res) => {
  const { nombre, edad, correo, contrasena, telefono } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, edad, correo, contrasena, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, edad, correo, hashedPassword, telefono]
    );

    res.status(201).json({ msg: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al registrar usuario' });
  }
});

// 🔐 LOGIN
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

    if (result.rows.length === 0) return res.status(400).json({ msg: 'Correo no registrado' });

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);

    if (!validPassword) return res.status(401).json({ msg: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ msg: 'Inicio de sesión exitoso', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
});

// 👑 RUTA PROTEGIDA – Solo admin
router.get('/usuarios', authMiddleware, isAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, correo, edad, telefono, rol FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener usuarios' });
  }
});

module.exports = router;
