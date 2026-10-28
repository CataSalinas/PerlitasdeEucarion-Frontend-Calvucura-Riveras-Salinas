export function validarTexto(texto) {
  return typeof texto === 'string' && texto.trim().length > 0
}

export function validarCantidad(valor) {
  const limpio = String(valor ?? '').trim()
  if (limpio.length === 0 || isNaN(limpio)) return false
  return parseInt(limpio, 10) > 0
}

export function formatearPrecio(valor) {
  return '$' + Number(valor).toLocaleString('es-CL')
}
