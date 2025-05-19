import Producto from '../models/producto.model.js';

export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProducto = async (req, res) => {
    try {
        const { nombre, categoria, precio, stock } = req.body;
        const nuevoProducto = new Producto({
            nombre,
            categoria,
            precio,
            stock
        });
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json(productoGuardado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const productoActualizado = await Producto.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!productoActualizado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(productoActualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const productoEliminado = await Producto.findByIdAndDelete(id);
        if (!productoEliminado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};