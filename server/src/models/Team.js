import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    shortName: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
  },
  { timestamps: true }
);

export const Team = mongoose.model("Team", teamSchema);
