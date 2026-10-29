import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import Checkout from '../src/pages/Checkout.jsx'
import { Envoltorio, mockCatalogo, PRODUCTOS_FALSOS } from './helpers.jsx'

describe('Página Checkout (formulario, stock y navegación)', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => cleanup())

  const rutas = (
    <Routes>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/compra-exitosa" element={<h1>Pantalla compra exitosa</h1>} />
      <Route path="/compra-error" element={<h1>Pantalla compra error</h1>} />
    </Routes>
  )

  function cargarCarrito(cantidad) {
    localStorage.setItem('carrito', JSON.stringify([{ ...PRODUCTOS_FALSOS[0], cantidad }]))
  }

  async function dibujar() {
    mockCatalogo()
    render(<Envoltorio ruta="/checkout">{rutas}</Envoltorio>)
    
    await act(async () => { await new Promise((r) => setTimeout(r, 0)) })
  }

  function escribir(name, value) {
    fireEvent.change(document.querySelector(`[name="${name}"]`), { target: { name, value } })
  }

  function llenarFormulario() {
    escribir('nombre', 'Ana')
    escribir('apellidos', 'Pérez')
    escribir('correo', 'ana@correo.cl')
    escribir('calle', 'Los Aromos')
    escribir('numeroCasa', '123')
    escribir('region', '1000')
    escribir('comuna', '1001')
  }

  function pagar() {
    const formulario = screen.getByRole('button', { name: /Pagar ahora/ }).closest('form')
    fireEvent.submit(formulario)
  }

  it('muestra un mensaje si el carrito está vacío', async () => {
    await dibujar()
    expect(screen.getByText('No hay productos para comprar')).toBeTruthy()
  })

  it('muestra el resumen del carrito y el total a pagar', async () => {
    cargarCarrito(2)
    await dibujar()
    expect(screen.getByText('Collar de perlas')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Pagar ahora/ }).textContent).toMatch(/19.?980/)
  })

  it('la comuna se habilita y se filtra según la región elegida', async () => {
    cargarCarrito(1)
    await dibujar()
    const comuna = document.querySelector('[name="comuna"]')
    expect(comuna.disabled).toBeTrue()
    escribir('region', '1000')
    expect(comuna.disabled).toBeFalse()
    expect(screen.getByRole('option', { name: 'Cerrillos' })).toBeTruthy()
    expect(screen.queryByRole('option', { name: 'Arica' })).toBeNull()
  })

  it('con datos válidos y stock suficiente va a compra exitosa y vacía el carrito', async () => {
    cargarCarrito(1)
    await dibujar()
    llenarFormulario()
    pagar()
    expect(screen.getByText('Pantalla compra exitosa')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([])
  })

  it('si no hay stock suficiente va a compra con error y conserva el carrito', async () => {
    cargarCarrito(5) 
    await dibujar()
    llenarFormulario()
    pagar()
    expect(screen.getByText('Pantalla compra error')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('carrito')).length).toBe(1)
  })
})
