import { Link, NavLink } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext.jsx'
import { formatearPrecio } from '../utils/validaciones.js'

export default function Navbar() {
  const { total, cantidadTotal } = useCarrito()
  return (
    <nav className="navbar navbar-expand-lg bg-perla-suave border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Perlitas de Eucarión</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-label="Abrir menú">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/" end>Inicio</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/productos">Productos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/categorias">Categorias</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/registrar">Registrar producto</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/admin/productos">Administrar productos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/ofertas">Ofertas</NavLink></li>
          </ul>
          <Link className="btn btn-perla" to="/carrito">
            <i className="bi bi-cart4"></i> Carrito ({cantidadTotal}) <strong>{formatearPrecio(total)}</strong>
          </Link>
        </div>
      </div>
    </nav>
  )
}
