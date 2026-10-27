import { validarTexto, validarCantidad, formatearPrecio } from '../src/utils/validaciones.js'

describe('validaciones (funciones puras)', () => {
  describe('validarTexto', () => {
    it('acepta un texto con contenido', () => {
      expect(validarTexto('Collar de perlas')).toBeTrue()
    })
    it('rechaza texto vacío o solo espacios', () => {
      expect(validarTexto('')).toBeFalse()
      expect(validarTexto('   ')).toBeFalse()
    })
    it('rechaza valores que no son string', () => {
      expect(validarTexto(null)).toBeFalse()
      expect(validarTexto(123)).toBeFalse()
    })
  })

  describe('validarCantidad', () => {
    it('acepta enteros positivos (como número o string)', () => {
      expect(validarCantidad('5')).toBeTrue()
      expect(validarCantidad(10)).toBeTrue()
    })
    it('rechaza cero y negativos', () => {
      expect(validarCantidad('0')).toBeFalse()
      expect(validarCantidad('-3')).toBeFalse()
    })
    it('rechaza vacío, null y texto no numérico', () => {
      expect(validarCantidad('')).toBeFalse()
      expect(validarCantidad(null)).toBeFalse()
      expect(validarCantidad('abc')).toBeFalse()
    })
  })

  describe('formatearPrecio', () => {
    it('antepone $ y usa separador de miles', () => {
      const texto = formatearPrecio(9990)
      expect(texto.startsWith('$')).toBeTrue()
      expect(texto).toMatch(/9.?990/)
    })
  })
})
