// src/index.mjs
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productosRouter from './routes/productos.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware para parsear JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((error) => console.error('Error al conectar a MongoDB:', error));

// Rutas
app.use('/productos', productosRouter);
app.use('/auth', authRouter);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto:${port}`);
});









