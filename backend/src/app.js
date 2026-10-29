import express from 'express';
import cors from 'cors';
import productosRoutes from './routes/productos.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/salud', (req, res) => {
  res.json({ estado: 'ok', servicio: 'pet-market-club-api' });
});

app.use('/api/productos', productosRoutes);

// TODO proximos sprints:
// app.use('/api/auth', authRoutes);
// app.use('/api/clientes', clientesRoutes);
// app.use('/api/pedidos', pedidosRoutes);
// app.use('/api/inventario', inventarioRoutes);
// app.use('/api/cupones', cuponesRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
app.use(errorHandler);
