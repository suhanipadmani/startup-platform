import { Router } from "express";
import { createIdea, getMyIdeas, getIdeaById, updateIdea, deleteIdea, getIdeaStats } from "../controllers/idea.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { ideaSchema } from "../schemas";

const router = Router();

router.use(authenticate, allowRoles("founder", "admin"));

router.post("/", validate(ideaSchema), createIdea);
router.get("/stats", getIdeaStats);
router.get("/", getMyIdeas);
router.get("/:id", getIdeaById);
router.put("/:id", validate(ideaSchema), updateIdea);
router.delete("/:id", deleteIdea);

export default router;
