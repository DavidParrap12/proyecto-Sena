// src/routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Ruta para el login
router.post('/login', async (req, res) => {
    try {
    const { username, password } = req.body;

    // Aquí deberías buscar el usuario en la base de datos
    // Por simplicidad, asumimos que el usuario existe y tiene la siguiente estructura
    const user = {
        username: 'admin',
        password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Zf4z5a5EixZaYVK1fsbw1ZfbX3OXe' // Contraseña encriptada
    };

    if (username !== user.username) {
        return res.status(400).send('Usuario no encontrado');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).send('Contraseña incorrecta');
    }

    const token = jwt.sign({ username: user.username }, 'secretKey', { expiresIn: '1h' });
    res.send({ token });
});

export default router;