import { useState } from 'react';
import Protected from '@/components/Protected';

export default function NotificationsPage() {
  const [segment, setSegment] = useState('all');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('A');
  const [stats, setStats] = useState<any[]>([]);
  async function send(type: 'global' | 'targeted' | 'scheduled') {
    await fetch('/api/notifications/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, segment, message, variant }) });
  }
  return (
    <Protected>
      <div className="card"><h2>Push Notifications</h2></div>
      <div className="card">
        <select className="input" value={segment} onChange={(e) => setSegment(e.target.value)}>
          <option value="all">All</option>
          <option value="trial">Trial</option>
          <option value="premium">Premium</option>
        </select>
        <div className="row" style={{ gap: 12 }}>
          <select className="input" value={variant} onChange={(e) => setVariant(e.target.value)}>
            <option value="A">Variant A</option>
            <option value="B">Variant B</option>
          </select>
          <button className="btn" onClick={async () => {
            const res = await fetch('/api/notifications/stats');
            if (res.ok) { const json = await res.json(); setStats(json.data || []); }
          }}>Load Stats</button>
        </div>
        <textarea className="input" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className="row">
          <button className="btn" onClick={() => send('global')}>Trigger Global</button>
          <button className="btn" onClick={() => send('targeted')}>Targeted</button>
          <button className="btn" onClick={() => send('scheduled')}>Schedule</button>
        </div>
      </div>
      {stats.length > 0 && (
        <div className="card">
          <h3>Performance</h3>
          <table className="table">
            <thead><tr><th>Variant</th><th>Segment</th><th>Sent</th><th>Opened</th><th>Conversion</th><th>Date</th></tr></thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.id}>
                  <td>{s.variant || '-'}</td>
                  <td>{s.segment || '-'}</td>
                  <td>{s.sent || 0}</td>
                  <td>{s.opened || 0}</td>
                  <td>{s.converted || 0}</td>
                  <td>{s.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Protected>
  );
}
