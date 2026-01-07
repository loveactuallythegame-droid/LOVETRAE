import { useEffect, useState } from 'react';
import Protected from '@/components/Protected';
import { supabase } from '@/lib/supabaseClient';
import GameForm from '@/components/admin/GameForm';

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState<any | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [versionsFor, setVersionsFor] = useState<string | null>(null);
  function load() { supabase.from('games').select('*').then((r: { data: any[] }) => setGames(r.data || [])); }
  useEffect(() => { load(); }, []);
  async function remove(id: string) {
    const { data } = await supabase.auth.getSession();
    await fetch('/api/games/delete', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json', 'x-user-id': data.session?.user?.id || '' },
      body: JSON.stringify({ id }) 
    });
    load();
  }
  return (
    <Protected>
      <div className="card"><h2>Game CMS</h2></div>
      <div className="card">
        <div className="row" style={{ gap: 12 }}>
          <input className="input" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            <option value="Emotional">Emotional</option>
            <option value="Conflict">Conflict</option>
            <option value="Creative">Creative</option>
            <option value="Romance">Romance</option>
          </select>
          <button className="btn" onClick={() => {
            const ids = Object.keys(selected).filter((k) => selected[k]);
            Promise.all(ids.map(async (id) => await remove(id))).then(() => setSelected({}));
          }}>Bulk Delete</button>
        </div>
      </div>
      <GameForm initial={editing || undefined} onSaved={() => { setEditing(null); load(); }} />
      <div className="card">
        {preview && (
          <div className="card" style={{ marginBottom: 12 }}>
            <h3>Preview</h3>
            <div className="row" style={{ gap: 12 }}>
              <div>Title: {preview.name}</div>
              <div>Category: {preview.category}</div>
              <div>XP: {preview.xp_reward}</div>
              <div>Difficulty: {preview.difficulty}</div>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{preview.marcies_script || ''}</div>
            <div className="row" style={{ marginTop: 8 }}>
              <button className="btn" onClick={() => setPreview(null)}>Close</button>
            </div>
          </div>
        )}
        <table className="table">
          <thead><tr><th></th><th>Title</th><th>Category</th><th>XP</th><th>Difficulty</th><th></th></tr></thead>
          <tbody>
            {games
              .filter((g) => (!category || g.category === category) && (!query || (g.name || '').toLowerCase().includes(query.toLowerCase())))
              .map((g) => (
              <tr key={g.id}>
                <td><input type="checkbox" checked={!!selected[g.id]} onChange={(e) => setSelected((s) => ({ ...s, [g.id]: e.target.checked }))} /></td>
                <td>{g.name}</td>
                <td>{g.category}</td>
                <td>{g.xp_reward}</td>
                <td>{g.difficulty || '-'}</td>
                <td>
                  <button className="btn" onClick={() => setEditing(g)}>Edit</button>
                  <button className="btn" onClick={() => setPreview(g)}>Preview</button>
                  <button className="btn" onClick={async () => {
                    const res = await fetch(`/api/games/versions?id=${g.id}`);
                    if (res.ok) { const json = await res.json(); setVersions(json.data || []); setVersionsFor(g.id); }
                  }}>Versions</button>
                  <button className="btn" onClick={() => remove(g.id)} style={{ background: '#E11637' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {versionsFor && (
          <div className="card" style={{ marginTop: 12 }}>
            <h3>Versions</h3>
            <table className="table">
              <thead><tr><th>ID</th><th>Created</th><th></th></tr></thead>
              <tbody>
                {versions.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.created_at}</td>
                    <td>
                      <button className="btn" onClick={async () => {
                        const { data } = await supabase.auth.getSession();
                        await fetch('/api/games/versions', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'x-user-id': data.session?.user?.id || '' },
                          body: JSON.stringify({ action: 'rollback', id: versionsFor, version_id: v.id })
                        });
                        setVersionsFor(null);
                        load();
                      }}>Rollback</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="row"><button className="btn" onClick={() => setVersionsFor(null)}>Close</button></div>
          </div>
        )}
      </div>
    </Protected>
  );
}
