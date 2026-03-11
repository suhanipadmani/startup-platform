import { createIdea, getMyIdeas, getIdeaById, updateIdea, deleteIdea, getIdeaStats, uploadDocument } from "../controllers/idea.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { ideaSchema } from "../schemas";
import { upload } from "../middlewares/upload.middleware";
import { Router } from "express";

const router = Router();

router.use(authenticate, allowRoles("founder", "admin"));

router.post("/", upload.single("pitchDeck"), validate(ideaSchema), createIdea);
router.get("/stats", getIdeaStats);
router.get("/", getMyIdeas);
router.get("/:id", getIdeaById);
router.put("/:id", upload.single("pitchDeck"), validate(ideaSchema), updateIdea);
router.post("/:id/documents", upload.single("document"), uploadDocument);
router.delete("/:id", deleteIdea);

export default router;
