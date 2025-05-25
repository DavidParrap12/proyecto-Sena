// src/index.mjs
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import productoRouter from './routes/producto.routes.js';
import authRouter from './routes/auth.routes.js';
import ventasRouter from './routes/ventas.routes.js';
import reportesRouter from './routes/reportes.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3005;

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Verificar variables de entorno
console.log('Environment variables:', {
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV
});

// Conectar a MongoDB
// MongoDB connection with options
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
})
.catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

// Rutas
app.use('/api', productoRouter);
app.use('/api/auth', authRouter);
app.use('/api/ventas', ventasRouter);
app.use('/api', reportesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Al inicio de tu aplicación
if (!process.env.MONGODB_URI) {
    console.error('Error: La URL de MongoDB no está definida en el archivo .env');
    console.error('Obtén la nueva URL de Railway.com y actualiza tu archivo .env');
    process.exit(1);
}

// Puedes añadir una validación básica de formato
if (!process.env.MONGODB_URI.startsWith('mongodb://') && !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error('Error: La URL de MongoDB tiene un formato incorrecto');
    process.exit(1);
}








