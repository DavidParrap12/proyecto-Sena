import Venta from '../models/venta.model.js';

export const getVentas = async (req, res) => {
    try {
        const ventas = await Venta.find()
            .populate('productos.producto')
            .populate('vendedor');
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createVenta = async (req, res) => {
    try {
        const nuevaVenta = new Venta(req.body);
        const ventaGuardada = await nuevaVenta.save();
        res.status(201).json(ventaGuardada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};