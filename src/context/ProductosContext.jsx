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

function leerEditados() {
  try {
    return JSON.parse(localStorage.getItem('productosEditados')) || {}
  } catch {
    return {}
  }
}

function leerEliminados() {
  try {
    return JSON.parse(localStorage.getItem('productosEliminados')) || []
  } catch {
    return []
  }
}

export function ProductosProvider({ children, url }) {
  const [base, setBase] = useState([])
  const [extras, setExtras] = useState(leerExtras)
  const [editados, setEditados] = useState(leerEditados)
  const [eliminados, setEliminados] = useState(leerEliminados)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true

    cargarProductos(url)
      .then((datos) => {
        if (activo) setBase(datos)
      })
      .catch((e) => {
        if (activo) setError(e.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [url])

  useEffect(() => {
    localStorage.setItem('productosExtra', JSON.stringify(extras))
  }, [extras])

  useEffect(() => {
    localStorage.setItem('productosEditados', JSON.stringify(editados))
  }, [editados])

  useEffect(() => {
    localStorage.setItem('productosEliminados', JSON.stringify(eliminados))
  }, [eliminados])

  const productos = [...base, ...extras]
    .filter((producto) => !eliminados.includes(producto.id))
    .map((producto) =>
      editados[producto.id]
        ? { ...producto, ...editados[producto.id] }
        : producto
    )

  function agregarProducto({ nombre, categoria, precio, stock }) {
    const todos = [...base, ...extras]
    const id = todos.reduce((max, p) => Math.max(max, p.id), 0) + 1
    const precioNum = parseInt(precio, 10)

    setExtras([
      ...extras,
      {
        id,
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        descripcion: 'Producto registrado por el administrador.',
        precioAntes: precioNum,
        precioAhora: precioNum,
        stock: parseInt(stock, 10)
      }
    ])
  }

  function buscarProducto(id) {
    return productos.find(
      (producto) => producto.id === parseInt(id, 10)
    )
  }

  function editarProducto(id, datos) {
    const producto = buscarProducto(id)

    if (!producto) return

    const precioNum = parseInt(datos.precio, 10)

    setEditados({
      ...editados,
      [producto.id]: {
        nombre: datos.nombre.trim(),
        categoria: datos.categoria.trim(),
        precioAntes: precioNum,
        precioAhora: precioNum,
        stock: parseInt(datos.stock, 10)
      }
    })
  }

  function eliminarProducto(id) {
    const idNum = parseInt(id, 10)

    const esExtra = extras.some(
      (producto) => producto.id === idNum
    )

    if (esExtra) {
      setExtras(
        extras.filter((producto) => producto.id !== idNum)
      )

      const nuevosEditados = { ...editados }
      delete nuevosEditados[idNum]
      setEditados(nuevosEditados)
    } else {
      if (!eliminados.includes(idNum)) {
        setEliminados([...eliminados, idNum])
      }
    }
  }

  return (
    <ProductosContext.Provider
      value={{
        productos,
        cargando,
        error,
        agregarProducto,
        buscarProducto,
        editarProducto,
        eliminarProducto
      }}
    >
      {children}
    </ProductosContext.Provider>
  )
}

export function useProductos() {
  return useContext(ProductosContext)
}
