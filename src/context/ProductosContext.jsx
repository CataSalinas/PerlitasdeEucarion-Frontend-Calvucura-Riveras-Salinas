import { createContext, useContext, useEffect, useState } from 'react'
import { cargarProductos } from '../services/productosService.js'

const ProductosContext = createContext(null)

function leerExtras() {
  try {
    return JSON.parse(localStorage.getItem('productosExtra')) || []
  } catch {
    return []
  }
}

// Carga el catálogo desde JSON y suma los productos registrados por el formulario
export function ProductosProvider({ children, url }) {
  const [base, setBase] = useState([])
  const [extras, setExtras] = useState(leerExtras)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    cargarProductos(url)
      .then((datos) => { if (activo) setBase(datos) })
      .catch((e) => { if (activo) setError(e.message) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [url])

  useEffect(() => {
    try {
      localStorage.setItem('productosExtra', JSON.stringify(extras))
    } catch { /* sin almacenamiento disponible */ }
  }, [extras])

  const productos = [...base, ...extras]

  function agregarProducto({ nombre, categoria, precio, stock }) {
    const id = productos.reduce((max, p) => Math.max(max, p.id), 0) + 1
    const precioNum = parseInt(precio, 10)
    setExtras([...extras, {
      id, nombre: nombre.trim(), categoria: categoria.trim(),
      descripcion: 'Producto registrado por el administrador.',
      precioAntes: precioNum, precioAhora: precioNum, stock: parseInt(stock, 10)
    }])
  }

  return (
    <ProductosContext.Provider value={{ productos, cargando, error, agregarProducto }}>
      {children}
    </ProductosContext.Provider>
  )
}

export function useProductos() {
  return useContext(ProductosContext)
}
