import { Link } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'
import { formatearPrecio } from '../utils/validaciones.js'

export default function AdministrarProductos() {
  const {
    productos,
    cargando,
    error,
    eliminarProducto
  } = useProductos()
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="h3 mb-1">Administrar productos</h1>
          <p className="mb-0">Listado de productos</p>
        </div>
        <Link className="btn btn-perla" to="/registrar">
          Nuevo producto
        </Link>
      </div>
      {cargando && <p>Cargando productos...</p>}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoria</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>{formatearPrecio(producto.precioAhora)}</td>
                <td>{producto.stock}</td>
                <td>
                  <div className="d-flex gap-2 flex-wrap">
                    <Link
                      className="btn btn-sm btn-outline-perla"
                      to={`/admin/productos/${producto.id}`}
                    >
                      Ver
                    </Link>
                    <Link
                      className="btn btn-sm btn-outline-perla"
                      to={`/admin/productos/${producto.id}/editar`}
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}