import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './estilos.css'
import App from './App.jsx'
import { CarritoProvider } from './context/CarritoContext.jsx'
import { ProductosProvider } from './context/ProductosContext.jsx'
import { OrdenesProvider } from './context/OrdenesContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ProductosProvider url="/productos.json">
      <CarritoProvider>
        <OrdenesProvider>
          <App />
        </OrdenesProvider>
      </CarritoProvider>
    </ProductosProvider>
  </BrowserRouter>
)