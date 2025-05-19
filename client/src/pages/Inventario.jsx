import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DynamicLabel from '../components/DynamicLabel';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import '../styles/styleInventario.css';  // Fixed the path (removed extra dot)
import { productService } from '../services/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


function GestionInventario() {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [productoEditando, setProductoEditando] = useState(null);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        categoria: "",
        precio: "",
        cantidad: ""
    });
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:3005/api/productos');
            setProductos(response.data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    };

    const handleAgregar = async () => {
        // Validaciones
        if (
            !nuevoProducto.nombre.trim() ||
            !nuevoProducto.descripcion.trim() ||
            !nuevoProducto.categoria.trim() ||
            !nuevoProducto.precio ||
            !nuevoProducto.cantidad
        ) {
            alert("Por favor, completa todos los campos.");
            return;
        }
        if (isNaN(nuevoProducto.precio) || Number(nuevoProducto.precio) <= 0) {
            alert("El precio debe ser un número positivo.");
            return;
        }
        if (isNaN(nuevoProducto.cantidad) || Number(nuevoProducto.cantidad) < 0) {
            alert("La cantidad debe ser un número igual o mayor a 0.");
            return;
        }

        try {
            await axios.post(
                'http://localhost:3005/api/productos',
                nuevoProducto,
                { withCredentials: true }
            );
            setNuevoProducto({ nombre: "", categoria: "", precio: "", cantidad: "" });
            fetchProductos();
            alert("¡Producto agregado exitosamente!");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert("Error al agregar producto: " + error.response.data.message);
            } else {
                alert("Error al agregar producto. Revisa la consola.");
            }
            console.error("Error al agregar producto:", error);
        }
    };

    const handleEditar = async (id) => {
        if (productoEditando === id) {
            try {
                const productoActualizado = productos.find(p => p._id === id);
                await axios.put(`http://localhost:3005/api/productos/${id}`, productoActualizado);
                setProductoEditando(null);
                fetchProductos();
            } catch (error) {
                console.error("Error al actualizar producto:", error);
            }
        } else {
            setProductoEditando(id);
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Está seguro de eliminar este producto?")) {
            try {
                await axios.delete(`http://localhost:3005/api/productos/${id}`);
                fetchProductos();
            } catch (error) {
                console.error("Error al eliminar producto:", error);
            }
        }
    };

    const handleBuscar = (e) => {
        setBusqueda(e.target.value);
    };

    // Función para exportar a Excel
    const exportarAExcel = () => {
        // Crear una copia de los datos para manipularlos
        const datosParaExportar = productos.map(producto => ({
            'Nombre': producto.nombre,
            'Categoría': producto.categoria,
            'Precio': producto.precio,
            'Cantidad': producto.cantidad,
            'Fecha de Actualización': new Date().toLocaleString()
        }));

        // Crear un libro de trabajo
        const libro = XLSX.utils.book_new();
        
        // Crear una hoja de cálculo con los datos
        const hoja = XLSX.utils.json_to_sheet(datosParaExportar);
        
        // Añadir la hoja al libro
        XLSX.utils.book_append_sheet(libro, hoja, "Inventario");
        
        // Generar el archivo binario
        const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
        
        // Crear un Blob con el archivo
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        
        // Guardar el archivo
        saveAs(blob, `Inventario_SGS_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
    };
    
    // Función para importar desde Excel
    const importarDesdeExcel = (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        const lector = new FileReader();
        lector.onload = (evento) => {
            try {
                const datos = new Uint8Array(evento.target.result);
                const libro = XLSX.read(datos, { type: 'array' });
                
                // Obtener la primera hoja
                const nombreHoja = libro.SheetNames[0];
                const hoja = libro.Sheets[nombreHoja];
                
                // Convertir a JSON
                const datosJSON = XLSX.utils.sheet_to_json(hoja);
                
                // Procesar los datos importados
                const productosImportados = datosJSON.map(item => ({
                    nombre: item['Nombre'],
                    categoria: item['Categoría'],
                    precio: parseFloat(item['Precio']),
                    cantidad: parseInt(item['Cantidad'])
                }));
                
                // Aquí puedes decidir si quieres reemplazar todo el inventario
                // o solo actualizar los productos existentes
                
                // Por ejemplo, actualizar productos existentes:
                const productosActualizados = [...productos];
                
                productosImportados.forEach(productoImportado => {
                    const index = productosActualizados.findIndex(
                        p => p.nombre === productoImportado.nombre
                    );
                    
                    if (index !== -1) {
                        // Actualizar producto existente
                        productosActualizados[index] = {
                            ...productosActualizados[index],
                            ...productoImportado
                        };
                    } else {
                        // Agregar nuevo producto
                        productosActualizados.push(productoImportado);
                    }
                });
                
                // Actualizar el estado
                setProductos(productosActualizados);
                
                // Opcional: Sincronizar con el backend cuando haya conexión
                // productosActualizados.forEach(producto => actualizarProductoEnBackend(producto));
                
                alert('Inventario importado correctamente');
            } catch (error) {
                console.error('Error al importar el archivo:', error);
                alert('Error al importar el archivo. Verifica que sea un archivo Excel válido.');
            }
        };
        
        lector.readAsArrayBuffer(archivo);
    };

    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="contenedor-inventario">
            <Navbar />
            
            <div className="contenido-inventario">
                <h2>Gestión de Inventario</h2>
                
                {/* Botones para exportar e importar Excel */}
                <div className="export-controls">
                    <button onClick={exportarAExcel} className="excel-button">
                        <i className="fas fa-file-excel"></i>
                        Exportar a Excel
                    </button>
                    
                    <div className="import-control">
                        <label htmlFor="import-excel" className="excel-import-button">
                            <i className="fas fa-upload"></i>
                            Importar desde Excel
                        </label>
                        <input
                            type="file"
                            id="import-excel"
                            accept=".xlsx, .xls"
                            style={{ display: 'none' }}
                            onChange={importarDesdeExcel}
                        />
                    </div>
                </div>
                
                <div className="acciones-inventario">
                    <button className="btn-agregar" onClick={() => setProductoEditando('nuevo')}>
                        <span>➕</span> Agregar Producto
                    </button>
                    <div className="buscar-producto">
                        <input 
                            type="search" 
                            placeholder="Buscar producto..." 
                            value={busqueda}
                            onChange={handleBuscar}
                        />
                    </div>
                </div>

                {productoEditando === 'nuevo' && (
                    <div className="form-producto">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nuevoProducto.nombre}
                            onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="Categoría"
                            value={nuevoProducto.categoria}
                            onChange={e => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
                        />
                        <input
                            type="number"
                            placeholder="Precio"
                            value={nuevoProducto.precio}
                            onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
                        />
                        <input
                            type="number"
                            placeholder="Cantidad"
                            value={nuevoProducto.cantidad}
                            onChange={e => setNuevoProducto({...nuevoProducto, cantidad: e.target.value})}
                        />
                        <button onClick={handleAgregar}>Guardar</button>
                        <button onClick={() => setProductoEditando(null)}>Cancelar</button>
                    </div>
                )}

                <div className="tabla-productos">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosFiltrados.map(producto => (
                                <tr key={producto._id}>
                                    <td>
                                        {productoEditando === producto._id ? (
                                            <input
                                                value={producto.nombre}
                                                onChange={e => {
                                                    const newProductos = productos.map(p =>
                                                        p._id === producto._id ? {...p, nombre: e.target.value} : p
                                                    );
                                                    setProductos(newProductos);
                                                }}
                                            />
                                        ) : producto.nombre}
                                    </td>
                                    <td>
                                        {productoEditando === producto._id ? (
                                            <input
                                                value={producto.categoria}
                                                onChange={e => {
                                                    const newProductos = productos.map(p =>
                                                        p._id === producto._id ? {...p, categoria: e.target.value} : p
                                                    );
                                                    setProductos(newProductos);
                                                }}
                                            />
                                        ) : producto.categoria}
                                    </td>
                                    <td>
                                        {productoEditando === producto._id ? (
                                            <input
                                                type="number"
                                                value={producto.precio}
                                                onChange={e => {
                                                    const newProductos = productos.map(p =>
                                                        p._id === producto._id ? {...p, precio: e.target.value} : p
                                                    );
                                                    setProductos(newProductos);
                                                }}
                                            />
                                        ) : `$${producto.precio}`}
                                    </td>
                                    <td>
                                        {productoEditando === producto._id ? (
                                            <input
                                                type="number"
                                                value={producto.cantidad}
                                                onChange={e => {
                                                    const newProductos = productos.map(p =>
                                                        p._id === producto._id ? {...p, cantidad: e.target.value} : p
                                                    );
                                                    setProductos(newProductos);
                                                }}
                                            />
                                        ) : producto.cantidad}
                                    </td>
                                    <td>
                                        <button 
                                            className="btn-accion btn-editar"
                                            onClick={() => handleEditar(producto._id)}
                                        >
                                            <span>✏️</span> {productoEditando === producto._id ? 'Guardar' : 'Editar'}
                                        </button>
                                        <button 
                                            className="btn-accion btn-eliminar"
                                            onClick={() => handleEliminar(producto._id)}
                                        >
                                            <span>🗑️</span> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GestionInventario;


