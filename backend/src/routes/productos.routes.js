import { Router } from 'express';
import * as ctrl from '../controllers/productos.controller.js';

const router = Router();

// Publicas (las ve cualquier visitante)
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

// Privadas del panel.
// TODO Sprint 3: agregar el middleware de autenticacion con JWT
// y la verificacion del rol ADMINISTRADOR.
router.post('/', ctrl.crear);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.desactivar);

export default router;
