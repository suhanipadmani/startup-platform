import { Router } from "express";
import { register, login, getMe, logout, forgotPassword, resetPassword, updateProfile, changePassword, deleteAccount } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../schemas";

const router = Router();

router.get('/me', authenticate, getMe);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post('/logout', authenticate, logout);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.put('/reset-password/:token', validate(resetPasswordSchema), resetPassword);
router.put("/profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);
router.delete("/delete-account", authenticate, deleteAccount);

export default router;
