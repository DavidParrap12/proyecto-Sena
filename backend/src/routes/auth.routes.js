import { Router } from "express";
import {
    login, 
    logout, 
    register,
    dashboard
} from '../controllers/auth.controller.js'
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.get('/dashboard', authRequired, dashboard);

export default router