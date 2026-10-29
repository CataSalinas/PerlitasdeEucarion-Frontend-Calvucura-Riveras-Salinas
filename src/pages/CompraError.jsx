import { Link } from 'react-router-dom'
export default function CompraError() {

  return (
    <div className="text-center py-5">
      <i className="bi bi-x-circle display-1 text-danger"></i>
      <h1 className="h2 mt-3">No se pudo realizar la compra</h1>
      <p>Uno o mas productos no tienen stock suficiente. Revisa el carrito e intenta nuevamente.</p>
      <div className="d-flex justify-content-center gap-2 mt-3">
        <Link className="btn btn-outline-perla" to="/carrito">Volver al carrito</Link>
        <Link className="btn btn-perla" to="/checkout">Volver a realizar el pago</Link>
      </div>
    </div>
  )
}