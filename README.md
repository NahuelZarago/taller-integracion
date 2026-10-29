# Pet Market Club

Taller de Integración — Licenciatura en Sistemas de Información — Grupo H
Romero Gonzalo · Sangalli Luciano · Zaragoza Nahuel

Tienda en línea de productos para mascotas de Concepción del Uruguay, Entre Ríos.

## Estado

Sprint 2 — Primeros CRUD y catálogo. Lo que hay hasta ahora:

- Modelo de datos en Prisma con las entidades del catálogo y del inventario.
- API REST del CRUD de productos (listar, obtener, crear, actualizar, desactivar).
- Motor de stock calculado por eventos, sin campo editable.
- Catálogo público en React con búsqueda y filtro por disponibilidad.
- Datos de prueba para levantar el proyecto sin cargar nada a mano.

Pendiente de los próximos sprints: autenticación con JWT, CRUD de usuarios,
carrito, checkout con Mercado Pago, pedidos, promociones y cupones.

## Tecnologías

Backend: Node.js, Express, Prisma, PostgreSQL, Zod
Frontend: React, Vite, TailwindCSS

## Cómo levantarlo

Hace falta tener PostgreSQL andando y una base creada.

### Backend

```bash
cd backend
npm install
cp .env.example .env        # completar DATABASE_URL con los datos locales
npm run db:push             # crea las tablas
npm run db:seed             # carga datos de prueba
npm run dev                 # queda en http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                 # queda en http://localhost:5173
```

Vite redirige todo lo que empieza con `/api` al backend, así que los dos
tienen que estar corriendo al mismo tiempo.

## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/salud` | Verifica que la API responda |
| GET | `/api/productos` | Lista el catálogo con filtros y paginación |
| GET | `/api/productos/:id` | Trae un producto con su stock calculado |
| POST | `/api/productos` | Da de alta un producto |
| PUT | `/api/productos/:id` | Modifica un producto |
| DELETE | `/api/productos/:id` | Lo desactiva (no lo borra) |

Filtros disponibles en el listado: `q`, `categoriaId`, `etiquetas`,
`soloConStock`, `pagina`, `porPagina`.

## Dos decisiones que conviene conocer antes de tocar el código

**El stock no es un campo.** `Producto` no tiene una columna con la cantidad.
La existencia se calcula sumando los registros de `MovimientoStock`: las
entradas van en positivo y las salidas en negativo. Está resuelto en
`backend/src/services/stock.service.js`. Es lo que permite responder por qué
un producto tiene la cantidad que tiene, y es un requisito del cliente.

**Un producto sin etiquetar no se publica.** El esquema de validación exige
al menos una etiqueta al crear un producto, porque el asistente de búsqueda
filtra por especie y edad. Un producto sin etiquetas quedaría invisible en
la tienda aunque tuviera stock.

## Estructura

```
backend/
  prisma/
    schema.prisma          modelo de datos
    seed.js                datos de prueba
  src/
    app.js                 configuración de Express
    server.js              punto de entrada
    lib/prisma.js          cliente de base de datos
    middlewares/           manejo de errores
    schemas/               validaciones con Zod
    services/              reglas de negocio
    controllers/           lógica de cada endpoint
    routes/                definición de rutas

frontend/
  src/
    api/client.js          acceso a la API
    components/            componentes reutilizables
    pages/                 pantallas
```
