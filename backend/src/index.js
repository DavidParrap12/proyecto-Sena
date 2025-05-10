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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

console.log('MongoDB URI:', process.env.MONGO_URI);

// Conectar a MongoDB
// MongoDB connection with options
mongoose.connect(process.env.MONGO_URI, {
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Remove this second app.listen call
// app.listen(port, () => {
//     console.log(`Servidor corriendo en http://localhost:${port}`);
// });









