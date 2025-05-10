import { Router } from 'express';
import { 
    register,
    login,
    logout,
    verifyToken,
    profile,
    principal } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/ValidateToken.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', verifyToken);
router.get('/principal', authRequired, principal);
router.get('/profile', authRequired, profile);

export default router;