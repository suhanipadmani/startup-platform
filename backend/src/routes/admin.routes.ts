import { Router } from "express";
import {
  getAllProjects,
  approveProject,
  rejectProject,
} from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { getSystemStats, getGrowthStats } from "../controllers/analytics.controller";

const router = Router();

router.use(authenticate, allowRoles("admin"));

router.get("/projects", getAllProjects);
router.put("/projects/:id/approve", approveProject);
router.put("/projects/:id/reject", rejectProject);

router.get("/analytics/stats", getSystemStats);
router.get("/analytics/growth", getGrowthStats);

export default router;
