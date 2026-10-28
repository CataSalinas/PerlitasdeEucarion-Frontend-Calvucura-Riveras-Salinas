export async function cargarProductos(url = '/productos.json') {
  const respuesta = await fetch(url)
  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el catálogo (HTTP ' + respuesta.status + ')')
  }
  const datos = await respuesta.json()
  if (!Array.isArray(datos)) {
    throw new Error('El JSON del catálogo no tiene el formato esperado')
  }
  return datos
}
