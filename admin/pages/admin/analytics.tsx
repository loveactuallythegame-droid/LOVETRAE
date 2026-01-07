import { useEffect, useRef, useState } from 'react';
import Protected from '@/components/Protected';
import { supabase } from '@/lib/supabaseClient';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, BarController, BarElement } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, BarController, BarElement);

export default function AnalyticsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const churnRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const [range, setRange] = useState(7);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [customName, setCustomName] = useState('');
  const [customFn, setCustomFn] = useState('');
  useEffect(() => {
    const rpcName = period === 'day' ? 'fights_solved_day' : period === 'week' ? 'fights_solved_week' : 'fights_solved_month';
    Promise.all(new Array(range).fill(0).map((_, i) => supabase.rpc(rpcName, { offset: i }))).then((vals) => {
      const el = canvasRef.current;
      if (!el) return;
      const ctx = el.getContext('2d');
      if (!ctx) return;
      const labels = vals.map((_, i) => `${period[0].toUpperCase()}-${i}`);
      const fights = vals.map((v) => v?.data || 0);
      const chart = new Chart(ctx, { type: 'line', data: { labels, datasets: [{ label: 'Fights Solved', data: fights, borderColor: '#33DEA5' }] } });
      chartRef.current = chart;
      (canvasRef.current as any)._chart = chart;
      const mean = fights.reduce((a, b) => a + b, 0) / Math.max(1, fights.length);
      const last = fights[0] || 0;
      const anomaly = last > mean * 2;
      if (anomaly) alert('Anomaly detected: fights solved spiked');
    });
    const ch = supabase
      .channel('realtime_fights')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'fights' }, () => {
        const c = chartRef.current;
        if (c && c.data && c.data.datasets && c.data.datasets[0]) { c.data.datasets[0].data[0] = (c.data.datasets[0].data[0] || 0) + 1; c.update(); }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [range]);
  return (
    <Protected>
      <div className="card"><h2>Analytics</h2></div>
      <div className="card">
        <div className="row" style={{ gap: 12 }}>
          <label>Range</label>
          <input className="input" type="number" value={range} onChange={(e) => setRange(parseInt(e.target.value))} />
          <select className="input" value={period} onChange={(e) => setPeriod(e.target.value as any)}>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
        <canvas ref={canvasRef} width={800} height={300} />
        <a className="btn" href="/api/analytics/export">Export CSV</a>
      </div>
      <div className="card">
        <h3>Custom Metric</h3>
        <div className="row" style={{ gap: 12 }}>
          <input className="input" placeholder="Name" value={customName} onChange={(e) => setCustomName(e.target.value)} />
          <input className="input" placeholder="Supabase RPC name" value={customFn} onChange={(e) => setCustomFn(e.target.value)} />
          <button className="btn" onClick={async () => {
            const vals = await Promise.all(new Array(range).fill(0).map((_, i) => supabase.rpc(customFn, { offset: i })));
            const el = churnRef.current;
            if (!el) return;
            const ctx = el.getContext('2d');
            if (!ctx) return;
            new Chart(ctx, { type: 'bar', data: { labels: vals.map((_, i) => `${i}`), datasets: [{ label: customName || 'Custom', data: vals.map((v) => v?.data || 0), backgroundColor: '#FA1F63' }] } });
          }}>Render</button>
        </div>
        <canvas ref={churnRef} width={800} height={200} />
      </div>
    </Protected>
  );
}
