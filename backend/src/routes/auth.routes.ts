import { Router } from "express";
import { register, login, getMe, logout, forgotPassword, resetPassword } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get('/me', authenticate, getMe);
router.post("/register", register);
router.post("/login", login);
router.post('/logout', authenticate, logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
