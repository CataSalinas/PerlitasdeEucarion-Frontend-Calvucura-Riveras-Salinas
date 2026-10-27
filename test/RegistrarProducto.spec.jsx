import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import RegistrarProducto from '../src/pages/RegistrarProducto.jsx'
import Productos from '../src/pages/Productos.jsx'
import { Envoltorio, mockCatalogo } from './helpers.jsx'

describe('Formulario RegistrarProducto (validación y navegación de estado)', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => cleanup())

  it('muestra errores de validación si se envía vacío', async () => {
    mockCatalogo()
    render(<Envoltorio><RegistrarProducto /></Envoltorio>)
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }))
    expect(screen.getByText('Debe ingresar un nombre')).toBeTruthy()
    expect(screen.getByText('El precio debe ser mayor a 0')).toBeTruthy()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('registra el producto cuando los datos son válidos y limpia el formulario', async () => {
    mockCatalogo()
    render(<Envoltorio><RegistrarProducto /></Envoltorio>)
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { name: 'nombre', value: 'Anillo luna' } })
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { name: 'categoria', value: 'Anillos' } })
    fireEvent.change(screen.getByLabelText('Precio'), { target: { name: 'precio', value: '4500' } })
    fireEvent.change(screen.getByLabelText('Stock'), { target: { name: 'stock', value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }))
    expect(screen.getByRole('status').textContent).toContain('registrado correctamente')
    expect(screen.getByLabelText('Nombre').value).toBe('')
    expect(JSON.parse(localStorage.getItem('productosExtra'))[0].nombre).toBe('Anillo luna')
  })

  it('el producto registrado aparece en el catálogo', async () => {
    mockCatalogo()
    localStorage.setItem('productosExtra', JSON.stringify([
      { id: 99, nombre: 'Pulsera nueva', categoria: 'Pulseras', descripcion: 'x', precioAntes: 1000, precioAhora: 1000, stock: 1 }
    ]))
    render(<Envoltorio><Productos /></Envoltorio>)
    expect(await screen.findByText('Pulsera nueva')).toBeTruthy()
  })
})
