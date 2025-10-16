import { useEffect, useMemo, useRef, useState } from "react";
import { getPlayers, getTeams, createPlayer, deletePlayer, updatePlayer } from "../api/http";
import Loading from "../components/Loading";
import Notice from "../components/Notice";

export default function Players() {
  // ---- data ----
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);

  // ---- ui state ----
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  // ---- filters ----
  const [q, setQ] = useState("");
  const [teamId, setTeamId] = useState("");
  const [sortBy, setSortBy] = useState("name-asc"); // name-asc | runs-desc | wickets-desc | matches-desc

  // ---- form ----
  const [form, setForm] = useState({
    name: "",
    role: "Batsman",
    batting_style: "",
    bowling_style: "",
    matches: 0,
    runs: 0,
    wickets: 0,
    team: "",
    jerseyNumber: ""
  });

  // ---- helpers ----
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  // Load teams and players
  const load = async ({ withFilters = true } = {}) => {
    setLoading(true);
    setErr("");
    try {
      const [{ data: teamsData }, { data: playersData }] = await Promise.all([
        getTeams(),
        getPlayers(withFilters ? { q, teamId: teamId || undefined } : {})
      ]);
      setTeams(teamsData);
      setPlayers(playersData);
    } catch (e) {
      setErr("Failed to load players.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => { load({ withFilters: true }); /* eslint-disable-next-line */ }, []);

  // Debounced search/filter reload
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      load({ withFilters: true });
    }, 300);
    return () => clearTimeout(debounceTimer.current);
    // eslint-disable-next-line
  }, [q, teamId]);

  // ---- actions ----
  const onCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Player name required");
    setCreating(true);
    try {
      await createPlayer({
        ...form,
        team: form.team || undefined,
        matches: Number(form.matches) || 0,
        runs: Number(form.runs) || 0,
        wickets: Number(form.wickets) || 0,
        jerseyNumber: form.jerseyNumber ? Number(form.jerseyNumber) : undefined
      });
      setForm({
        name: "",
        role: "Batsman",
        batting_style: "",
        bowling_style: "",
        matches: 0,
        runs: 0,
        wickets: 0,
        team: "",
        jerseyNumber: ""
      });
      setShowAdd(false);
      await load({ withFilters: true });
      searchRef.current?.focus();
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to create player");
    } finally {
      setCreating(false);
    }
  };

  const bumpRuns = async (p) => {
    await updatePlayer(p._id, { runs: (p.runs || 0) + 10 });
    await load({ withFilters: true });
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this player?")) return;
    await deletePlayer(id);
    await load({ withFilters: true });
  };

  const clearFilters = () => {
    setQ("");
    setTeamId("");
    setSortBy("name-asc");
    load({ withFilters: false });
  };

  // ---- sorting (client-side) ----
  const sortedPlayers = useMemo(() => {
    const arr = [...players];
    switch (sortBy) {
      case "runs-desc":
        arr.sort((a, b) => (b.runs || 0) - (a.runs || 0));
        break;
      case "wickets-desc":
        arr.sort((a, b) => (b.wickets || 0) - (a.wickets || 0));
        break;
      case "matches-desc":
        arr.sort((a, b) => (b.matches || 0) - (a.matches || 0));
        break;
      case "name-asc":
      default:
        arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    return arr;
  }, [players, sortBy]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="page-title">Players</h1>

      {/* Notices & loading */}
      {err && <Notice type="error">{err}</Notice>}
      {loading && <Loading />}

      {/* Filters row */}
      <section className="card grid-2">
        <div>
          <div className="label">Search</div>
          <input
            ref={searchRef}
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a name…"
          />
        </div>
        <div>
          <div className="label">Filter by Team</div>
          <select className="input" value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            <option value="">All Teams</option>
            {teams.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="label">Sort By</div>
          <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name-asc">Name (A → Z)</option>
            <option value="runs-desc">Runs (High → Low)</option>
            <option value="wickets-desc">Wickets (High → Low)</option>
            <option value="matches-desc">Matches (High → Low)</option>
          </select>
        </div>
        <div className="flex items-end justify-between gap-2">
          <button className="btn btn-ghost" type="button" onClick={clearFilters}>
            Reset Filters
          </button>
          <button className="btn btn-primary" type="button" onClick={() => setShowAdd(true)}>
            + Add Player
          </button>
        </div>
      </section>

      {/* Players table (immediately under filters) */}
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">All Players</h2>
          <div className="text-sm text-gray-600">
            Showing <strong>{sortedPlayers.length}</strong> player{sortedPlayers.length !== 1 ? "s" : ""}
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Team</th>
                  <th className="py-2 pr-4">Matches</th>
                  <th className="py-2 pr-4">Runs</th>
                  <th className="py-2 pr-4">Wickets</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((p) => (
                  <tr key={p._id} className="border-b">
                    <td className="py-2 pr-4">{p.name}</td>
                    <td className="py-2 pr-4">{p.role}</td>
                    <td className="py-2 pr-4">{p.team?.name || "-"}</td>
                    <td className="py-2 pr-4">{p.matches ?? 0}</td>
                    <td className="py-2 pr-4">{p.runs ?? 0}</td>
                    <td className="py-2 pr-4">{p.wickets ?? 0}</td>
                    <td className="py-2 pr-4 flex gap-2">
                      <button className="btn btn-ghost" onClick={() => bumpRuns(p)}>
                        +10 Runs
                      </button>
                      <button className="btn btn-ghost" onClick={() => onDelete(p._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {sortedPlayers.length === 0 && (
                  <tr>
                    <td className="py-3 text-gray-600" colSpan="7">
                      No players.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add Player Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-semibold">Add Player</h3>
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Close</button>
            </div>
            <form onSubmit={onCreate} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="label">Name *</div>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Rohit Sharma"
                />
              </div>
              <div>
                <div className="label">Role *</div>
                <select
                  className="input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option>Batsman</option>
                  <option>Bowler</option>
                  <option>All-rounder</option>
                  <option>Wicket-keeper</option>
                </select>
              </div>
              <div>
                <div className="label">Batting Style</div>
                <input
                  className="input"
                  value={form.batting_style}
                  onChange={(e) => setForm({ ...form, batting_style: e.target.value })}
                  placeholder="Right-hand bat"
                />
              </div>
              <div>
                <div className="label">Bowling Style</div>
                <input
                  className="input"
                  value={form.bowling_style}
                  onChange={(e) => setForm({ ...form, bowling_style: e.target.value })}
                  placeholder="Right-arm fast"
                />
              </div>
              <div>
                <div className="label">Team</div>
                <select
                  className="input"
                  value={form.team}
                  onChange={(e) => setForm({ ...form, team: e.target.value })}
                >
                  <option value="">No Team</option>
                  {teams.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="label">Jersey #</div>
                <input
                  type="number"
                  className="input"
                  value={form.jerseyNumber}
                  onChange={(e) => setForm({ ...form, jerseyNumber: e.target.value })}
                />
              </div>
              <div>
                <div className="label">Matches</div>
                <input
                  type="number"
                  className="input"
                  value={form.matches}
                  onChange={(e) => setForm({ ...form, matches: e.target.value })}
                />
              </div>
              <div>
                <div className="label">Runs</div>
                <input
                  type="number"
                  className="input"
                  value={form.runs}
                  onChange={(e) => setForm({ ...form, runs: e.target.value })}
                />
              </div>
              <div>
                <div className="label">Wickets</div>
                <input
                  type="number"
                  className="input"
                  value={form.wickets}
                  onChange={(e) => setForm({ ...form, wickets: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <button className="btn btn-ghost" type="button" onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit" disabled={creating}>
                  {creating ? "Adding…" : "Add Player"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
