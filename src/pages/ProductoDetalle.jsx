import { Link, useParams } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'
import { useCarrito } from '../context/CarritoContext.jsx'
import { formatearPrecio } from '../utils/validaciones.js'

export default function ProductoDetalle() {
  const { id } = useParams()
  const { buscarProducto } = useProductos()
  const { agregar } = useCarrito()
  const producto = buscarProducto(id)

  if (!producto) return <div className="alert alert-danger">Producto no encontrado.</div>

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="card">
          <div className="card-body">
            <small className="text-muted">{producto.categoria}</small>
            <h1 className="h3">{producto.nombre}</h1>
            <p>{producto.descripcion}</p>

            {producto.precioAntes > producto.precioAhora && (
              <p className="text-decoration-line-through text-muted mb-0">{formatearPrecio(producto.precioAntes)}</p>
            )}

            <h2 className="precio">{formatearPrecio(producto.precioAhora)}</h2>
            <p>Stock disponible: {producto.stock}</p>

            <div className="d-flex gap-2">
              <Link className="btn btn-outline-secondary" to="/productos">Volver</Link>
              <button className="btn btn-perla" onClick={() => agregar(producto)}>Añadir al carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}