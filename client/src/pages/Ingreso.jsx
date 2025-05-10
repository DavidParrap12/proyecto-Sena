import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function Ingreso() {
    const { signin } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        identifier: '', // Puede ser email o username
        password: ''
    });

    // En la función de envío
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Determinar si es email o username
            const isEmail = formData.identifier.includes('@');
            const loginData = isEmail 
                ? { email: formData.identifier, password: formData.password }
                : { username: formData.identifier, password: formData.password };
                
            const response = await signin(loginData);
            if (response) {
                navigate('/principal');
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container">
            <div className='header'>
                <div className="navbar-logo">
                    <h1>SGS</h1>
                    <img src="/imagenes/carro.png" alt="Carro de compras" className="carro-logo" />
                </div>
            </div>
            <div className="left-section">
                <img className="imagenPrincipal" src="./imagenes/imagenPo.jpg" alt="Dashboard Illustration" />
            </div>
            <div className="right-section">
                <h1 className='sesion'>Inicio de Sesión</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="identifier" className='clave-Usuario'>Ingrese su usuario o correo</label>
                        <input 
                            type="text" 
                            id="identifier"
                            name="identifier"
                            placeholder="usuario o correo@ejemplo.com" 
                            value={formData.identifier}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className='clave-Usuario'>Contraseña</label>
                        <input 
                            type="password" 
                            id="password"
                            name="password"
                            placeholder="********" 
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <button type="submit" className='link'>Ingresar</button>
                </form>
            </div>
        </div>
    );
}

export default Ingreso;