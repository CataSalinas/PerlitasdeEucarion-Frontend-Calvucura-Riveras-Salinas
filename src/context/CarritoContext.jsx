import { createContext, useContext, useEffect, useState } from 'react'

const CarritoContext = createContext(null)

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem('carrito')) || []
  } catch {
    return []
  }
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarrito)

  useEffect(() => {
    try {
      localStorage.setItem('carrito', JSON.stringify(items))
    } catch { /* sin almacenamiento disponible */ }
  }, [items])

  // Devuelve un mensaje de error si no se puede agregar, o null si se agregó
  function agregar(producto) {
    const existente = items.find((i) => i.id === producto.id)
    if (existente && existente.cantidad >= producto.stock) {
      return `No puedes añadir más de ${producto.stock} unidades de ${producto.nombre}.`
    }
    setItems(existente
      ? items.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i))
      : [...items, { ...producto, cantidad: 1 }])
    return null
  }

  function cambiarCantidad(id, delta) {
    setItems(items
      .map((i) => (i.id === id ? { ...i, cantidad: Math.min(i.stock, i.cantidad + delta) } : i))
      .filter((i) => i.cantidad > 0))
  }

  function quitar(id) { setItems(items.filter((i) => i.id !== id)) }
  function vaciar() { setItems([]) }

  const total = items.reduce((suma, i) => suma + i.precioAhora * i.cantidad, 0)
  const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0)

  return (
    <CarritoContext.Provider value={{ items, agregar, cambiarCantidad, quitar, vaciar, total, cantidadTotal }}>
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  return useContext(CarritoContext)
}
