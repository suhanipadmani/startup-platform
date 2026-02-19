import { Router } from "express";
import {
  getAllProjects,
  approveProject,
  rejectProject,
  getAllUsers,
  deleteUser,
  updateUser
} from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { getSystemStats, getGrowthStats } from "../controllers/analytics.controller";
import { validate } from "../middlewares/validate.middleware";
import { reviewSchema, updateUserSchema } from "../schemas";

const router = Router();

router.use(authenticate, allowRoles("admin"));

router.get("/ideas", getAllProjects);
router.put("/ideas/:id/approve", validate(reviewSchema), approveProject);
router.put("/ideas/:id/reject", validate(reviewSchema), rejectProject);

router.get("/analytics/stats", getSystemStats);
router.get("/analytics/growth", getGrowthStats);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", validate(updateUserSchema), updateUser);

export default router;
