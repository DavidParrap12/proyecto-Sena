import React from "react";
import { Link } from "react-router-dom";
import './styleInventario.css';

function GestionInventario() {
    return (
        <div className="contenedor">
            <div className="Header">
                <header>
                    <h1>Sistema Gestion Supermercado</h1>
                    <img className="carro" src="imagenes/carro.png" alt="diseño" />
                <hr className="lineas"/>
                <ul className="navegacion">
                    <li type="submit">
                            <Link to='/principal'>Principal</Link>
                    </li>
                    <li type="submit">
                            <Link to='/inventario'>Gestión de Inventario</Link>
                    </li>
                    <li type="submit">
                            <Link to='/registroVentas'>Registo de Ventas</Link>
                    </li>
                    <li type="submit">
                            <Link to='/ventas'>Ventas</Link>
                    </li>
                    <li>
                        <Link to='/perfil'>
                            <img className="perfil" src="imagenes/IMG_54072.jpg" alt="profile"/>
                        </Link>
                    </li>
                </ul>
                </header>
            </div>
        </div>
    )
};

export default GestionInventario