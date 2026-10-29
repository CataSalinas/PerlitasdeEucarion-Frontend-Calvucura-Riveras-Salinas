import { createContext, useContext, useEffect, useState } from 'react'

const OrdenesContext = createContext(null)

function leerOrdenes() {
  try {
    return JSON.parse(localStorage.getItem('ordenes')) || []
  } catch {
    return []
  }
}

export function OrdenesProvider({ children }) {
  const [ordenes, setOrdenes] = useState(leerOrdenes)

  useEffect(() => {
    localStorage.setItem('ordenes', JSON.stringify(ordenes))
  }, [ordenes])

  function agregarOrden(datosCliente, productos, total) {
    const id = ordenes.length > 0 ? Math.max(...ordenes.map((o) => o.id)) + 1 : 1000
    const nuevaOrden = {
      id,
      cliente: datosCliente,
      productos,
      total,
      estado: 'Pagada'
    }
    setOrdenes([...ordenes, nuevaOrden])
  }

  function cambiarEstado(id, estado) {
  setOrdenes(ordenes.map((orden) =>
    orden.id === id ? { ...orden, estado } : orden
  ))
}

  return (
    <OrdenesContext.Provider value={{ ordenes, agregarOrden, cambiarEstado }}>
      {children}
    </OrdenesContext.Provider>
  )
}

export function useOrdenes() {
  return useContext(OrdenesContext)
}