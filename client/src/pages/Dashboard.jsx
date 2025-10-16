import { useEffect, useMemo, useState } from "react";
import { getPlayers, getMatches } from "../api/http";
import Loading from "../components/Loading";
import Notice from "../components/Notice";
import { formatDateTime } from "../utils/datetime";

export default function Dashboard() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const [{ data: playersData }, { data: matchesData }] = await Promise.all([
        getPlayers(), getMatches()
      ]);
      setPlayers(playersData);
      setMatches(matchesData);
    } catch (e) {
      setErr("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const topRuns = useMemo(() => [...players].sort((a,b)=> (b.runs||0)-(a.runs||0)).slice(0,3), [players]);
  const topWkts = useMemo(() => [...players].sort((a,b)=> (b.wickets||0)-(a.wickets||0)).slice(0,3), [players]);
  const recentMatches = useMemo(() => [...matches].slice(0,5), [matches]);

  return (
    <div className="space-y-6">
      <h1 className="page-title">Dashboard</h1>

      {err && <Notice type="error">{err}</Notice>}
      {loading && <Loading label="Loading dashboard…" />}

      <div className="grid-2">
        <div className="card">
          <h2 className="text-lg font-semibold mb-3">Top Runs</h2>
          <ul className="space-y-2">
            {topRuns.map(p => (
              <li key={p._id} className="flex justify-between">
                <span>{p.name}</span>
                <span className="font-medium">{p.runs ?? 0}</span>
              </li>
            ))}
            {topRuns.length === 0 && <p className="text-sm text-gray-600">No data.</p>}
          </ul>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-3">Top Wickets</h2>
          <ul className="space-y-2">
            {topWkts.map(p => (
              <li key={p._id} className="flex justify-between">
                <span>{p.name}</span>
                <span className="font-medium">{p.wickets ?? 0}</span>
              </li>
            ))}
            {topWkts.length === 0 && <p className="text-sm text-gray-600">No data.</p>}
          </ul>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Recent Matches</h2>
        <ul className="space-y-2">
          {recentMatches.map(m => (
            <li key={m._id} className="flex items-center justify-between border rounded-md p-3">
              <div>
                <div className="font-medium">{m.teams?.[0]?.name} vs {m.teams?.[1]?.name}</div>
                <div className="text-xs text-gray-600">
                  {m.venue || "—"} • {formatDateTime(m.date)}
                </div>
                {m.result?.winner && <div className="text-sm mt-1">{m.result.summary}</div>}
              </div>
            </li>
          ))}
          {recentMatches.length === 0 && <p className="text-sm text-gray-600">No matches yet.</p>}
        </ul>
      </div>
    </div>
  );
}
