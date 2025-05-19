import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import "../styles/styleReportes.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Reportes = () => {
    const [reportData, setReportData] = useState({
        ventas: [],
        productosVendidos: [],
        ingresos: 0,
        inventario: []
    });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [fechaSeleccionada, setFechaSeleccionada] = useState('');

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const response = await axios.get('http://localhost:3005/api/reportes', {
                    withCredentials: true
                });
                setReportData({
                    ventas: response.data.ventas || [],
                    productosVendidos: response.data.productosVendidos || [],
                    ingresos: response.data.ingresos || 0,
                    inventario: response.data.cantidad || []
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching report data:', error);
                setLoading(false);
            }
        };
    
        fetchReportData();
    }, []);

    const ventasChartData = {
        labels: reportData.ventas.map(venta => venta.fecha.substring(0, 10)),
        datasets: [{
            label: 'Ventas por día',
            data: reportData.ventas.map(venta => venta.total),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    const productosChartData = {
        labels: reportData.productosVendidos.map(prod => prod.nombre),
        datasets: [{
            label: 'Productos más vendidos',
            data: reportData.productosVendidos.map(prod => prod.cantidad),
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)'
            ],
            borderWidth: 1
        }]
    };

    // Filtrar datos por la fecha seleccionada
    const datosFiltrados = fechaSeleccionada
        ? reportData.ventas.filter(d => d.fecha.substring(0, 10) === fechaSeleccionada)
        : reportData.ventas;

    // Calcular ingresos totales del filtro
    const ingresosTotales = datosFiltrados.reduce((acc, d) => acc + d.total, 0);

    const generarPDF = () => {
        const doc = new jsPDF();

        doc.text("Reporte de Ventas", 14, 15);
        doc.text(`Fecha: ${fechaSeleccionada || 'Todas'}`, 14, 25);
        doc.text(`Ventas Totales: ${datosFiltrados.length}`, 14, 35);
        doc.text(`Ingresos Totales: $${ingresosTotales}`, 14, 45);

        doc.autoTable({
            startY: 55,
            head: [['Fecha', 'Ingresos']],
            body: datosFiltrados.map(item => [item.fecha.substring(0, 10), `$${item.total}`]),
        });

        doc.save("reporte_ventas.pdf");
    };

    if (loading) {
        return <div className="loading">Cargando reportes...</div>;
    }

    return (
        <div className="reportes-container">
            <Navbar />
            <div className="reportes-content">
                <h2>Reportes y Análisis</h2>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Ingresos Totales</h3>
                        <p className="stat-value">${reportData.ingresos.toLocaleString()}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Ventas</h3>
                        <p className="stat-value">{reportData.ventas.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Productos en Inventario</h3>
                        <p className="stat-value">{reportData.inventario.length}</p>
                    </div>
                </div>

                <div className="charts-grid">
                    <div className="chart-container">
                        <h3>Ventas por Día</h3>
                        <Bar data={ventasChartData} options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: false }
                            }
                        }} />
                    </div>

                    <div className="chart-container">
                        <h3>Productos más Vendidos</h3>
                        <Pie data={productosChartData} options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'right' }
                            }
                        }} />
                        {/* Tabla de productos más vendidos */}
                        <table style={{marginTop: "20px", width: "100%"}}>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad Vendida</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.productosVendidos.length === 0 ? (
                                    <tr>
                                        <td colSpan={2}>No hay datos de productos vendidos</td>
                                    </tr>
                                ) : (
                                    reportData.productosVendidos.map((prod, idx) => (
                                        <tr key={idx}>
                                            <td>{prod.nombre}</td>
                                            <td>{prod.cantidad}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Subir el detalle de ventas aquí */}
                <div className="report-tables">
                    <h2>Detalle de Ventas</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Ingresos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.map(item => (
                                <tr key={item._id}>
                                    <td>{item.fecha.substring(0, 10)}</td>
                                    <td>${item.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Colocar el botón de PDF aquí */}
                <div className="report-controls">
                    <div className="fecha-selector">
                        <label>
                            Selecciona una fecha:
                            <input
                                type="date"
                                value={fechaSeleccionada}
                                onChange={e => setFechaSeleccionada(e.target.value)}
                            />
                        </label>
                    </div>
                    <button className="pdf-button" onClick={generarPDF}>
                        <i className="fas fa-file-pdf"></i> Generar PDF
                    </button>
                </div>

                {/* Eliminar la tabla de estado del inventario de aquí */}
                {/* <div className="cantidad-table"> ... </div> */}
            </div>
        </div>
    );
};

export default Reportes;