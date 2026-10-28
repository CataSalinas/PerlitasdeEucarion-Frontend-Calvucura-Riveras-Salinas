 import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Inicio from './pages/Inicio.jsx'
import Productos from './pages/Productos.jsx'
import Carrito from './pages/Carrito.jsx'
import RegistrarProducto from './pages/RegistrarProducto.jsx'
import AdministrarProductos from './pages/AdministrarProductos.jsx'
import DetalleProducto from './pages/DetalleProducto.jsx'
import EditarProducto from './pages/EditarProducto.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/registrar" element={<RegistrarProducto />} />
          <Route path="/admin/productos" element={<AdministrarProductos />} />
          <Route path="/admin/productos/:id" element={<DetalleProducto />} />
          <Route path="/admin/productos/:id/editar" element={<EditarProducto />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
