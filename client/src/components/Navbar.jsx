import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    // Estado para menú en dispositivos móviles
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="navbar-logo">
                <h1>SGS</h1>
            </div>

            {/* Links para las secciones */}
            <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                <li><a href="/dashboard">Inicio</a></li>
                <li><a href="/inventario">Inventario</a></li>
                <li><a href="/ventas">Ventas</a></li>
                <li><a href="/reportes">Reportes</a></li>
            </ul>

            {/* Opciones del usuario */}
            <div className="navbar-user">
                <span>Hola, Admin</span>
                <button className="logout-btn">Salir</button>
            </div>

            {/* Botón para menú en responsive */}
            <button 
                className="navbar-toggle" 
                onClick={toggleMenu} 
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
            >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>
        </nav>
    );
};

export default Navbar;
