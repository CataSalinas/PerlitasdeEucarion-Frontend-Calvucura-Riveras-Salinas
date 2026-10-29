import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'
import { validarCantidad, validarTexto } from '../utils/validaciones.js'
import { categorias } from '../data/categorias.js'

export default function EditarProducto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { buscarProducto, editarProducto } = useProductos()
  const producto = buscarProducto(id)

  const [datos, setDatos] = useState(() => producto
    ? {
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: String(producto.precioAntes),
        descuento: producto.precioAntes > producto.precioAhora
          ? String(Math.round((1 - producto.precioAhora / producto.precioAntes) * 100))
          : '',
        stock: String(producto.stock)
      }
    : { nombre: '', categoria: '', precio: '', descuento: '', stock: '' }
  )

  const [errores, setErrores] = useState({})

  if (!producto) return <div className="alert alert-danger">Producto no encontrado.</div>

  function manejarCambio(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  function manejarEnvio(e) {
    e.preventDefault()
    const nuevos = {}

    if (!validarTexto(datos.nombre)) nuevos.nombre = 'Debe ingresar un nombre'
    if (!validarTexto(datos.categoria)) nuevos.categoria = 'Debe seleccionar una categoria'
    if (!validarCantidad(datos.precio)) nuevos.precio = 'El precio debe ser mayor a 0'

    if (datos.descuento !== '') {
      const descuento = parseInt(datos.descuento, 10)
      if (isNaN(descuento) || descuento < 0 || descuento > 100) nuevos.descuento = 'El descuento debe estar entre 0 y 100'
    }

    if (!validarCantidad(datos.stock)) nuevos.stock = 'El stock debe ser mayor a 0'
    setErrores(nuevos)

    if (Object.keys(nuevos).length === 0) {
      editarProducto(id, datos)
      navigate('/admin/productos')
    }
  }

  const campo = (nombre, etiqueta, tipo = 'text') => (
    <div className="mb-3">
      <label htmlFor={nombre} className="form-label">{etiqueta}</label>
      <input id={nombre} name={nombre} type={tipo} value={datos[nombre]} onChange={manejarCambio}
        className={'form-control' + (errores[nombre] ? ' is-invalid' : '')} />
      {errores[nombre] && <div className="mensaje-error">{errores[nombre]}</div>}
    </div>
  )

  const campoCategoria = () => (
    <div className="mb-3">
      <label htmlFor="categoria" className="form-label">Categoria</label>
      <select id="categoria" name="categoria" value={datos.categoria} onChange={manejarCambio}
        className={'form-select' + (errores.categoria ? ' is-invalid' : '')}>
        <option value="">Seleccione una categoria</option>
        {categorias.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
      </select>
      {errores.categoria && <div className="mensaje-error">{errores.categoria}</div>}
    </div>
  )

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <h1 className="h3 mb-3">Editar producto #{producto.id}</h1>
        <form onSubmit={manejarEnvio} noValidate>
          {campo('nombre', 'Nombre')}
          {campoCategoria()}
          {campo('precio', 'Precio', 'number')}
          {campo('descuento', 'Descuento % (opcional)', 'number')}
          {campo('stock', 'Stock', 'number')}
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary" to="/admin/productos">Cancelar</Link>
            <button type="submit" className="btn btn-perla">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  )
}