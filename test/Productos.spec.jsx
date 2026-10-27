import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import Productos from '../src/pages/Productos.jsx'
import { Envoltorio, mockCatalogo } from './helpers.jsx'

describe('Página Productos (datos desde JSON mockeado)', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => cleanup())

  it('muestra "Cargando" y luego los productos del JSON', async () => {
    mockCatalogo()
    render(<Envoltorio><Productos /></Envoltorio>)
    expect(screen.getByRole('status').textContent).toContain('Cargando')
    expect(await screen.findByText('Collar de perlas')).toBeTruthy()
    expect(screen.getByText('Aros de plata')).toBeTruthy()
  })

  it('filtra por categoría al hacer clic en un botón', async () => {
    mockCatalogo()
    render(<Envoltorio><Productos /></Envoltorio>)
    await screen.findByText('Collar de perlas')
    fireEvent.click(screen.getByRole('button', { name: 'Aros' }))
    expect(screen.queryByText('Collar de perlas')).toBeNull()
    expect(screen.getByText('Aros de plata')).toBeTruthy()
  })

  it('muestra un mensaje de error si el JSON no se puede cargar', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve([]) }))
    render(<Envoltorio><Productos /></Envoltorio>)
    const alerta = await screen.findByRole('alert')
    expect(alerta.textContent).toContain('HTTP 500')
  })
})
