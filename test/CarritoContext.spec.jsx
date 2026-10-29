import { renderHook, act, cleanup } from '@testing-library/react'
import { CarritoProvider, useCarrito } from '../src/context/CarritoContext.jsx'
import { PRODUCTOS_FALSOS } from './helpers.jsx'

describe('CarritoContext (lógica del carrito)', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => cleanup())
  const montar = () => renderHook(() => useCarrito(), { wrapper: CarritoProvider })

  it('agrega un producto y calcula total y cantidad', () => {
    const { result } = montar()
    act(() => { result.current.agregar(PRODUCTOS_FALSOS[0]) })
    expect(result.current.cantidadTotal).toBe(1)
    expect(result.current.total).toBe(9990)
  })

  it('suma la cantidad si el producto ya estaba en el carrito', () => {
    const { result } = montar()
    act(() => { result.current.agregar(PRODUCTOS_FALSOS[0]) })
    act(() => { result.current.agregar(PRODUCTOS_FALSOS[0]) })
    expect(result.current.items.length).toBe(1)
    expect(result.current.items[0].cantidad).toBe(2)
  })

  it('devuelve mensaje de error y no agrega al superar el stock', () => {
    const { result } = montar()
    act(() => { result.current.agregar(PRODUCTOS_FALSOS[0]) })
    act(() => { result.current.agregar(PRODUCTOS_FALSOS[0]) })
    let mensaje
    act(() => { mensaje = result.current.agregar(PRODUCTOS_FALSOS[0]) })
    expect(mensaje).toContain('No puedes añadir más')
    expect(result.current.cantidadTotal).toBe(2)
  })

  it('quita un producto al bajar su cantidad a 0 y permite vaciar', () => {
    const { result } = montar()
    act(() => { result.current.agregar(PRODUCTOS_FALSOS[1]) })
    act(() => { result.current.cambiarCantidad(2, -1) })
    expect(result.current.items.length).toBe(0)
    act(() => { result.current.agregar(PRODUCTOS_FALSOS[1]) })
    act(() => { result.current.vaciar() })
    expect(result.current.items).toEqual([])
  })

  it('guarda el carrito en localStorage', () => {
    const { result } = montar()
    act(() => { result.current.agregar(PRODUCTOS_FALSOS[0]) })
    expect(JSON.parse(localStorage.getItem('carrito')).length).toBe(1)
  })

  it('quitar elimina el producto del carrito sin importar su cantidad', () => {
    const { result } = montar()
    act(() => { result.current.agregar(PRODUCTOS_FALSOS[0]) })
    act(() => { result.current.agregar(PRODUCTOS_FALSOS[1]) })
    act(() => { result.current.quitar(1) })
    expect(result.current.items.length).toBe(1)
    expect(result.current.items[0].id).toBe(2)
  })

  it('cambiarCantidad no supera el stock disponible', () => {
    const { result } = montar()
    act(() => { result.current.agregar(PRODUCTOS_FALSOS[0]) }) // stock 2
    act(() => { result.current.cambiarCantidad(1, 5) })
    expect(result.current.items[0].cantidad).toBe(2)
  })

  it('si el carrito guardado en localStorage está dañado, parte vacío', () => {
    localStorage.setItem('carrito', '{no es json')
    const { result } = montar()
    expect(result.current.items).toEqual([])
  })
})
