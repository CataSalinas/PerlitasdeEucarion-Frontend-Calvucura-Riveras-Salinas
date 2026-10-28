import { useState } from 'react'
import { useCarrito } from '../context/CarritoContext.jsx'
import { formatearPrecio } from '../utils/validaciones.js'

export default function ProductCard({ producto }) {
  const { agregar } = useCarrito()
  const [error, setError] = useState(null)

  function manejarAgregar() {
    setError(agregar(producto))
  }

  return (
    <div className="card card-producto h-100">
      <div className="card-body d-flex flex-column">
        <small className="text-muted">{producto.categoria}</small>
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text small">{producto.descripcion}</p>
        <div className="mt-auto">
          <div className="d-flex flex-column mb-2">
            <span className="precio-antes text-decoration-line-through">{formatearPrecio(producto.precioAntes)}</span>
            <span className="precio-ahora">{formatearPrecio(producto.precioAhora)}</span>
          </div>
          <small className="text-muted d-block mb-2">Stock disponible: {producto.stock}</small>
          <div className="d-grid">
            <button className="btn btn-perla" onClick={manejarAgregar}>Añadir</button>
          </div>
          {error && <div className="mensaje-error mt-2" role="alert">{error}</div>}
        </div>
      </div>
    </div>
  )
}
