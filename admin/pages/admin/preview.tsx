import { useEffect, useState } from 'react';
import Protected from '@/components/Protected';
import { supabase } from '@/lib/supabaseClient';

export default function PreviewPage() {
  const [role, setRole] = useState<'free' | 'premium' | 'beta' | 'blocked' | 'none'>('none');

  useEffect(() => {
    // In a real implementation, this would sync to the app via a shared context, websocket, or deep link.
    // For this simulation, we'll assume the admin panel is running alongside the app or controls it via a dev channel.
    // Since we are building the UI part A:
    const stored = localStorage.getItem('preview_role');
    if (stored) setRole(stored as any);
  }, []);

  function changeRole(r: string) {
    setRole(r as any);
    localStorage.setItem('preview_role', r);
    // Broadcast to app via channel if connected
    supabase.channel('admin_preview').send({ type: 'broadcast', event: 'role_change', payload: { role: r === 'none' ? null : r } });
  }

  return (
    <Protected>
      <div className="card">
        <h2>Admin Preview Mode</h2>
        <p>Simulate user roles to test permissions and UI states.</p>
        
        <div className="row" style={{ gap: 12, marginTop: 24 }}>
          {['free', 'premium', 'beta', 'blocked', 'none'].map((r) => (
            <button 
              key={r} 
              className={`btn ${role === r ? 'active' : ''}`} 
              onClick={() => changeRole(r)}
              style={role === r ? { backgroundColor: '#33DEA5', color: '#1a0a1f' } : {}}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <div className="preview-status" style={{ marginTop: 24, padding: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
          <h3>Current Simulation: {role === 'none' ? 'Disabled (Real User)' : role.toUpperCase()}</h3>
          {role === 'blocked' && <p style={{ color: '#E11637' }}>App should show blocked screen / limited access.</p>}
          {role === 'beta' && <p style={{ color: '#E4E831' }}>App should show beta badge and unlocked features.</p>}
        </div>
      </div>
    </Protected>
  );
}
