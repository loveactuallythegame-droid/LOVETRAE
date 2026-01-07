import { useEffect, useState } from 'react';
import Protected from '@/components/Protected';
import { createHash } from 'crypto';

type Tester = {
  user_id: string;
  email: string;
  code: string;
  activatedAt: string;
  isAdmin: boolean;
};

export default function BetaPage() {
  const [testers, setTesters] = useState<Tester[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [genEmail, setGenEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/beta/list');
    const json = await res.json();
    setTesters(json.testers || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  async function revoke(ids: string[]) {
    if (!confirm(`Revoke access for ${ids.length} users?`)) return;
    await fetch('/api/beta/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_ids: ids })
    });
    load();
    setSelected(new Set());
  }

  async function toggleAdmin(user_id: string, currentStatus: boolean) {
    await fetch('/api/beta/toggle-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, grant: !currentStatus })
    });
    load();
  }

  function generateCode() {
    if (!genEmail) return;
    // Client-side simulation of the algorithm for display
    // In a real app, maybe call an API to ensure consistency
    // hash: sha256 of trimmed lowercase email, take first 8 chars
    const hash = async (str: string) => {
        const msgBuffer = new TextEncoder().encode(str.trim().toLowerCase());
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex.slice(0, 8).toUpperCase();
    };
    
    hash(genEmail).then(h => setGeneratedCode(`BETATESTER${h}`));
  }

  return (
    <Protected>
      <div className="card">
        <h2>Beta Management</h2>
        <div className="row" style={{ gap: 12, marginTop: 12, alignItems: 'flex-end' }}>
          <div>
            <label>Generate Code for Email</label>
            <input className="input" value={genEmail} onChange={e => setGenEmail(e.target.value)} placeholder="user@example.com" />
          </div>
          <button className="btn" onClick={generateCode}>Generate</button>
          {generatedCode && <span className="tag" style={{ fontSize: '1.2em' }}>{generatedCode}</span>}
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
            <h3>Active Testers ({testers.length})</h3>
            {selected.size > 0 && (
                <button className="btn danger" onClick={() => revoke(Array.from(selected))}>
                    Revoke Selected ({selected.size})
                </button>
            )}
        </div>
        
        {loading ? <p>Loading...</p> : (
            <table className="table">
            <thead>
                <tr>
                    <th><input type="checkbox" onChange={(e) => {
                        if (e.target.checked) setSelected(new Set(testers.map(t => t.user_id)));
                        else setSelected(new Set());
                    }} checked={selected.size === testers.length && testers.length > 0} /></th>
                    <th>Email</th>
                    <th>Code</th>
                    <th>Activated</th>
                    <th>Admin Access</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {testers.map(t => (
                <tr key={t.user_id}>
                    <td><input type="checkbox" checked={selected.has(t.user_id)} onChange={() => toggleSelect(t.user_id)} /></td>
                    <td>{t.email}</td>
                    <td>{t.code}</td>
                    <td>{new Date(t.activatedAt).toLocaleDateString()}</td>
                    <td>
                        <label className="switch">
                            <input type="checkbox" checked={t.isAdmin} onChange={() => toggleAdmin(t.user_id, t.isAdmin)} />
                            <span className="slider"></span>
                        </label>
                    </td>
                    <td>
                        <button className="btn small danger" onClick={() => revoke([t.user_id])}>Revoke</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
      <style jsx>{`
        .tag { background: #33DEA5; color: #1a0a1f; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
        .danger { background-color: #E11637; border-color: #E11637; color: white; }
        .switch { position: relative; display: inline-block; width: 34px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #33DEA5; }
        input:checked + .slider:before { transform: translateX(14px); }
      `}</style>
    </Protected>
  );
}
