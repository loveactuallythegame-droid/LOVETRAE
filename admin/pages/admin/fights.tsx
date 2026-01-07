import { useEffect, useState } from 'react';
import Protected from '@/components/Protected';
import { supabase } from '@/lib/supabaseClient';

export default function FightsPage() {
  const [code, setCode] = useState('');
  const [fights, setFights] = useState<any[]>([]);
  useEffect(() => { if (code) supabase.from('fights').select('*').eq('couple_id', code).then((r: { data: any[] }) => setFights(r.data || [])); }, [code]);
  return (
    <Protected>
      <div className="card"><h2>Fight History</h2></div>
      <div className="card">
        <input className="input" placeholder="Couple Code" value={code} onChange={(e) => setCode(e.target.value)} />
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Time</th><th>Partner A</th><th>Partner B</th><th>Status</th></tr></thead>
          <tbody>
            {fights.map((f) => (
              <tr key={f.id}><td>{f.timestamp}</td><td>{truncate(f.partner_a_input)}</td><td>{truncate(f.partner_b_input)}</td><td>{f.completion_status || '-'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </Protected>
  );
}

function truncate(s?: string) { return (s || '').slice(0, 80); }
