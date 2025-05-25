import { Router } from 'express';
import { 
    getProductos, 
    createProducto, 
    updateProducto, 
    deleteProducto 
} from '../controllers/producto.controller.js';
import { authRequired } from '../middlewares/ValidateToken.js';

const router = Router();

router.get('/productos', getProductos);
router.post('/productos', authRequired, createProducto);
router.put('/productos/:id', authRequired, updateProducto);
router.delete('/productos/:id', authRequired, deleteProducto);
// Importar la nueva función
import { buscarProductoPorCodigo } from '../controllers/producto.controller.js';

// Agregar la ruta
router.get('/codigo/:codigo', buscarProductoPorCodigo);
export default router;