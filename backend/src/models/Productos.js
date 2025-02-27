// src/models/Producto.js
import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    descripcion: String,
    categoria: String,
    stock: Number
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;