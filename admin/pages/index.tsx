import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  useEffect(() => { supabase.auth.getSession().then((res: { data: { session: any } }) => setUser(res.data.session?.user || null)); }, []);
  return (
    <div className="container">
      <div className="card">
        <h1>Love Admin</h1>
        {user ? (
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span>Welcome {user.email}</span>
            <Link href="/admin">Enter Admin</Link>
          </div>
        ) : (
          <div className="row" style={{ gap: 12 }}>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ background:'#0d0610', color:'#fff', border:'1px solid rgba(250,31,99,0.2)', borderRadius:10, padding:'8px 12px' }} />
            <button className="btn" onClick={async () => { await supabase.auth.signInWithOtp({ email }); const s = await supabase.auth.getSession(); setUser(s.data.session?.user || null); }}>Email Magic Link</button>
            <button className="btn" onClick={async () => { await supabase.auth.signInWithOAuth({ provider: 'google' }); const s = await supabase.auth.getSession(); setUser(s.data.session?.user || null); }}>Sign in with Google</button>
          </div>
        )}
      </div>
    </div>
  );
}
