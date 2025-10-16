import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Teams from "./pages/Teams.jsx";
import Players from "./pages/Players.jsx";
import Matches from "./pages/Matches.jsx";

const Nav = () => {
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-100"}`;

  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">🏏 Cricket Manager</span>
        </div>
        <div className="flex gap-2">
          <NavLink to="/" className={linkClass} end>Dashboard</NavLink>
          <NavLink to="/teams" className={linkClass}>Teams</NavLink>
          <NavLink to="/players" className={linkClass}>Players</NavLink>
          <NavLink to="/matches" className={linkClass}>Matches</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <div>
      <Nav />
      <main className="container py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/players" element={<Players />} />
          <Route path="/matches" element={<Matches />} />
        </Routes>
      </main>
    </div>
  );
}
