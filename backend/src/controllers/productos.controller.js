import { prisma } from '../lib/prisma.js';
import { stockDeProducto, stockDeVarios, estadoDeStock } from '../services/stock.service.js';
import {
  crearProductoSchema,
  actualizarProductoSchema,
  filtrosCatalogoSchema,
} from '../schemas/producto.schema.js';

const incluirRelaciones = {
  categoria: true,
  etiquetas: { include: { etiqueta: true } },
};

function aplanar(p, stock) {
  return {
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: Number(p.precio),
    stockMinimo: p.stockMinimo,
    activo: p.activo,
    categoria: p.categoria ? { id: p.categoria.id, nombre: p.categoria.nombre } : null,
    etiquetas: p.etiquetas.map((pe) => ({
      id: pe.etiqueta.id,
      nombre: pe.etiqueta.nombre,
      tipo: pe.etiqueta.tipo,
    })),
    stock,
    estadoStock: estadoDeStock(stock, p.stockMinimo),
  };
}

// GET /api/productos
export async function listar(req, res, next) {
  try {
    const f = filtrosCatalogoSchema.parse(req.query);

    const where = {
      activo: true,
      ...(f.q && { nombre: { contains: f.q, mode: 'insensitive' } }),
      ...(f.categoriaId && { categoriaId: f.categoriaId }),
      // Filtrado por etiquetas: el producto tiene que tener todas las pedidas.
      ...(f.etiquetas.length > 0 && {
        AND: f.etiquetas.map((id) => ({ etiquetas: { some: { etiquetaId: id } } })),
      }),
    };

    const [total, productos] = await Promise.all([
      prisma.producto.count({ where }),
      prisma.producto.findMany({
        where,
        include: incluirRelaciones,
        orderBy: { nombre: 'asc' },
        skip: (f.pagina - 1) * f.porPagina,
        take: f.porPagina,
      }),
    ]);

    const stocks = await stockDeVarios(productos.map((p) => p.id));
    let datos = productos.map((p) => aplanar(p, stocks.get(p.id) ?? 0));

    if (f.soloConStock) datos = datos.filter((p) => p.stock > 0);

    res.json({
      datos,
      paginacion: { pagina: f.pagina, porPagina: f.porPagina, total },
    });
  } catch (e) {
    next(e);
  }
}

// GET /api/productos/:id
export async function obtener(req, res, next) {
  try {
    const id = Number(req.params.id);
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: incluirRelaciones,
    });

    if (!producto) {
      return res.status(404).json({ error: 'No encontramos ese producto.' });
    }

    const stock = await stockDeProducto(id);
    res.json(aplanar(producto, stock));
  } catch (e) {
    next(e);
  }
}

// POST /api/productos
export async function crear(req, res, next) {
  try {
    const { etiquetaIds, ...datos } = crearProductoSchema.parse(req.body);

    const producto = await prisma.producto.create({
      data: {
        ...datos,
        etiquetas: { create: etiquetaIds.map((etiquetaId) => ({ etiquetaId })) },
      },
      include: incluirRelaciones,
    });

    // Un producto recien creado arranca en cero: todavia no tiene
    // ningun movimiento de entrada registrado.
    res.status(201).json(aplanar(producto, 0));
  } catch (e) {
    next(e);
  }
}

// PUT /api/productos/:id
export async function actualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { etiquetaIds, ...datos } = actualizarProductoSchema.parse(req.body);

    const producto = await prisma.producto.update({
      where: { id },
      data: {
        ...datos,
        ...(etiquetaIds && {
          etiquetas: {
            deleteMany: {},
            create: etiquetaIds.map((etiquetaId) => ({ etiquetaId })),
          },
        }),
      },
      include: incluirRelaciones,
    });

    const stock = await stockDeProducto(id);
    res.json(aplanar(producto, stock));
  } catch (e) {
    next(e);
  }
}

// DELETE /api/productos/:id
// No se borra: se desactiva, para conservar el historial de ventas.
export async function desactivar(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.producto.update({ where: { id }, data: { activo: false } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}
