import { Router } from 'express';
import { generarReporte } from '../controllers/reportes.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

router.get('/reportes', authRequired, generarReporte);

export default router;