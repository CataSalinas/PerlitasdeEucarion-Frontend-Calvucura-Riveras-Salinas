import { useState } from 'react'
import { validarTexto, validarCantidad } from '../utils/validaciones.js'
import { useProductos } from '../context/ProductosContext.jsx'
import { categorias } from '../data/categorias.js'

const VACIO = { nombre: '', categoria: '', precio: '', stock: '' }

export default function RegistrarProducto() {
  const { agregarProducto } = useProductos()
  const [datos, setDatos] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  function manejarCambio(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  function manejarEnvio(e) {
    e.preventDefault()
    const nuevos = {}
    if (!validarTexto(datos.nombre)) nuevos.nombre = 'Debe ingresar un nombre'
    if (!validarTexto(datos.categoria)) nuevos.categoria = 'Debe ingresar una categoría'
    if (!validarCantidad(datos.precio)) nuevos.precio = 'El precio debe ser mayor a 0'
    if (!validarCantidad(datos.stock)) nuevos.stock = 'El stock debe ser mayor a 0'
    setErrores(nuevos)
    const valido = Object.keys(nuevos).length === 0
    setEnviado(valido)
    if (valido) {
      agregarProducto(datos)
      setDatos(VACIO)
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
    <label htmlFor="categoria" className="form-label">Categoría</label>
    <select id="categoria" name="categoria" value={datos.categoria} onChange={manejarCambio}
      className={'form-select' + (errores.categoria ? ' is-invalid' : '')}>
      <option value="">Seleccione una categoría</option>
      {categorias.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
    </select>
    {errores.categoria && <div className="mensaje-error">{errores.categoria}</div>}
  </div>
)

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <h1 className="h3 mb-3">Registrar producto</h1>
        {enviado && <div className="alert alert-success" role="status">Producto registrado correctamente.</div>}
        <form onSubmit={manejarEnvio} noValidate>
          {campo('nombre', 'Nombre')}
          {campoCategoria()}
          {campo('precio', 'Precio', 'number')}
          {campo('stock', 'Stock', 'number')}
          <button type="submit" className="btn btn-perla">Registrar</button>
        </form>
      </div>
    </div>
  )
}
