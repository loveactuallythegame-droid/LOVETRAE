import { useEffect, useState } from 'react';
import Protected from '@/components/Protected';
import { supabase } from '@/lib/supabaseClient';
import { getUserRole } from '@/lib/rbac';

export default function AdminDashboard() {
  const [role, setRole] = useState<string>('');
  const [metrics, setMetrics] = useState<any>({ fightsSolved: 0, dailyActiveCouples: 0, churnRate: 0 });
  useEffect(() => {
    getUserRole().then((r) => setRole(r || ''));
    Promise.all([
      supabase.from('fights').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('user_id', { count: 'exact', head: true }).eq('active_today', true),
      supabase.from('profiles').select('user_id', { count: 'exact', head: true }).eq('churned', true),
    ]).then(([a, b, c]) => setMetrics({ fightsSolved: a.count || 0, dailyActiveCouples: b.count || 0, churnRate: ((c.count || 0) / Math.max(1, b.count || 1)) * 100 }));
  }, []);
  return (
    <Protected>
      <div className="card">
        <h2>Admin Dashboard</h2>
        <div className="row" style={{ gap: 24 }}>
          <div>Fights Solved: {metrics.fightsSolved}</div>
          <div>Daily Active Couples: {metrics.dailyActiveCouples}</div>
          <div>Churn Rate: {metrics.churnRate.toFixed(1)}%</div>
        </div>
      </div>
    </Protected>
  );
}
