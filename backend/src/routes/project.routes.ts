import { Router } from "express";
import {
    submitIdea,
    getMyIdeas,
    getIdeaById,
} from "../controllers/project.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate, allowRoles("founder"));

router.post("/", submitIdea);
router.get("/my", getMyIdeas);
router.get("/:id", getIdeaById);

export default router;
