import { useEffect, useState } from 'react';
import Protected from '@/components/Protected';
import { supabase } from '@/lib/supabaseClient';

export default function PromptsPage() {
  const [sarcasm, setSarcasm] = useState(1);
  const [prompt, setPrompt] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [variant, setVariant] = useState('A');
  const [versions, setVersions] = useState<any[]>([]);
  function load() { supabase.from('prompts').select('*').then((r: { data: any[] }) => setList(r.data || [])); }
  useEffect(() => { load(); }, []);
  async function save() {
    const { data } = await supabase.auth.getSession();
    await fetch('/api/prompts/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': data.session?.user?.id || '' },
      body: JSON.stringify({ level: sarcasm, text: prompt, variant })
    });
    load();
  }
  return (
    <Protected>
      <div className="card"><h2>Prompt Engineering</h2></div>
      <div className="card">
        <div className="row">
          <input className="input" type="number" min={1} max={5} value={sarcasm} onChange={(e) => setSarcasm(parseInt(e.target.value))} />
        </div>
        <div className="row" style={{ gap: 12 }}>
          <select className="input" value={variant} onChange={(e) => setVariant(e.target.value)}>
            <option value="A">Variant A</option>
            <option value="B">Variant B</option>
          </select>
        </div>
        <textarea className="input" rows={8} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button className="btn" onClick={save}>Save</button>
      </div>
      <div className="card">
        <ul>
          {list.map((p) => (<li key={p.level}>{p.level}: {p.text.slice(0, 60)}...</li>))}
        </ul>
        <div className="row" style={{ gap: 12 }}>
          <button className="btn" onClick={async () => {
            const res = await fetch(`/api/prompts/versions?level=${sarcasm}`);
            if (res.ok) { const json = await res.json(); setVersions(json.data || []); }
          }}>Load Versions</button>
        </div>
        {versions.length > 0 && (
          <table className="table" style={{ marginTop: 12 }}>
            <thead><tr><th>ID</th><th>Variant</th><th>Created</th><th></th></tr></thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.variant || '-'}</td>
                  <td>{v.created_at}</td>
                  <td>
                    <button className="btn" onClick={async () => {
                      const { data } = await supabase.auth.getSession();
                      await fetch('/api/prompts/versions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-user-id': data.session?.user?.id || '' },
                        body: JSON.stringify({ action: 'rollback', version_id: v.id })
                      });
                      load();
                    }}>Rollback</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Protected>
  );
}
