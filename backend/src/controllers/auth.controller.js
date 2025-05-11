// src/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { createAccessToken } from '../libs/jwt.js';
import { TOKEN_SECRET } from '../config.js';
import Venta from '../models/venta.model.js';
import Producto from '../models/producto.model.js';
import Promocion from '../models/promocion.model.js';

export const login = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        
        // Log the attempt
        console.log('Login attempt:', { email, username });

        // Buscar usuario por email o username
        let userFound;
        
        if (email) {
            userFound = await User.findOne({ email });
        } else if (username) {
            userFound = await User.findOne({ username });
        } else {
            return res.status(400).json({ message: "Debes proporcionar un email o nombre de usuario" });
        }
        
        if (!userFound || !(await bcrypt.compare(password, userFound.password))) {
            return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
        }

        const token = await createAccessToken({ id: userFound._id });

        res.cookie('token', token);
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userFound = await User.findOne({ email });
        
        if (userFound) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const userSaved = await newUser.save();
        const token = await createAccessToken({ id: userSaved._id });

        res.cookie('token', token);
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            role: userSaved.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const logout = (req, res) => {
    res.cookie('token', '', { expires: new Date(0) });
    return res.sendStatus(200);
};

export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "No token, autorización denegada" });

    try {
        const user = jwt.verify(token, TOKEN_SECRET);
        
        const userFound = await User.findById(user.id);
        if (!userFound) return res.status(401).json({ message: "Usuario no encontrado" });

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role
        });
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

export const profile = async (req, res) => {
    try {
        const userFound = await User.findById(req.user.id);
        if (!userFound) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role
        });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const principal = async (req, res) => {
    try {
        // Obtener ingresos totales
        const ventas = await Venta.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$total" }
                }
            }
        ]);

        // Obtener cantidad total de productos
        const cantidadProductos = await Producto.countDocuments();

        // Obtener productos más vendidos
        const productosVendidos = await Venta.aggregate([
            { $unwind: "$productos" },
            {
                $group: {
                    _id: "$productos.producto",
                    cantidadVendida: { $sum: "$productos.cantidad" }
                }
            },
            { $sort: { cantidadVendida: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "productos",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productoInfo"
                }
            },
            { $unwind: "$productoInfo" },
            {
                $project: {
                    _id: 1,
                    nombre: "$productoInfo.nombre",
                    cantidadVendida: 1
                }
            }
        ]);

        // Obtener productos con stock bajo (menos de 10 unidades)
        const stockBajo = await Producto.find({ stock: { $lt: 10 } })
            .select('nombre stock')
            .limit(5);

        // Obtener ventas recientes
        const ventasRecientes = await Venta.find()
            .sort({ fecha: -1 })
            .limit(5)
            .select('cliente total fecha');

        // Obtener promociones activas
        const promociones = await Promocion.find({ activa: true })
            .select('nombre descuento')
            .limit(5);

        res.json({
            ingresos: ventas[0]?.total || 0,
            cantidadProductos,
            productosVendidos,
            stockBajo,
            ventasRecientes,
            promociones
        });
    } catch (error) {
        console.error('Error en principal:', error);
        res.status(500).json({ message: "Error al obtener datos del principal" });
    }
};

