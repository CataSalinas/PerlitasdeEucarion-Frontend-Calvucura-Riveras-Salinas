import { MemoryRouter } from 'react-router-dom'
import { ProductosProvider } from '../src/context/ProductosContext.jsx'
import { CarritoProvider } from '../src/context/CarritoContext.jsx'
import { OrdenesProvider } from '../src/context/OrdenesContext.jsx'

export const PRODUCTOS_FALSOS = [
  { id: 1, nombre: 'Collar de perlas', categoria: 'Collares', descripcion: 'd1', precioAntes: 12990, precioAhora: 9990, stock: 2 },
  { id: 2, nombre: 'Aros de plata', categoria: 'Aros', descripcion: 'd2', precioAntes: 8990, precioAhora: 6990, stock: 5 }
]

export function mockCatalogo(productos = PRODUCTOS_FALSOS) {
  spyOn(window, 'fetch').and.returnValue(
    Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(productos) })
  )
}

export function Envoltorio({ children, ruta = '/' }) {
  return (
    <MemoryRouter initialEntries={[ruta]}>
      <ProductosProvider>
        <CarritoProvider>
          <OrdenesProvider>{children}</OrdenesProvider>
        </CarritoProvider>
      </ProductosProvider>
    </MemoryRouter>
  )
}