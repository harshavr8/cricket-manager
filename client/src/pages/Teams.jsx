import { useEffect, useState } from "react";
import { getTeams, createTeam, deleteTeam } from "../api/http";
import Loading from "../components/Loading";
import Notice from "../components/Notice";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: "", shortName: "", logo: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await getTeams();
      setTeams(data);
    } catch (e) {
      setErr("Failed to load teams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Team name is required");
    try {
      await createTeam(form);
      setForm({ name: "", shortName: "", logo: "" });
      load();
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to create team");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this team? (Only works if no players in roster)")) return;
    try {
      await deleteTeam(id);
      load();
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to delete team");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="page-title">Teams</h1>

      {err && <Notice type="error">{err}</Notice>}
      {loading && <Loading />}

      <form onSubmit={onCreate} className="card grid-2">
        <div>
          <div className="label">Team Name *</div>
          <input className="input" value={form.name}
                 onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="India" />
        </div>
        <div>
          <div className="label">Short Name</div>
          <input className="input" value={form.shortName}
                 onChange={(e) => setForm({ ...form, shortName: e.target.value })} placeholder="IND" />
        </div>
        <div className="md:col-span-2">
          <div className="label">Logo URL</div>
          <input className="input" value={form.logo}
                 onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="https://..." />
        </div>
        <div className="md:col-span-2">
          <button className="btn btn-primary" type="submit">Add Team</button>
        </div>
      </form>

      <div className="card">
        <h2 className="text-lg font-semibold mb-3">All Teams</h2>
        {loading ? <Loading /> : (
          <ul className="space-y-2">
            {teams.map(t => (
              <li key={t._id} className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-3">
                  {t.logo ? <img src={t.logo} alt="" className="h-8 w-8 rounded-full object-cover" /> : <div className="h-8 w-8 rounded-full bg-gray-200" />}
                  <div>
                    <div className="font-medium">{t.name}</div>
                    {t.shortName && <div className="text-xs text-gray-500">{t.shortName}</div>}
                  </div>
                </div>
                <button className="btn btn-ghost" onClick={() => onDelete(t._id)}>Delete</button>
              </li>
            ))}
            {teams.length === 0 && <p className="text-sm text-gray-600">No teams yet.</p>}
          </ul>
        )}
      </div>
    </div>
  );
}
