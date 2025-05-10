// src/components/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';  // Remove BrowserRouter import
import Ingreso from '../pages/Ingreso.jsx';
import Principal from '../pages/Principal.jsx';
import Inventario from '../pages/Inventario.jsx';
import RegistroVentas from '../pages/RegistroVentas';
import Reportes from '../pages/Reportes.jsx';
import Ajustes from '../pages/Ajustes.jsx';
import '../styles/index.css';
import '../styles/reset.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Ingreso />} />
      <Route path="/ingreso" element={<Ingreso />} />
      <Route path="/principal" element={<Principal />} />  // Asegúrate que esta ruta exista
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/ventas" element={<RegistroVentas />} />
      <Route path="/reportes" element={<Reportes />} />
      <Route path="/ajustes" element={<Ajustes />} />
    </Routes>
  );
}

export default App;
