import { Router } from "express";
import { listMatches, getMatch, createMatch, updateMatch, deleteMatch } from "../controllers/matchesController.js";

const router = Router();

router.get("/", listMatches);
router.get("/:id", getMatch);
router.post("/", createMatch);
router.put("/:id", updateMatch);
router.delete("/:id", deleteMatch);

export default router;
