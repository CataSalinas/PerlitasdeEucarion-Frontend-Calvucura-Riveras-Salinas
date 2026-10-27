import { cargarProductos } from '../src/services/productosService.js'

describe('productosService.cargarProductos (mock de fetch)', () => {
  const respuesta = (cuerpo, ok = true, status = 200) =>
    Promise.resolve({ ok, status, json: () => Promise.resolve(cuerpo) })

  it('devuelve el arreglo de productos del JSON', async () => {
    const falso = [{ id: 1, nombre: 'Collar' }]
    const espia = spyOn(window, 'fetch').and.returnValue(respuesta(falso))
    const datos = await cargarProductos('/productos.json')
    expect(espia).toHaveBeenCalledWith('/productos.json')
    expect(datos).toEqual(falso)
  })

  it('lanza error si la respuesta HTTP no es ok', async () => {
    spyOn(window, 'fetch').and.returnValue(respuesta(null, false, 404))
    await expectAsync(cargarProductos()).toBeRejectedWithError(/HTTP 404/)
  })

  it('lanza error si el JSON no es un arreglo', async () => {
    spyOn(window, 'fetch').and.returnValue(respuesta({ a: 1 }))
    await expectAsync(cargarProductos()).toBeRejectedWithError(/formato esperado/)
  })
})
