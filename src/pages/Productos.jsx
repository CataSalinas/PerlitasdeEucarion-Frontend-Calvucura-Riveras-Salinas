import { useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { useProductos } from '../context/ProductosContext.jsx'

export default function Productos() {
  const { productos, cargando, error } = useProductos()
  const [categoria, setCategoria] = useState('Todas')
  const categorias = ['Todas', ...new Set(productos.map((p) => p.categoria))]
  const visibles = categoria === 'Todas' ? productos : productos.filter((p) => p.categoria === categoria)

  return (
    <>
      <h1 className="h3 mb-3">Productos</h1>
      <div className="btn-group mb-4 flex-wrap" role="group" aria-label="Filtrar por categoría">
        {categorias.map((c) => (
          <button key={c} type="button"
            className={'btn ' + (c === categoria ? 'btn-perla' : 'btn-outline-perla')}
            onClick={() => setCategoria(c)}>{c}</button>
        ))}
      </div>
      {cargando && <p role="status">Cargando productos...</p>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-3">
        {visibles.map((p) => (
          <div className="col-12 col-sm-6 col-lg-4" key={p.id}><ProductCard producto={p} /></div>
        ))}
      </div>
    </>
  )
}
