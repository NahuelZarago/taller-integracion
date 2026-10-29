import { prisma } from '../lib/prisma.js';

/**
 * Regla de negocio central del proyecto.
 *
 * El stock NO se guarda como un campo editable: se calcula sumando
 * los movimientos registrados para cada producto. Las entradas suman
 * y las salidas restan, porque se guardan con la cantidad en negativo.
 *
 * Esto hace que el inventario sea auditable: siempre se puede responder
 * por que un producto tiene la cantidad que tiene.
 */

export async function stockDeProducto(productoId) {
  const r = await prisma.movimientoStock.aggregate({
    where: { productoId },
    _sum: { cantidad: true },
  });
  return r._sum.cantidad ?? 0;
}

/**
 * Version para listados: calcula el stock de varios productos de una vez,
 * para no disparar una consulta por cada fila.
 */
export async function stockDeVarios(productoIds) {
  if (productoIds.length === 0) return new Map();

  const filas = await prisma.movimientoStock.groupBy({
    by: ['productoId'],
    where: { productoId: { in: productoIds } },
    _sum: { cantidad: true },
  });

  const mapa = new Map(productoIds.map((id) => [id, 0]));
  for (const f of filas) mapa.set(f.productoId, f._sum.cantidad ?? 0);
  return mapa;
}

/**
 * Estado que ve el cliente en la tienda.
 */
export function estadoDeStock(cantidad, stockMinimo) {
  if (cantidad <= 0) return 'SIN_STOCK';
  if (cantidad <= stockMinimo) return 'STOCK_BAJO';
  return 'DISPONIBLE';
}
