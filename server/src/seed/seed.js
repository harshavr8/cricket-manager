import dotenv from "dotenv";
import mongoose from "mongoose";
import { Team } from "../models/Team.js";
import { Player } from "../models/Player.js";
import { Match } from "../models/Match.js";

dotenv.config();

const playersIndia = [
  { name: "Rohit Sharma", role: "Batsman", batting_style: "Right-hand bat", bowling_style: "Right-arm offbreak", matches: 250, runs: 13456, wickets: 10 },
  { name: "Virat Kohli", role: "Batsman", batting_style: "Right-hand bat", bowling_style: "Right-arm medium", matches: 270, runs: 12345, wickets: 5 },
  { name: "Jasprit Bumrah", role: "Bowler",  batting_style: "Right-hand bat", bowling_style: "Right-arm fast", matches: 100, runs: 454, wickets: 321 },
  { name: "Hardik Pandya", role: "All-rounder", batting_style: "Right-hand bat", bowling_style: "Right-arm medium-fast", matches: 120, runs: 2523, wickets: 88 },
  { name: "Ravindra Jadeja", role: "All-rounder", batting_style: "Left-hand bat", bowling_style: "Left-arm orthodox", matches: 180, runs: 3230, wickets: 185 },
];

// a few simple Australian players so we can schedule a match
const playersAustralia = [
  { name: "David Warner", role: "Batsman", batting_style: "Left-hand bat", bowling_style: "Right-arm legbreak", matches: 150, runs: 6500, wickets: 4 },
  { name: "Pat Cummins", role: "Bowler", batting_style: "Right-hand bat", bowling_style: "Right-arm fast", matches: 120, runs: 750, wickets: 250 },
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI missing in .env");
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB (seeding)…");

    // 1) Clear old data (idempotent seed)
    await Match.deleteMany({});
    await Player.deleteMany({});
    await Team.deleteMany({});

    // 2) Create teams
    const india = await Team.create({ name: "India", shortName: "IND", logo: "" });
    const australia = await Team.create({ name: "Australia", shortName: "AUS", logo: "" });

    // 3) Create players and assign to teams
    const createdIndiaPlayers = await Player.insertMany(playersIndia.map(p => ({ ...p, team: india._id })));
    const createdAusPlayers   = await Player.insertMany(playersAustralia.map(p => ({ ...p, team: australia._id })));

    // 4) Update team rosters
    await Team.findByIdAndUpdate(india._id, { $set: { players: createdIndiaPlayers.map(p => p._id) } });
    await Team.findByIdAndUpdate(australia._id, { $set: { players: createdAusPlayers.map(p => p._id) } });

    // 5) Create matches: one upcoming, one completed
    const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    await Match.create({
      teams: [india._id, australia._id],
      date: in7Days,
      venue: "Wankhede Stadium",
    });

    await Match.create({
      teams: [india._id, australia._id],
      date: yesterday,
      venue: "MCG",
      toss: { wonBy: india._id, decision: "bat" },
      scores: {
        team1: { runs: 302, wickets: 7, overs: 50 },
        team2: { runs: 289, wickets: 9, overs: 50 },
      },
      result: { winner: india._id, summary: "India won by 13 runs" },
    });

    console.log("✅ Seed complete:");
    console.log(`  Teams: India (${createdIndiaPlayers.length} players), Australia (${createdAusPlayers.length} players)`);
    console.log("  Matches: 1 upcoming, 1 completed");
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected.");
    process.exit(0);
  }
}

seed();
