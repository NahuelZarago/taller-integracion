import { PrismaClient } from '@prisma/client';

// Una sola instancia para toda la aplicacion.
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});
