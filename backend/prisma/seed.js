import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Datos de prueba para poder ver algo en pantalla mientras
// no esta cargado el catalogo real de Camila y Gonzalo.

async function main() {
  const admin = await prisma.usuario.upsert({
    where: { email: 'camila@petmarketclub.com.ar' },
    update: {},
    create: {
      email: 'camila@petmarketclub.com.ar',
      nombre: 'Camila',
      apellido: 'Perez',
      telefono: '3434000000',
      rol: 'ADMINISTRADOR',
    },
  });

  const categorias = {};
  for (const [i, nombre] of ['Alimentos', 'Higiene', 'Accesorios', 'Suplementos'].entries()) {
    categorias[nombre] = await prisma.categoria.upsert({
      where: { nombre },
      update: {},
      create: { nombre, orden: i },
    });
  }

  const etiquetasBase = [
    { nombre: 'Perro', tipo: 'ESPECIE', excluyente: true },
    { nombre: 'Gato', tipo: 'ESPECIE', excluyente: true },
    { nombre: 'Pez', tipo: 'ESPECIE', excluyente: true },
    { nombre: 'Cachorro', tipo: 'EDAD', excluyente: true },
    { nombre: 'Adulto', tipo: 'EDAD', excluyente: true },
    { nombre: 'Senior', tipo: 'EDAD', excluyente: true },
    { nombre: 'Raza grande', tipo: 'TAMANIO', excluyente: false },
    { nombre: 'Piel sensible', tipo: 'CONDICION', excluyente: false },
  ];

  const etiquetas = {};
  for (const e of etiquetasBase) {
    etiquetas[e.nombre] = await prisma.etiqueta.upsert({
      where: { nombre_tipo: { nombre: e.nombre, tipo: e.tipo } },
      update: {},
      create: e,
    });
  }

  const productos = [
    {
      nombre: 'Balanceado premium adulto 15 kg',
      descripcion: 'Alimento seco para perros adultos de raza grande.',
      precio: 42000,
      categoria: 'Alimentos',
      etiquetas: ['Perro', 'Adulto', 'Raza grande'],
      entrada: 46,
    },
    {
      nombre: 'Arena sanitaria 10 kg',
      descripcion: 'Arena aglutinante con control de olor.',
      precio: 9400,
      categoria: 'Higiene',
      etiquetas: ['Gato', 'Adulto'],
      entrada: 20,
    },
    {
      nombre: 'Latitas de pollo x6',
      descripcion: 'Alimento humedo para cachorros.',
      precio: 14200,
      categoria: 'Alimentos',
      etiquetas: ['Perro', 'Cachorro'],
      entrada: 0, // queda sin stock, para probar el estado SIN_STOCK
    },
    {
      nombre: 'Shampoo hipoalergenico 250 ml',
      descripcion: 'Para pieles sensibles, sin perfume.',
      precio: 12000,
      categoria: 'Higiene',
      etiquetas: ['Perro', 'Piel sensible'],
      entrada: 4, // queda por debajo del minimo, para probar STOCK_BAJO
    },
  ];

  for (const p of productos) {
    const creado = await prisma.producto.create({
      data: {
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        categoriaId: categorias[p.categoria].id,
        etiquetas: {
          create: p.etiquetas.map((n) => ({ etiquetaId: etiquetas[n].id })),
        },
      },
    });

    // El stock se carga con un movimiento, nunca escribiendo un numero.
    if (p.entrada > 0) {
      await prisma.movimientoStock.create({
        data: {
          tipo: 'ENTRADA_PROVEEDOR',
          cantidad: p.entrada,
          justificacion: 'Carga inicial de prueba',
          productoId: creado.id,
          usuarioId: admin.id,
        },
      });
    }
  }

  console.log('Datos de prueba cargados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
