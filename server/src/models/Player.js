import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"],
      required: true,
    },
    batting_style: {
      type: String,
      default: "",
    },
    bowling_style: {
      type: String,
      default: "",
    },
    matches: {
      type: Number,
      default: 0,
    },
    runs: {
      type: Number,
      default: 0,
    },
    wickets: {
      type: Number,
      default: 0,
    },
    jerseyNumber: {
      type: Number,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  },
  { timestamps: true }
);

export const Player = mongoose.model("Player", playerSchema);
