import { useEffect, useState } from 'react';
import Protected from '@/components/Protected';
import { supabase } from '@/lib/supabaseClient';

export default function UsersPage() {
  const [couples, setCouples] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [activity, setActivity] = useState('');
  const [plan, setPlan] = useState('');
  const [churn, setChurn] = useState('');
  async function load() {
    let q = supabase.from('profiles').select('*').ilike('couple_code', `%${filter}%`);
    if (activity) q = q.eq('active_today', activity === 'active');
    if (plan) q = q.eq('plan', plan);
    if (churn) q = q.eq('churned', churn === 'yes');
    const { data } = await q;
    setCouples(data || []);
  }
  useEffect(() => { load(); }, [filter]);
  useEffect(() => { load(); }, [activity, plan, churn]);
  async function ban(user_id: string) {
    const { data } = await supabase.auth.getSession();
    await fetch('/api/users/ban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': data.session?.user?.id || '' },
      body: JSON.stringify({ user_id })
    });
    load();
  }
  async function resetGames(user_id: string) {
    const { data } = await supabase.auth.getSession();
    await fetch('/api/users/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': data.session?.user?.id || '' },
      body: JSON.stringify({ user_id })
    });
    load();
  }
  return (
    <Protected>
      <div className="card"><h2>User Management</h2></div>
      <div className="card">
        <input className="input" placeholder="Filter by couple code" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <div className="row" style={{ gap: 12, marginTop: 8 }}>
          <select className="input" value={activity} onChange={(e) => setActivity(e.target.value)}>
            <option value="">Activity</option>
            <option value="active">Active Today</option>
            <option value="inactive">Inactive</option>
          </select>
          <select className="input" value={plan} onChange={(e) => setPlan(e.target.value)}>
            <option value="">Plan</option>
            <option value="trial">Trial</option>
            <option value="premium">Premium</option>
          </select>
          <select className="input" value={churn} onChange={(e) => setChurn(e.target.value)}>
            <option value="">Churn</option>
            <option value="yes">Churned</option>
            <option value="no">Not Churned</option>
          </select>
          <a className="btn" href="/api/users/export">Export CSV</a>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>User</th><th>Partner</th><th>Code</th><th>Plan</th><th>Active</th><th>Churn</th><th>Health</th><th></th></tr></thead>
          <tbody>
            {couples.map((c) => (
              <tr key={c.user_id}>
                <td>{c.user_id}</td>
                <td>{c.partner_id || '-'}</td>
                <td>{c.couple_code || '-'}</td>
                <td>{c.plan || '-'}</td>
                <td>{c.active_today ? 'Yes' : 'No'}</td>
                <td>{c.churned ? 'Yes' : 'No'}</td>
                <td>{c.relationship_health || '-'}</td>
                <td>
                  <button className="btn" onClick={() => ban(c.user_id)}>Ban</button>
                  <button className="btn" onClick={() => resetGames(c.user_id)}>Reset Games</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Protected>
  );
}
