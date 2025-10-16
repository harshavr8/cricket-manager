import { Router } from "express";
import { listPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer } from "../controllers/playersController.js";

const router = Router();

router.get("/", listPlayers);
router.get("/:id", getPlayer);
router.post("/", createPlayer);
router.put("/:id", updatePlayer);
router.delete("/:id", deletePlayer);

export default router;
