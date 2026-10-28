import { useCarrito } from '../context/CarritoContext.jsx'
import { formatearPrecio } from '../utils/validaciones.js'
import { Link } from 'react-router-dom'

export default function Carrito() {
  const { items, cambiarCantidad, quitar, vaciar, total } = useCarrito()
  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <h1 className="h3">Tu carrito está vacío</h1>
        <Link to="/productos" className="btn btn-perla mt-3">Ver productos</Link>
      </div>
    )
  }
  return (
    <>
      <h1 className="h3 mb-3">Carrito</h1>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.nombre}</td>
                <td>{formatearPrecio(i.precioAhora)}</td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-perla" onClick={() => cambiarCantidad(i.id, -1)}>−</button>
                    <span className="btn disabled">{i.cantidad}</span>
                    <button className="btn btn-outline-perla" onClick={() => cambiarCantidad(i.id, 1)}
                      disabled={i.cantidad >= i.stock}>+</button>
                  </div>
                </td>
                <td>{formatearPrecio(i.precioAhora * i.cantidad)}</td>
                <td><button className="btn btn-sm btn-outline-danger" onClick={() => quitar(i.id)} aria-label={'Quitar ' + i.nombre}>
                  <i className="bi bi-trash"></i></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center">
  <button className="btn btn-outline-perla" onClick={vaciar}>Vaciar carrito</button>
  <div className="d-flex align-items-center gap-3">
    <h2 className="h4 mb-0">Total: {formatearPrecio(total)}</h2>
    <Link className="btn btn-perla" to="/checkout">Continuar compra</Link>
  </div>
</div>
    </>
  ) 
}
