import { z } from 'zod';

// Validacion de entrada con Zod.
// Se valida antes de tocar la base: si algo no cumple, no se guarda nada.

export const crearProductoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(120),
  descripcion: z.string().trim().max(2000).optional(),
  precio: z.coerce
    .number()
    .positive('El precio debe ser mayor a cero'),
  stockMinimo: z.coerce.number().int().min(0).default(5),
  categoriaId: z.coerce.number().int().positive().optional(),
  // Regla del asistente de busqueda: un producto sin etiquetar
  // no aparece en los resultados, asi que exigimos al menos una.
  etiquetaIds: z
    .array(z.coerce.number().int().positive())
    .min(1, 'El producto debe tener al menos una etiqueta'),
});

export const actualizarProductoSchema = crearProductoSchema.partial();

export const filtrosCatalogoSchema = z.object({
  q: z.string().trim().optional(),
  categoriaId: z.coerce.number().int().positive().optional(),
  etiquetas: z
    .string()
    .optional()
    .transform((v) =>
      v ? v.split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0) : []
    ),
  soloConStock: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
  pagina: z.coerce.number().int().min(1).default(1),
  porPagina: z.coerce.number().int().min(1).max(50).default(12),
});
