import { Team } from "../models/Team.js";
import { Player } from "../models/Player.js";

/**
 * GET /api/teams?q=
 */
export const listTeams = async (req, res, next) => {
  try {
    const { q } = req.query;
    const filter = q ? { name: { $regex: q, $options: "i" } } : {};
    const teams = await Team.find(filter).sort({ name: 1 });
    res.json(teams);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/teams/:id
 * Populate roster
 */
export const getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate("players");
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.json(team);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/teams
 * { name, shortName?, logo? }
 */
export const createTeam = async (req, res, next) => {
  try {
    const { name, shortName, logo } = req.body;
    if (!name) return res.status(400).json({ error: "Team name is required" });
    const exists = await Team.findOne({ name });
    if (exists) return res.status(400).json({ error: "Team name already exists" });

    const team = await Team.create({ name, shortName, logo });
    res.status(201).json(team);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/teams/:id
 */
export const updateTeam = async (req, res, next) => {
  try {
    const { name, shortName, logo } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $set: { name, shortName, logo } },
      { new: true, runValidators: true }
    );
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.json(team);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/teams/:id
 * Prevent delete if roster not empty (simple rule)
 */
export const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate("players");
    if (!team) return res.status(404).json({ error: "Team not found" });

    if (team.players && team.players.length > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete a team that still has players. Remove/move players first." });
    }

    await Team.findByIdAndDelete(team._id);
    res.json({ message: "Team deleted" });
  } catch (err) {
    next(err);
  }
};
