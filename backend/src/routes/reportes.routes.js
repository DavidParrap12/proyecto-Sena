import { Router } from 'express';
import { generarReporte } from '../controllers/reportes.controller.js';
import { authRequired } from '../middlewares/ValidateToken.js';

const router = Router();

router.get('/', authRequired, generarReporte);

export default router;