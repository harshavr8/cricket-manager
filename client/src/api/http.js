import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Teams
export const getTeams = () => http.get("/teams");
export const getTeam = (id) => http.get(`/teams/${id}`);
export const createTeam = (data) => http.post("/teams", data);
export const updateTeam = (id, data) => http.put(`/teams/${id}`, data);
export const deleteTeam = (id) => http.delete(`/teams/${id}`);

// Players
export const getPlayers = (params = {}) => http.get("/players", { params });
export const getPlayer = (id) => http.get(`/players/${id}`);
export const createPlayer = (data) => http.post("/players", data);
export const updatePlayer = (id, data) => http.put(`/players/${id}`, data);
export const deletePlayer = (id) => http.delete(`/players/${id}`);

// Matches
export const getMatches = () => http.get("/matches");
export const getMatch = (id) => http.get(`/matches/${id}`);
export const createMatch = (data) => http.post("/matches", data);
export const updateMatch = (id, data) => http.put(`/matches/${id}`, data);
export const deleteMatch = (id) => http.delete(`/matches/${id}`);
