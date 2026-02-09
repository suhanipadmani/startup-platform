import { Router } from "express";
import {
  getAllProjects,
  approveProject,
  rejectProject,
} from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate, allowRoles("admin"));

router.get("/projects", getAllProjects);
router.put("/projects/:id/approve", approveProject);
router.put("/projects/:id/reject", rejectProject);

export default router;
