// src/routes/productos.js
import express from 'express';
import Producto from '../models/Producto.js';

const router = express.Router();

// Ruta para crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).send(nuevoProducto);
    } catch (error) {
        res.status(400).send(error);
    }
});

export default router;