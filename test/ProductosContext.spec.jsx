import { renderHook, act, waitFor, cleanup } from '@testing-library/react'
import { ProductosProvider, useProductos } from '../src/context/ProductosContext.jsx'
import { PRODUCTOS_FALSOS, mockCatalogo } from './helpers.jsx'

// Jasmine no lanza excepción al fallar un expect, así que waitFor necesita
// una función que sí lance error mientras la carga no termine.
function esperarCarga(result) {
  return waitFor(() => {
    if (result.current.cargando) throw new Error('todavía cargando')
  })
}

describe('ProductosContext (CRUD sobre el catálogo)', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => cleanup())

  // Monta el provider y espera a que termine de cargar el JSON mockeado
  async function montar() {
    mockCatalogo()
    const vista = renderHook(() => useProductos(), { wrapper: ProductosProvider })
    await esperarCarga(vista.result)
    return vista
  }

  describe('lectura (Read)', () => {
    it('carga el catálogo y termina el estado "cargando"', async () => {
      const { result } = await montar()
      expect(result.current.productos.length).toBe(2)
      expect(result.current.error).toBeNull()
    })

    it('buscarProducto encuentra por id (número o texto) y devuelve undefined si no existe', async () => {
      const { result } = await montar()
      expect(result.current.buscarProducto(1).nombre).toBe('Collar de perlas')
      expect(result.current.buscarProducto('2').nombre).toBe('Aros de plata')
      expect(result.current.buscarProducto(999)).toBeUndefined()
    })

    it('expone el error si el JSON no se puede cargar', async () => {
      spyOn(window, 'fetch').and.returnValue(
        Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve([]) })
      )
      const { result } = renderHook(() => useProductos(), { wrapper: ProductosProvider })
      await esperarCarga(result)
      expect(result.current.error).toContain('HTTP 500')
    })
  })

  describe('creación (Create)', () => {
    it('agregarProducto asigna un id correlativo y lo guarda en localStorage', async () => {
      const { result } = await montar()
      act(() => {
        result.current.agregarProducto({ nombre: ' Anillo luna ', categoria: 'Anillos', precio: '4500', stock: '3' })
      })
      const nuevo = result.current.buscarProducto(3)
      expect(nuevo.nombre).toBe('Anillo luna')
      expect(nuevo.precioAhora).toBe(4500)
      expect(nuevo.stock).toBe(3)
      expect(JSON.parse(localStorage.getItem('productosExtra')).length).toBe(1)
    })
  })

  describe('actualización (Update)', () => {
    it('editarProducto recalcula el precio final aplicando el descuento', async () => {
      const { result } = await montar()
      act(() => {
        result.current.editarProducto(1, { nombre: 'Collar nuevo', categoria: 'Collares', precio: '10000', descuento: '20', stock: '4' })
      })
      const editado = result.current.buscarProducto(1)
      expect(editado.nombre).toBe('Collar nuevo')
      expect(editado.precioAntes).toBe(10000)
      expect(editado.precioAhora).toBe(8000)
      expect(editado.stock).toBe(4)
      expect(JSON.parse(localStorage.getItem('productosEditados'))['1'].precioAhora).toBe(8000)
    })

    it('editarProducto con descuento vacío deja el mismo precio (sin oferta)', async () => {
      const { result } = await montar()
      act(() => {
        result.current.editarProducto(2, { nombre: 'Aros', categoria: 'Aros', precio: '5000', descuento: '', stock: '1' })
      })
      const editado = result.current.buscarProducto(2)
      expect(editado.precioAntes).toBe(5000)
      expect(editado.precioAhora).toBe(5000)
    })

    it('editarProducto no hace nada si el id no existe', async () => {
      const { result } = await montar()
      act(() => {
        result.current.editarProducto(999, { nombre: 'X', categoria: 'Aros', precio: '1000', descuento: '', stock: '1' })
      })
      expect(result.current.productos.length).toBe(2)
      expect(JSON.parse(localStorage.getItem('productosEditados'))).toEqual({})
    })
  })

  describe('eliminación (Delete)', () => {
    it('eliminarProducto oculta un producto del catálogo base y lo recuerda en localStorage', async () => {
      const { result } = await montar()
      act(() => { result.current.eliminarProducto(1) })
      expect(result.current.buscarProducto(1)).toBeUndefined()
      expect(result.current.productos.length).toBe(1)
      expect(JSON.parse(localStorage.getItem('productosEliminados'))).toEqual([1])
    })

    it('eliminar dos veces el mismo producto no duplica el registro', async () => {
      const { result } = await montar()
      act(() => { result.current.eliminarProducto(1) })
      act(() => { result.current.eliminarProducto(1) })
      expect(JSON.parse(localStorage.getItem('productosEliminados'))).toEqual([1])
    })

    it('eliminarProducto borra por completo un producto registrado por el administrador', async () => {
      localStorage.setItem('productosExtra', JSON.stringify([
        { id: 99, nombre: 'Pulsera nueva', categoria: 'Pulseras', descripcion: 'x', precioAntes: 1000, precioAhora: 1000, stock: 1 }
      ]))
      localStorage.setItem('productosEditados', JSON.stringify({ 99: { stock: 5 } }))
      const { result } = await montar()
      expect(result.current.buscarProducto(99)).toBeDefined()
      act(() => { result.current.eliminarProducto(99) })
      expect(result.current.buscarProducto(99)).toBeUndefined()
      expect(JSON.parse(localStorage.getItem('productosExtra'))).toEqual([])
      expect(JSON.parse(localStorage.getItem('productosEditados'))['99']).toBeUndefined()
    })
  })

  describe('descontarStock (compra)', () => {
    it('descuenta el stock y devuelve true cuando alcanza', async () => {
      const { result } = await montar()
      let ok
      act(() => { ok = result.current.descontarStock([{ id: 1, cantidad: 2 }, { id: 2, cantidad: 1 }]) })
      expect(ok).toBeTrue()
      expect(result.current.buscarProducto(1).stock).toBe(0)
      expect(result.current.buscarProducto(2).stock).toBe(4)
    })

    it('devuelve false y no cambia nada si algún producto no tiene stock suficiente', async () => {
      const { result } = await montar()
      let ok
      act(() => { ok = result.current.descontarStock([{ id: 1, cantidad: 3 }]) })
      expect(ok).toBeFalse()
      expect(result.current.buscarProducto(1).stock).toBe(2)
    })

    it('devuelve false si el producto ya no existe', async () => {
      const { result } = await montar()
      let ok
      act(() => { ok = result.current.descontarStock([{ id: 999, cantidad: 1 }]) })
      expect(ok).toBeFalse()
    })
  })

  describe('localStorage dañado', () => {
    it('ignora el contenido inválido y usa valores vacíos por defecto', async () => {
      localStorage.setItem('productosExtra', '{no es json')
      localStorage.setItem('productosEditados', '{no es json')
      localStorage.setItem('productosEliminados', '{no es json')
      const { result } = await montar()
      expect(result.current.productos.length).toBe(PRODUCTOS_FALSOS.length)
    })
  })
})
