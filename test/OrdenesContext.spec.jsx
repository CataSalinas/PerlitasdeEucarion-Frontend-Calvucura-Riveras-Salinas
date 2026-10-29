import { renderHook, act, cleanup } from '@testing-library/react'
import { OrdenesProvider, useOrdenes } from '../src/context/OrdenesContext.jsx'
import { PRODUCTOS_FALSOS } from './helpers.jsx'

describe('OrdenesContext (órdenes de compra)', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => cleanup())
  const montar = () => renderHook(() => useOrdenes(), { wrapper: OrdenesProvider })
  const cliente = { nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@correo.cl' }
  const items = [{ ...PRODUCTOS_FALSOS[0], cantidad: 1 }]

  it('agrega una orden con id 1000, estado Pagado y la guarda en localStorage', () => {
    const { result } = montar()
    act(() => { result.current.agregarOrden(cliente, items, 9990) })
    expect(result.current.ordenes.length).toBe(1)
    expect(result.current.ordenes[0].id).toBe(1000)
    expect(result.current.ordenes[0].estado).toBe('Pagado')
    expect(result.current.ordenes[0].total).toBe(9990)
    expect(JSON.parse(localStorage.getItem('ordenes')).length).toBe(1)
  })

  it('asigna un id correlativo a la segunda orden', () => {
    const { result } = montar()
    act(() => { result.current.agregarOrden(cliente, items, 9990) })
    act(() => { result.current.agregarOrden(cliente, items, 9990) })
    expect(result.current.ordenes.map((o) => o.id)).toEqual([1000, 1001])
  })

  it('cambia el estado solo de la orden indicada', () => {
    const { result } = montar()
    act(() => { result.current.agregarOrden(cliente, items, 9990) })
    act(() => { result.current.agregarOrden(cliente, items, 9990) })
    act(() => { result.current.cambiarEstado(1001, 'Entregado') })
    expect(result.current.ordenes[0].estado).toBe('Pagado')
    expect(result.current.ordenes[1].estado).toBe('Entregado')
  })

  it('parte con la lista vacía si localStorage contiene un JSON dañado', () => {
    localStorage.setItem('ordenes', '{esto no es json')
    const { result } = montar()
    expect(result.current.ordenes).toEqual([])
  })
})