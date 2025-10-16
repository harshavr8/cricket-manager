import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./src/db.js";
import { errorHandler } from "./src/utils/errorHandler.js";

// Ensure models are registered
import "./src/models/Team.js";
import "./src/models/Player.js";
import "./src/models/Match.js";

// NEW: import routers
import teamsRouter from "./src/routes/teams.js";
import playersRouter from "./src/routes/players.js";
import matchesRouter from "./src/routes/matches.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// DB
connectDB();

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Cricket Manager API is running!" });
});

// ✅ Mount real routers
app.use("/api/teams", teamsRouter);
app.use("/api/players", playersRouter);
app.use("/api/matches", matchesRouter);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
