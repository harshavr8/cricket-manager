import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      },
    ],
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      default: "",
    },
    toss: {
      wonBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
      decision: {
        type: String,
        enum: ["bat", "bowl"],
      },
    },
    scores: {
      team1: {
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        overs: { type: Number, default: 0 },
      },
      team2: {
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        overs: { type: Number, default: 0 },
      },
    },
    result: {
      winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
      summary: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

export const Match = mongoose.model("Match", matchSchema);
