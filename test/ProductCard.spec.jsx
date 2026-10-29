import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from '../src/components/ProductCard.jsx'
import { CarritoProvider } from '../src/context/CarritoContext.jsx'
import { PRODUCTOS_FALSOS } from './helpers.jsx'

describe('ProductCard (props, estado y DOM)', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => cleanup())

  const dibujar = (producto = PRODUCTOS_FALSOS[0]) =>
    render(
      <MemoryRouter>
        <CarritoProvider>
          <ProductCard producto={producto} />
        </CarritoProvider>
      </MemoryRouter>
    )

  it('muestra nombre, categoría y stock recibidos por props', () => {
    dibujar()
    expect(screen.getByText('Collar de perlas')).toBeTruthy()
    expect(screen.getByText('Collares')).toBeTruthy()
    expect(screen.getByText(/Stock disponible: 2/)).toBeTruthy()
  })

  it('no muestra error al inicio', () => {
    dibujar()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('muestra un error al superar el stock (cambia el estado)', () => {
    dibujar()
    const boton = screen.getByText('Añadir')
    fireEvent.click(boton)
    fireEvent.click(boton)
    expect(screen.queryByRole('alert')).toBeNull()
    fireEvent.click(boton)
    expect(screen.getByRole('alert').textContent).toContain('No puedes añadir más de 2')
  })

  it('muestra la franja de descuento cuando el producto está en oferta', () => {
    dibujar()
    expect(screen.getByText('23% OFF')).toBeTruthy()
  })

  it('no muestra la franja de descuento si el producto no está en oferta', () => {
    const sinOferta = { ...PRODUCTOS_FALSOS[0], precioAntes: 9990, precioAhora: 9990 }
    dibujar(sinOferta)
    expect(screen.queryByText(/% OFF/)).toBeNull()
  })
})