import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useProductos } from '../context/ProductosContext.jsx'

export default function Inicio() {
  const { productos, cargando, error } = useProductos()
  return (
    <>
      <section className="bg-perla rounded p-5 mb-4 text-center">
        <h1>Perlitas de Eucarión</h1>
        <p className="lead mb-3">Bisutería artesanal hecha con cariño.</p>
        <Link to="/productos" className="btn btn-light">Ver productos</Link>
      </section>
      <h2 className="h4 mb-3">Destacados</h2>
      {cargando && <p role="status">Cargando productos...</p>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-3">
        {productos.slice(0, 3).map((p) => (
          <div className="col-12 col-sm-6 col-lg-4" key={p.id}><ProductCard producto={p} /></div>
        ))}
      </div>
    </>
  )
}
