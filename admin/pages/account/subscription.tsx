import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabaseClient';

export default function SubscriptionPage() {
  const [status, setStatus] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getSession().then(async (res: { data: { session: any } }) => {
      const user = res.data.session?.user;
      if (!user) return;
      const sub = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
      setStatus(sub.data || { status: 'free' });
    });
  }, []);
  async function startTrial() {
    const { data } = await supabase.auth.getSession();
    await fetch('/api/stripe/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: data.session?.user?.id, mode: 'subscription', trial_days: 7 }) })
      .then((r) => r.json())
      .then((j) => window.location.assign(j.url));
  }
  async function manageBilling() {
    const { data } = await supabase.auth.getSession();
    const customer_id = status?.customer_id;
    if (!customer_id) return;
    await fetch('/api/stripe/create-portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer_id }) })
      .then((r) => r.json())
      .then((j) => window.location.assign(j.url));
  }
  return (
    <Layout>
      <div className="card"><h2>Subscription</h2></div>
      <div className="card">
        <div>Plan: {status?.status}</div>
        <div className="row" style={{ gap: 12 }}>
          <button className="btn" onClick={startTrial}>Start Trial</button>
          <button className="btn" onClick={manageBilling}>Manage</button>
        </div>
      </div>
    </Layout>
  );
}
