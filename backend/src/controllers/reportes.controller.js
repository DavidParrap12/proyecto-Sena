import Venta from '../models/venta.model.js';

export const generarReporte = async (req, res) => {
    try {
        // Ejemplo: obtener todas las ventas
        const ventas = await Venta.find().populate('productos.producto');
        res.json({ ventas });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar el reporte' });
    }
};