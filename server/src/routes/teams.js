import { Router } from "express";
import { listTeams, getTeam, createTeam, updateTeam, deleteTeam } from "../controllers/teamsController.js";

const router = Router();

router.get("/", listTeams);
router.get("/:id", getTeam);
router.post("/", createTeam);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);

export default router;
