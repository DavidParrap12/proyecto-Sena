import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import axios from 'axios'

function Ingreso () {
        const [email, setEmail] = useState()
        const [password, setPassword] = useState()
        const navigate = useNavigate()

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const response = await
    axios.post("http://localhost:9940/ingreso", {email, password});
            alert(response.data);
                if(result.data === "Permitido"){
                    navigate('/principal')
                }
            
            }catch (error) {
                console.error("Error al ingresar", error)
            };
        }        
    return (
        <div className="container">
        <div className='header'>
            <h1>SGS</h1>
            <img className="carro" src="imagenes/carro.png" alt="diseño" />
        </div>
            <div className="left-section">
            <img className= "imagenPrincipal" src="imagenes/imagenPo.jpg" alt="Dashboard Illustration" />
            </div>
            <div className="right-section">
            <h1 className='sesion'>Inicio de Sesión</h1>
            <form>
                <div className="form-group">
                <label htmlFor="email" className='clave-Usuario'>Ingrese su usuario o contraseña</label>
                <input type="email" id="email" placeholder="usuario@ejemplo.com" 
                onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="form-group">
                <label htmlFor="contraseña" className='clave-Usuario'>Contraseña</label>
                <input type="password" id="contraseña" placeholder="********" 
                onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <Link to= '/principal' type="submit" className='link'><a>Ingresar</a></Link>
            </form>
            </div>
        </div>

    
    );
}

export default Ingreso;