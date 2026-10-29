import { Link } from 'react-router-dom'
import { useOrdenes } from '../context/OrdenesContext.jsx'
import { formatearPrecio } from '../utils/validaciones.js'

export default function AdministrarOrdenes() {
  const { ordenes, cambiarEstado } = useOrdenes()
  return (
    <>
      <div className="mb-3">
        <h1 className="h3 mb-1">Administrar ordenes</h1>
        <p className="mb-0">Listado de compras realizadas</p>
      </div>
      {ordenes.length === 0 ? (
        <div className="alert alert-info">No hay ordenes registradas.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.id}</td>
                  <td>{orden.cliente.nombre} {orden.cliente.apellidos}</td>
                  <td>{orden.cliente.correo}</td>
                  <td>{formatearPrecio(orden.total)}</td>
                  <td>
                    <select className="form-select form-select-sm" style={{ width: '150px' }} value={orden.estado}
                      onChange={(e) => cambiarEstado(orden.id, e.target.value)}>
                      <option value="Pagado">Pagado</option>
                      <option value="En preparacion">En preparacion</option>
                      <option value="Entregado">Entregado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td>
                    <Link className="btn btn-sm btn-outline-perla" to={`/admin/ordenes/${orden.id}`}>Ver</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}