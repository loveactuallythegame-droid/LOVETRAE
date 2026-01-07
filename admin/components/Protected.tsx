import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getUserRole, canAccessAdmin } from '@/lib/rbac';

export default function Protected({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => { getUserRole().then((r) => setRole(r)); }, []);
  if (role === null) return <div className="container"><div className="card">Loading...</div></div>;
  if (!role || !canAccessAdmin(role)) return <div className="container"><div className="card">Unauthorized</div></div>;
  return <Layout>{children}</Layout>;
}
