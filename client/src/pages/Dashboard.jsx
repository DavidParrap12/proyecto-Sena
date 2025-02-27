import React from 'react';
import ToggleButtons from './ToggleButtons';
import './Dashboard.css';

const Ingresos = () => (
    <div className="ingresos">
        <header>Ingresos Totales</header>
        <p>$Valor</p>
    </div>
);

const Productos = () => (
    <div className="productos">
        <header>Cantidad de Productos</header>
        <p>#Valor</p>
    </div>
);

const Vendidos = () => (
    <div className="vendidos">
        <header>Productos más Vendidos</header>
        <p className="can">#Cantidad</p>
    </div>
);

const Promociones = () => (
    <div className="alerta">
        <header>Promociones</header>
        <p>Productos</p>
    </div>
);

const Dashboard = () => {
    return (
        <div>
            <nav>
                {/* Contenido del nav */}
            </nav>
            <header>
                {/* Contenido del header */}
            </header>
            <div className="inprve">
                <Ingresos />
                <Productos />
                <Vendidos />
            </div>
            <div className="cualquiera">
                <Promociones />
                <ToggleButtons />
            </div>
        </div>
    );
}

export default Dashboard;