import { Link, useParams } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'
import { formatearPrecio } from '../utils/validaciones.js'

export default function DetalleProducto() {
  const { id } = useParams()
  const { buscarProducto } = useProductos()
  const producto = buscarProducto(id)
  if (!producto) {
    return (
      <div className="alert alert-danger">
        Producto no encontrado.
      </div>
    )
  }
  return (
    <div className="card">
      <div className="card-body">
        <h1 className="h3">
          Producto #{producto.id} - {producto.nombre}
        </h1>
        <p>
          <strong>Categoria:</strong> {producto.categoria}
        </p>
        <p>
          <strong>Descripcion:</strong> {producto.descripcion}
        </p>
        <p>
          <strong>Precio:</strong>{' '}
          {formatearPrecio(producto.precioAhora)}
        </p>
        <p>
          <strong>Stock:</strong> {producto.stock}
        </p>
        <div className="d-flex gap-2">
          <Link
            className="btn btn-outline-secondary"
            to="/admin/productos"
          >
            Volver
          </Link>
          <Link
            className="btn btn-perla"
            to={`/admin/productos/${producto.id}/editar`}
          >
            Editar
          </Link>
        </div>
      </div>
    </div>
  )
}