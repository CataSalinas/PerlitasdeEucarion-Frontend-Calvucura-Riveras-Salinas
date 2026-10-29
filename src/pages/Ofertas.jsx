import { useProductos } from '../context/ProductosContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function Ofertas() {
  const { productos, cargando, error } = useProductos()
  const ofertas = productos.filter((p) => p.precioAntes > p.precioAhora)
  if (cargando) return <p>Cargando ofertas...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <h1 className="h3 mb-4">Ofertas</h1>
      {ofertas.length === 0 ? (
        <div className="alert alert-info">No hay productos en oferta actualmente.</div>
      ) : (
        <div className="row g-3">
          {ofertas.map((producto) => (
            <div className="col-12 col-sm-6 col-lg-4" key={producto.id}>
              <ProductCard producto={producto} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}