import React from "react"
import './reset.css'
import './estiloDashboard.css'


function Dashboard () {
    return (
        <div className="Contendedor">
            <div className="Header">
                <header>
                <h1>Sistema Gestion Supermercado</h1>
                <img className="carro" src="imagenes/carro.png" alt="diseño" />
                <hr className="lineas"/>
                <ul className="navegacion">
                    <li link="/principal" type="submit">Principal</li>
                    <li type="submit">Gestión de Inventario</li>
                    <li type="submit">Registo de Ventas</li>
                    <li type="submit">Ventas</li>
                </ul>
                </header>
            </div>
            <div className="inprve">
                <li className="ingresos">
                    <header>Ingresos Totales</header>
                    <p>$Valor</p>
                </li>
                <li className="Productos">
                    <header>Cantidad de Productos</header>
                    <p>#Valor</p>
                </li>
                <li className="vendidos">
                    <header>Productos más Vendidos</header>
                    <p className="can">#Cantidad</p>
                </li>
            </div>
            <div className="cualquiera">
                <div className="alerta">
                    <header>Promociones</header>
                    <p>Productos</p>
                </div>
                <div className="butto-container">
                    <label className="radio-label">
                    <span className="radio-text">Ventas Dias</span>
                    <input type="radio" name="ventas" className="radio-input" value="Ventas Dias" defaultChecked/>
                    </label>
                    <label className="radio-label">
                    <span className="radio-text">Ventas por Meses</span>
                    <input type="radio" name="ventas" className="radio-input" value="Ventas por Mes" defaultChecked/>
                    </label>
                </div>
                </div>
            </div>
    )
};

export default Dashboard