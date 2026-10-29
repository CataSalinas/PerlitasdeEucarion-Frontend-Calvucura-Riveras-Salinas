import { useState } from 'react'
import { useCarrito } from '../context/CarritoContext.jsx'
import { formatearPrecio } from '../utils/validaciones.js'
import { Link } from 'react-router-dom'

export default function ProductCard({ producto }) {
  const { agregar } = useCarrito()
  const [error, setError] = useState(null)

  const enOferta = producto.precioAntes > producto.precioAhora
  const descuento = enOferta ? Math.round((1 - producto.precioAhora / producto.precioAntes) * 100) : 0

  function manejarAgregar() {
    setError(agregar(producto))
  }

  return (
    <div className="card card-producto h-100 position-relative overflow-hidden">

      {enOferta && <div className="oferta-franja">{descuento}% OFF</div>}

      <div className="card-body d-flex flex-column">
        <small className="text-muted">{producto.categoria}</small>
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text small">{producto.descripcion}</p>

        <div className="mt-auto">
          <div className="mb-2">
            {enOferta && <p className="text-decoration-line-through text-muted mb-0">{formatearPrecio(producto.precioAntes)}</p>}
            <h3 className="precio mb-0">{formatearPrecio(producto.precioAhora)}</h3>
          </div>
          
          <small className="text-muted d-block mb-2">Stock disponible: {producto.stock}</small>
          
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary w-50" to={`/productos/${producto.id}`}>Ver detalle</Link>
            <button className="btn btn-perla w-50" onClick={manejarAgregar}>Añadir</button>
            </div>

          {error && <div className="mensaje-error mt-2" role="alert">{error}</div>}
        </div>
      </div>
    </div>
  )
}