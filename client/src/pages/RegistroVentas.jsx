import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/styleRegistroVentas.css";

const RegistroVentas = () => {
    const [formData, setFormData] = useState({
        cliente: "",
        producto: "",
        cantidad: 1
    });
    const [productos, setProductos] = useState([]);
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [total, setTotal] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/productos');
                setProductosDisponibles(response.data);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        };
        fetchProductos();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const agregarProducto = () => {
        const productoSeleccionado = productosDisponibles.find(
            ({ _id }) => _id === formData.producto
        );

        if (!productoSeleccionado) {
            return;
        }

        const { _id, nombre, precio } = productoSeleccionado;
        const cantidad = parseInt(formData.cantidad);

        setProductos(prevProductos => [
            ...prevProductos,
            {
                id: Date.now(),
                _id,
                nombre,
                cantidad,
                precio,
                subtotal: precio * cantidad
            }
        ]);
        setTotal(prevTotal => prevTotal + (precio * cantidad));
        setFormData(prev => ({ ...prev, producto: "", cantidad: 1 }));
    };

    const registrarVenta = async () => {
        if (!formData.cliente || !productos.length) {
            return;
        }

        const ventaData = {
            cliente: formData.cliente,
            productos: productos.map(({ _id, cantidad }) => ({ 
                producto: _id, 
                cantidad 
            })),
            total,
            vendedor: user._id,
            fecha: new Date()
        };

        try {
            await axios.post('http://localhost:5000/api/ventas', ventaData, {
                withCredentials: true
            });
            
            // Reset all states at once
            setFormData({ cliente: "", producto: "", cantidad: 1 });
            setProductos([]);
            setTotal(0);
            alert("Venta registrada exitosamente");
        } catch (error) {
            console.error("Error al registrar la venta:", error);
            alert("Error al registrar la venta");
        }
    };

    const eliminarProducto = (id) => {
        const producto = productos.find(p => p.id === id);
        setTotal(prevTotal => prevTotal - producto.subtotal);
        setProductos(prevProductos => prevProductos.filter(p => p.id !== id));
    };

    return (
        <div className="registro-ventas-container">
            <Navbar />
            <div className="registro-ventas">
                <h2>Registro de Ventas</h2>

                <div className="form-group">
                    <label>Cliente:</label>
                    <input
                        type="text"
                        name="cliente"
                        placeholder="Nombre del cliente"
                        value={formData.cliente}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="producto-selector">
                    <select 
                        name="producto"
                        value={formData.producto}
                        onChange={handleInputChange}
                    >
                        <option value="">Seleccionar producto</option>
                        {productosDisponibles.length > 0 ? (
                            productosDisponibles.map(prod => (
                                <option key={prod._id} value={prod._id}>
                                    {prod.nombre} - ${prod.precio}
                                </option>
                            ))
                        ) : (
                            <option disabled>Cargando productos...</option>
                        )}
                    </select>
                    <input
                        type="number"
                        name="cantidad"
                        min="1"
                        value={formData.cantidad}
                        onChange={handleInputChange}
                    />
                    <button 
                        onClick={agregarProducto}
                        disabled={!formData.producto || formData.cantidad < 1}
                        className="btn-agregar"
                    >
                        <span>➕</span> Agregar
                    </button>
                </div>

                <div className="tabla-carrito">
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unit.</th>
                                <th>Subtotal</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((prod) => (
                                <tr key={prod.id}>
                                    <td>{prod.nombre}</td>
                                    <td>{prod.cantidad}</td>
                                    <td>${prod.precio}</td>
                                    <td>${prod.subtotal}</td>
                                    <td>
                                        <button 
                                            onClick={() => eliminarProducto(prod.id)}
                                            className="btn-eliminar"
                                        >
                                            <span>🗑️</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="total-section">
                    <h3>Total: ${total.toLocaleString()}</h3>
                    <button 
                        className="btn-registrar"
                        onClick={registrarVenta}
                        disabled={!formData.cliente || productos.length === 0}
                    >
                        <span>💾</span> Registrar Venta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistroVentas;
