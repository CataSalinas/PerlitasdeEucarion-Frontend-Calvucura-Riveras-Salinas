import { useState } from 'react'
import {
  Link,
  useNavigate,
  useParams
} from 'react-router-dom'

import { useProductos } from '../context/ProductosContext.jsx'
import {
  validarCantidad,
  validarTexto
} from '../utils/validaciones.js'

export default function EditarProducto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    buscarProducto,
    editarProducto
  } = useProductos()
  const producto = buscarProducto(id)
  const [datos, setDatos] = useState(() =>
    producto
      ? {
          nombre: producto.nombre,
          categoria: producto.categoria,
          precio: String(producto.precioAntes),
          descuento: producto.precioAntes > producto.precioAhora
          ? String(Math.round((1 - producto.precioAhora / producto.precioAntes) * 100)): '',
stock: String(producto.stock)
        }
      : {
          nombre: '',
          categoria: '',
          precio: '',
          stock: ''
        }
  )
  const [errores, setErrores] = useState({})
  if (!producto) {
    return (
      <div className="alert alert-danger">
        Producto no encontrado.
      </div>
    )
  }
  function manejarCambio(e) {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    })
  }
  function manejarEnvio(e) {
    e.preventDefault()
    const nuevos = {}

    if (!validarTexto(datos.nombre)) {
      nuevos.nombre = 'Debe ingresar un nombre'
    }

    if (!validarTexto(datos.categoria)) {
      nuevos.categoria = 'Debe ingresar una categoria'
    }

    if (!validarCantidad(datos.precio)) {
      nuevos.precio = 'El precio debe ser mayor a 0'
    }
    if (datos.descuento !== '') {
      const descuento = parseInt(datos.descuento, 10)

      if (isNaN(descuento) || descuento < 0 || descuento > 100) {
        nuevos.descuento = 'El descuento debe estar entre 0 y 100'
      }
}

    if (!validarCantidad(datos.stock)) {
      nuevos.stock = 'El stock debe ser mayor a 0'
    }

    setErrores(nuevos)

    if (Object.keys(nuevos).length === 0) {
      editarProducto(id, datos)
      navigate('/admin/productos')
    }
  }
  function campo(nombre, etiqueta, tipo = 'text') {
    return (
      <div className="mb-3">
        <label
          htmlFor={nombre}
          className="form-label"
        >
          {etiqueta}
        </label>
        <input
          id={nombre}
          name={nombre}
          type={tipo}
          value={datos[nombre]}
          onChange={manejarCambio}
          className={
            'form-control' +
            (errores[nombre] ? ' is-invalid' : '')
          }
        />
        {errores[nombre] && (
          <div className="mensaje-error">
            {errores[nombre]}
          </div>
        )}
      </div>
    )
  }
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <h1 className="h3 mb-3">
          Editar producto #{producto.id}
        </h1>
        <form onSubmit={manejarEnvio} noValidate>
          {campo('nombre', 'Nombre')}
          {campo('categoria', 'Categoria')}
          {campo('precio', 'Precio', 'number')}
          {campo('descuento', 'Descuento % (opcional)', 'number')}
          {campo('stock', 'Stock', 'number')}
          <div className="d-flex gap-2">
            <Link
              className="btn btn-outline-secondary"
              to="/admin/productos"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="btn btn-perla"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}