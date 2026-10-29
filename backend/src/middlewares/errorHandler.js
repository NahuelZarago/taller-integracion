import { ZodError } from 'zod';

// Manejo centralizado de errores.
// Los mensajes que ve el usuario van en español y sin tecnicismos.
export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Hay datos que no son validos.',
      detalles: err.issues.map((i) => ({
        campo: i.path.join('.'),
        mensaje: i.message,
      })),
    });
  }

  // Errores conocidos de Prisma
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'No encontramos ese registro.' });
  }
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Ya existe un registro con esos datos.' });
  }

  console.error(err);
  res.status(500).json({ error: 'Algo salio mal de nuestro lado.' });
}
