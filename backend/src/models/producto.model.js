import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    categoria: {
        type: String,
        required: true
    },
    imagen: {
        type: String
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Producto || mongoose.model('Producto', productoSchema); 