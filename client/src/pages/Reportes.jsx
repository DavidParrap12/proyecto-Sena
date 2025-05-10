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
        cantidad: []
    });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reportes', {
                    withCredentials: true
                });
                setReportData(response.data);
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
                        <h3>Productos en Cantidad</h3>
                        <p className="stat-value">{reportData.cantidad.length}</p>
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
                    </div>
                </div>

                <div className="cantidad-table">
                    <h3>Estado del Inventario</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad Actual</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.cantidad.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.nombre}</td>
                                    <td>{item.cantidad}</td>
                                    <td>
                                        <span className={`cantidad-status ${
                                            item.cantidad > 10 ? 'good' :
                                            item.cantidad > 5 ? 'warning' : 'critical'
                                        }`}>
                                            {item.cantidad > 10 ? 'Óptimo' :
                                                item.cantidad > 5 ? 'Bajo' : 'Crítico'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reportes;