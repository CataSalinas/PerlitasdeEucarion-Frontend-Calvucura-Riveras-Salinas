import { Link } from 'react-router-dom'
export default function CompraExitosa() {
  return (
    <div className="text-center py-5">
      <i className="bi bi-check-circle display-1 text-success"></i>
      <h1 className="h2 mt-3">Compra realizada correctamente!!</h1>
      <p>Gracias por comprar en Perlitas de Eucarión!!</p>
      <Link className="btn btn-perla mt-2" to="/productos">Volver a productos</Link>
    </div>
  )
}