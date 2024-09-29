import { useState } from 'react'
import Ingreso  from './Ingreso'
import './index.css'
import './reset.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/ingreso' element={<Ingreso />}></Route>
        <Route path='/principal' element={<Dashboard />}></Route>
      </Routes>
    </BrowserRouter> 
  )
}

export default App
