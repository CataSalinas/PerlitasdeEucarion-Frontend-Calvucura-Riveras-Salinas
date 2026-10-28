import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext.jsx'
import { formatearPrecio } from '../utils/validaciones.js'
import { regiones, comunas } from '../data/zonas.js'
import { useProductos } from '../context/ProductosContext.jsx'

export default function Checkout() {
  const { items, total, vaciar } = useCarrito()
  const { descontarStock } = useProductos()
  const navigate = useNavigate()

  const [datos, setDatos] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    calle: '',
    numeroCasa: '',
    region: '',
    comuna: '',
    indicaciones: ''
  })
  const comunasFiltradas = comunas.filter((c) => c.id_region === parseInt(datos.region))
  function manejarCambio(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  function cambiarRegion(e) {
    setDatos({ ...datos, region: e.target.value, comuna: '' })
  }

  function pagar(e) {
  e.preventDefault()
  console.log('Datos cliente:', datos)
  console.log('Productos:', items)
  console.log('Total:', total)
  descontarStock(items)
  vaciar()
  navigate('/compra-exitosa')
}
  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <h1 className="h3">No hay productos para comprar</h1>
        <Link className="btn btn-perla mt-3" to="/productos">Ver productos</Link>
      </div>
    )
  }
  return (
    <>
      <h1 className="h3 mb-4">Checkout</h1>
      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h4">Carrito de compra</h2>
            <p>Revisa tus productos antes de pagar</p>
          </div>
          <p className="btn btn-perla">Total a pagar: <strong>{formatearPrecio(total)}</strong></p>
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-sm align-middle">
            <thead>
              <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.nombre}</td>
                  <td>{formatearPrecio(i.precioAhora)}</td>
                  <td>{i.cantidad}</td>
                  <td>{formatearPrecio(i.precioAhora * i.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <form onSubmit={pagar}>
        <div className="row">
          <h2 className="h4">Información del cliente</h2>
          <p>Completa la siguiente información</p>
          <div className="col-12 col-md-6 mb-3">
            <label className="form-label">Nombre *</label>
            <input className="form-control" type="text" name="nombre" value={datos.nombre} onChange={manejarCambio} required />
          </div>

          <div className="col-12 col-md-6 mb-3">
            <label className="form-label">Apellidos *</label>
            <input className="form-control" type="text" name="apellidos" value={datos.apellidos} onChange={manejarCambio} required />
          </div>

          <div className="col-12 col-md-6 mb-3">
            <label className="form-label">Correo *</label>
            <input className="form-control" type="email" name="correo" value={datos.correo} onChange={manejarCambio} required />
          </div>
        </div>

        <div className="row mt-3">
          <h2 className="h4">Dirección de entrega de los productos</h2>
          <p>Ingrese dirección de forma detallada</p>

          <div className="col-12 col-md-6 mb-3">
            <label className="form-label">Calle *</label>
            <input className="form-control" type="text" name="calle" value={datos.calle} onChange={manejarCambio} required />
          </div>

          <div className="col-12 col-md-6 mb-3">
            <label className="form-label">Número de casa *</label>
<input className="form-control" type="text" name="numeroCasa" value={datos.numeroCasa} onChange={manejarCambio} required />
          </div>

          <div className="col-12 col-md-6 mb-3">
            <label className="form-label">Región *</label>
            <select className="form-select" name="region" value={datos.region} onChange={cambiarRegion} required>
              <option value="">Seleccione una región</option>
              {regiones.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
          </div>

          <div className="col-12 col-md-6 mb-3">
            <label className="form-label">Comuna *</label>
            <select className="form-select" name="comuna" value={datos.comuna} onChange={manejarCambio} disabled={!datos.region} required>
              <option value="">Seleccione una comuna</option>
              {comunasFiltradas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Indicaciones para la entrega (opcional)</label>
            <textarea className="form-control" name="indicaciones" value={datos.indicaciones} onChange={manejarCambio} rows="3"
              placeholder="Ej.: Entre calles, color del edificio, no tiene timbre."></textarea>
          </div>

          <div className="text-end">
            <button className="btn btn-perla btn-lg" type="submit">Pagar ahora {formatearPrecio(total)}</button>
          </div>
        </div>
      </form>
    </>
  )
}