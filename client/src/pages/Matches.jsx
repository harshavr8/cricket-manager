import { useEffect, useState } from "react";
import { getTeams, getMatches, createMatch, updateMatch, deleteMatch } from "../api/http";
import Loading from "../components/Loading";
import Notice from "../components/Notice";
import { formatDateTime } from "../utils/datetime";

export default function Matches() {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({ team1: "", team2: "", date: "", venue: "" });

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const [{ data: teamsData }, { data: matchesData }] = await Promise.all([getTeams(), getMatches()]);
      setTeams(teamsData);
      setMatches(matchesData);
    } catch (e) {
      setErr("Failed to load matches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!form.team1 || !form.team2 || form.team1 === form.team2) return alert("Pick two different teams");
    if (!form.date) return alert("Pick a date/time");
    await createMatch({ teams: [form.team1, form.team2], date: new Date(form.date).toISOString(), venue: form.venue });
    setForm({ team1: "", team2: "", date: "", venue: "" });
    await load();
  };

  const giveResultTeam1 = async (m) => {
    const [t1, t2] = m.teams.map(t => t._id);
    await updateMatch(m._id, {
      scores: { team1: { runs: 180, wickets: 6, overs: 20 }, team2: { runs: 175, wickets: 7, overs: 20 } },
      result: { winner: t1, summary: `${m.teams[0].name} won by 5 runs` }
    });
    await load();
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this match?")) return;
    await deleteMatch(id);
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="page-title">Matches</h1>

      {err && <Notice type="error">{err}</Notice>}
      {loading && <Loading />}

      <form onSubmit={onCreate} className="card grid-2">
        <div>
          <div className="label">Team 1 *</div>
          <select className="input" value={form.team1} onChange={(e)=>setForm({...form, team1:e.target.value})}>
            <option value="">Select team</option>
            {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <div className="label">Team 2 *</div>
          <select className="input" value={form.team2} onChange={(e)=>setForm({...form, team2:e.target.value})}>
            <option value="">Select team</option>
            {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <div className="label">Date & Time *</div>
          <input type="datetime-local" className="input" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} />
        </div>
        <div>
          <div className="label">Venue</div>
          <input className="input" value={form.venue} onChange={(e)=>setForm({...form, venue:e.target.value})} placeholder="Wankhede Stadium" />
        </div>
        <div className="md:col-span-2">
          <button className="btn btn-primary" type="submit">Schedule Match</button>
        </div>
      </form>

      <div className="card">
        <h2 className="text-lg font-semibold mb-3">All Matches</h2>
        {loading ? <Loading /> : (
          <ul className="space-y-2">
            {matches.map(m => (
              <li key={m._id} className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <div className="font-medium">
                    {m.teams?.[0]?.name} vs {m.teams?.[1]?.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {m.venue || "—"} • {formatDateTime(m.date)}
                  </div>
                  {m.result?.winner && (
                    <div className="text-sm mt-1">Result: {m.result.summary}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  {!m.result?.winner && (
                    <button className="btn btn-ghost" onClick={() => giveResultTeam1(m)}>Set Sample Result</button>
                  )}
                  <button className="btn btn-ghost" onClick={() => onDelete(m._id)}>Delete</button>
                </div>
              </li>
            ))}
            {matches.length === 0 && <p className="text-sm text-gray-600">No matches yet.</p>}
          </ul>
        )}
      </div>
    </div>
  );
}
