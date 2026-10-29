import { useState } from 'react'
import { useProductos } from '../context/ProductosContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
export default function Categorias() {
  const { productos, cargando, error } = useProductos()
  const [categoria, setCategoria] = useState('')
  const categorias = [...new Set(productos.map((p) => p.categoria))]
  const categoriaActiva = categoria || categorias[0] || ''
  const productosFiltrados = productos.filter((p) => p.categoria === categoriaActiva)
  if (cargando) return <p>Cargando categorias...</p>
  if (error) return <div className="alert alert-danger">{error}</div>
  return (
    <>
      <h1 className="h3 mb-4">Categorias</h1>
      <div className="row g-3 mb-4">
        {categorias.map((c) => (
          <div className="col-6 col-md-3" key={c}>
            <button type="button" className={'card w-100 h-100 p-3 text-center ' + (categoriaActiva === c ? 'border-danger' : '')} onClick={() => setCategoria(c)}>
              <strong>{c}</strong>
              <small className="text-muted">{productos.filter((p) => p.categoria === c).length} productos</small>
            </button>
          </div>
        ))}
      </div>
      <h2 className="h4 mb-3">{categoriaActiva}</h2>
      <div className="row g-3">
        {productosFiltrados.map((producto) => (
          <div className="col-12 col-sm-6 col-lg-4" key={producto.id}>
            <ProductCard producto={producto} />
          </div>
        ))}
      </div>
    </>
  )
}