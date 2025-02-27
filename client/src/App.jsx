// import { useState } from 'react'; // Remove the unused import statement
import Ingreso from './pages/Ingreso';
import './styles/index.css';
import './styles/reset.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import GestionInventario from './GestionInventario';
import RegistroVentas from './RegistroVentas'; // Importa el componente RegistroVentas

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/ingreso' element={<Ingreso />} />
        <Route path='/principal' element={<Dashboard />} />
        <Route path='/inventario' element={<GestionInventario />} />
        <Route path='/registro-ventas' element={<RegistroVentas />} /> {/* Usa el componente importado */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
