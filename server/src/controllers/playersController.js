import { Player } from "../models/Player.js";
import { Team } from "../models/Team.js";

/**
 * GET /api/players?teamId=&q=
 */
export const listPlayers = async (req, res, next) => {
  try {
    const { teamId, q } = req.query;
    const filter = {};
    if (teamId) filter.team = teamId;
    if (q) filter.name = { $regex: q, $options: "i" };

    const players = await Player.find(filter).populate("team").sort({ name: 1 });
    res.json(players);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/players/:id
 */
export const getPlayer = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id).populate("team");
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json(player);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/players
 * { name, role, batting_style?, bowling_style?, team?, matches?, runs?, wickets?, jerseyNumber? }
 */
export const createPlayer = async (req, res, next) => {
  try {
    const { name, role, batting_style, bowling_style, team, matches, runs, wickets, jerseyNumber } =
      req.body;

    if (!name || !role) {
      return res.status(400).json({ error: "name and role are required" });
    }

    let teamDoc = null;
    if (team) {
      teamDoc = await Team.findById(team);
      if (!teamDoc) return res.status(400).json({ error: "Invalid team ID" });
    }

    const player = await Player.create({
      name,
      role,
      batting_style,
      bowling_style,
      team: team || undefined,
      matches,
      runs,
      wickets,
      jerseyNumber,
    });

    // If assigned to a team, add to roster
    if (teamDoc) {
      await Team.findByIdAndUpdate(teamDoc._id, { $addToSet: { players: player._id } });
    }

    const populated = await Player.findById(player._id).populate("team");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/players/:id
 * Handle possible team change (update roster arrays)
 */
export const updatePlayer = async (req, res, next) => {
  try {
    const { team: newTeamId, ...rest } = req.body;

    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: "Player not found" });

    const oldTeamId = player.team ? player.team.toString() : null;
    let validatedNewTeamId = null;

    if (newTeamId) {
      const newTeam = await Team.findById(newTeamId);
      if (!newTeam) return res.status(400).json({ error: "Invalid team ID" });
      validatedNewTeamId = newTeamId;
    }

    // Update player
    player.set({ ...rest, team: validatedNewTeamId || null });
    await player.save();

    // Update roster membership if team changed
    if (oldTeamId && oldTeamId !== validatedNewTeamId) {
      await Team.findByIdAndUpdate(oldTeamId, { $pull: { players: player._id } });
    }
    if (validatedNewTeamId && oldTeamId !== validatedNewTeamId) {
      await Team.findByIdAndUpdate(validatedNewTeamId, { $addToSet: { players: player._id } });
    }

    const populated = await Player.findById(player._id).populate("team");
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/players/:id
 * Remove from team roster if needed
 */
export const deletePlayer = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: "Player not found" });

    if (player.team) {
      await Team.findByIdAndUpdate(player.team, { $pull: { players: player._id } });
    }

    await Player.findByIdAndDelete(player._id);
    res.json({ message: "Player deleted" });
  } catch (err) {
    next(err);
  }
};
