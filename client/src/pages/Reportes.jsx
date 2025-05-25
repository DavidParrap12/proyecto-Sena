import React, { useState, useEffect } from "react";
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
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import "../styles/styleReportes.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Reportes = () => {
    const [reportData, setReportData] = useState({
        ventas: [],
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
                    ingresos: response.data.ingresos || 0,
                    inventario: response.data.inventario || []
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
                </div>

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
            </div>
        </div>
    );
};

export default Reportes;