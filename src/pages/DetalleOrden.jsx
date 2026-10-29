import { Link, useParams } from 'react-router-dom'
import { useOrdenes } from '../context/OrdenesContext.jsx'
import { formatearPrecio } from '../utils/validaciones.js'
import { regiones, comunas } from '../data/zonas.js'

export default function DetalleOrden() {
  const { id } = useParams()
  const { ordenes } = useOrdenes()
  const orden = ordenes.find((o) => o.id === parseInt(id, 10))

  if (!orden) return <div className="alert alert-danger">Orden no encontrada.</div>

  const region = regiones.find((r) => r.id === parseInt(orden.cliente.region))
  const comuna = comunas.find((c) => c.id === parseInt(orden.cliente.comuna))

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">Orden #{orden.id}</h1>
        <p className="mb-0">Estado: {orden.estado}</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5">Datos del cliente</h2>
              <p className="mb-1"><strong>Nombre:</strong> {orden.cliente.nombre} {orden.cliente.apellidos}</p>
              <p className="mb-1"><strong>Correo:</strong> {orden.cliente.correo}</p>
              <p className="mb-1"><strong>Direccion:</strong> {orden.cliente.calle} {orden.cliente.numeroCasa}</p>
              <p className="mb-1"><strong>Region:</strong> {region ? region.nombre : 'Sin region'}</p>
              <p className="mb-1"><strong>Comuna:</strong> {comuna ? comuna.nombre : 'Sin comuna'}</p>
              {orden.cliente.indicaciones && <p className="mb-0"><strong>Indicaciones:</strong> {orden.cliente.indicaciones}</p>}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5">Resumen de la compra</h2>

              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orden.productos.map((producto) => (
                      <tr key={producto.id}>
                        <td>{producto.nombre}</td>
                        <td>{producto.cantidad}</td>
                        <td>{formatearPrecio(producto.precioAhora * producto.cantidad)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-end mt-3 mb-0">
                <strong>Total: {formatearPrecio(orden.total)}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Link className="btn btn-outline-secondary mt-4" to="/admin/ordenes">Volver</Link>
    </>
  )
}