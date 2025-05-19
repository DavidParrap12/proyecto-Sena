// src/models/Producto.js
import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    // Eliminamos descripcion aquí temporalmente
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        trim: true
    },
    cantidad: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        min: [0, 'El stock no puede ser negativo'],
        default: 0
    }
}, {
    timestamps: true
});

// Ahora volvemos a agregar descripcion como opcional
productoSchema.add({
    descripcion: {
        type: String,
        trim: true
    }
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;