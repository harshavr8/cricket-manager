import { Match } from "../models/Match.js";
import { Team } from "../models/Team.js";

/**
 * GET /api/matches
 * Sorted by date desc
 */
export const listMatches = async (req, res, next) => {
  try {
    const matches = await Match.find({})
      .populate("teams")
      .populate("result.winner")
      .sort({ date: -1 });
    res.json(matches);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/matches/:id
 */
export const getMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("teams")
      .populate("result.winner")
      .populate("toss.wonBy");
    if (!match) return res.status(404).json({ error: "Match not found" });
    res.json(match);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/matches
 * { teams: [team1, team2], date, venue? }
 */
export const createMatch = async (req, res, next) => {
  try {
    const { teams, date, venue } = req.body;
    if (!teams || !Array.isArray(teams) || teams.length !== 2) {
      return res.status(400).json({ error: "Provide exactly two teams" });
    }
    if (teams[0] === teams[1]) {
      return res.status(400).json({ error: "Teams must be different" });
    }
    if (!date) return res.status(400).json({ error: "date is required" });

    // Validate teams
    const t1 = await Team.findById(teams[0]);
    const t2 = await Team.findById(teams[1]);
    if (!t1 || !t2) return res.status(400).json({ error: "Invalid team IDs" });

    const match = await Match.create({
      teams: [t1._id, t2._id],
      date,
      venue,
    });

    const populated = await Match.findById(match._id).populate("teams");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/matches/:id
 * Update date, venue, toss, scores, result
 */
export const updateMatch = async (req, res, next) => {
  try {
    const { date, venue, toss, scores, result } = req.body;

    // Validate toss/result team IDs if provided
    if (toss?.wonBy) {
      const t = await Team.findById(toss.wonBy);
      if (!t) return res.status(400).json({ error: "Invalid toss.wonBy team ID" });
    }
    if (result?.winner) {
      const t = await Team.findById(result.winner);
      if (!t) return res.status(400).json({ error: "Invalid result.winner team ID" });
    }

    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { $set: { date, venue, toss, scores, result } },
      { new: true, runValidators: true }
    )
      .populate("teams")
      .populate("result.winner")
      .populate("toss.wonBy");

    if (!match) return res.status(404).json({ error: "Match not found" });

    res.json(match);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/matches/:id
 */
export const deleteMatch = async (req, res, next) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ error: "Match not found" });
    res.json({ message: "Match deleted" });
  } catch (err) {
    next(err);
  }
};
