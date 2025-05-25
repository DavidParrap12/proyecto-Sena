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
    const [codigoBusqueda, setCodigoBusqueda] = useState("");
    const [productoEncontrado, setProductoEncontrado] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://localhost:3005/api/productos');
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
        if (!productos.length) {
            alert("Debes agregar al menos un producto.");
            return;
        }

        if (!user || !(user._id || user.id)) {
            alert("No hay usuario autenticado. Por favor, inicia sesión nuevamente.");
            console.error("Usuario no autenticado o sin _id:", user);
            return;
        }

        const vendedorId = user._id || user.id;

        const ventaData = {
            productos: productos.map(({ _id, cantidad, precio }) => ({
                producto: _id,
                cantidad,
                precioUnitario: precio
            })),
            total,
            vendedor: vendedorId,
            fecha: new Date()
        };

        try {
            await axios.post('http://localhost:3005/api/ventas', ventaData, {
                withCredentials: true
            });

            setFormData({ producto: "", cantidad: 1 });
            setProductos([]);
            setTotal(0);
            alert("Venta registrada exitosamente");
        } catch (error) {
            console.error("Error al registrar la venta:", error.response?.data || error);
            alert("Error al registrar la venta: " + (error.response?.data?.message || "Error desconocido"));
        }
    };

    const eliminarProducto = (id) => {
        const producto = productos.find(p => p.id === id);
        setTotal(prevTotal => prevTotal - producto.subtotal);
        setProductos(prevProductos => prevProductos.filter(p => p.id !== id));
    };

    const buscarPorCodigo = async () => {
        if (!codigoBusqueda.trim()) {
            alert("Ingresa un código para buscar");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3005/api/productos/codigo/${codigoBusqueda}`);
            setProductoEncontrado(response.data);
            // Automáticamente seleccionar el producto encontrado
            setFormData(prev => ({
                ...prev,
                producto: response.data._id
            }));
        } catch (error) {
            alert("Producto no encontrado");
            setProductoEncontrado(null);
            console.error("Error al buscar producto:", error);
        }
    };

    // Función para agregar directamente desde la búsqueda
    const agregarProductoEncontrado = () => {
        if (!productoEncontrado) return;
        
        const cantidad = parseInt(formData.cantidad);
        const { _id, codigo, nombre, precio } = productoEncontrado;
    
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
        
        // Limpiar búsqueda después de agregar
        setCodigoBusqueda("");
        setProductoEncontrado(null);
        setFormData(prev => ({ ...prev, producto: "", cantidad: 1 }));
    };

    return (
        <div className="registro-ventas-container">
            <Navbar />
            <div className="registro-ventas">
                <h2>Registro de Ventas</h2>

                {/* Buscador por código mejorado */}
                <div className="buscador-codigo">
                    <h3>Buscar por Código</h3>
                    <div className="codigo-search">
                        <input
                            type="text"
                            placeholder="Ingresa el código del producto"
                            value={codigoBusqueda}
                            onChange={(e) => setCodigoBusqueda(e.target.value.toUpperCase())}
                            onKeyPress={(e) => e.key === 'Enter' && buscarPorCodigo()}
                        />
                        <button onClick={buscarPorCodigo} className="btn-buscar">
                            🔍 Buscar
                        </button>
                    </div>
                    {productoEncontrado && (
                        <div className="producto-encontrado">
                            <div className="info-producto">
                                <h4>Producto Encontrado:</h4>
                                <p><strong>Código:</strong> {productoEncontrado.codigo}</p>
                                <p><strong>Nombre:</strong> {productoEncontrado.nombre}</p>
                                <p><strong>Precio:</strong> ${productoEncontrado.precio}</p>
                                <p><strong>Stock:</strong> {productoEncontrado.cantidad} unidades</p>
                            </div>
                            <div className="acciones-producto">
                                <input
                                    type="number"
                                    name="cantidad"
                                    min="1"
                                    max={productoEncontrado.cantidad}
                                    value={formData.cantidad}
                                    onChange={handleInputChange}
                                    placeholder="Cantidad"
                                />
                                <button 
                                    onClick={agregarProductoEncontrado}
                                    className="btn-agregar-encontrado"
                                    disabled={formData.cantidad < 1 || formData.cantidad > productoEncontrado.cantidad}
                                >
                                    ➕ Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Selector tradicional de productos */}
                <div className="producto-selector">
                    <h3>O selecciona de la lista:</h3>
                    <select 
                        name="producto"
                        value={formData.producto}
                        onChange={handleInputChange}
                    >
                        <option value="">Seleccionar producto</option>
                        {productosDisponibles.length > 0 ? (
                            productosDisponibles.map(prod => (
                                <option key={prod._id} value={prod._id}>
                                    {prod.codigo} - {prod.nombre} - ${prod.precio}
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
                        placeholder="Cantidad"
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
                        disabled={productos.length === 0}
                    >
                        <span>💾</span> Registrar Venta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistroVentas;
