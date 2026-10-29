// Capa unica de acceso a la API.
// Si manana cambia la URL base, se toca solo aca.

const BASE = '/api';

async function pedir(ruta, opciones = {}) {
  const r = await fetch(`${BASE}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  });

  if (!r.ok) {
    const cuerpo = await r.json().catch(() => ({}));
    throw new Error(cuerpo.error || 'No pudimos conectarnos con el servidor.');
  }

  return r.status === 204 ? null : r.json();
}

export const api = {
  listarProductos(filtros = {}) {
    const params = new URLSearchParams(
      Object.entries(filtros).filter(([, v]) => v !== '' && v != null)
    );
    return pedir(`/productos?${params}`);
  },

  obtenerProducto(id) {
    return pedir(`/productos/${id}`);
  },

  crearProducto(datos) {
    return pedir('/productos', { method: 'POST', body: JSON.stringify(datos) });
  },
};
