import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Verify admin permissions (simplified for now, usually checks session role)
  // const { data: session } = await serviceSupabase.auth.getSession();
  // if (!session.session) return res.status(401).json({ error: 'Unauthorized' });

  // Get all profiles with beta_active = true
  const { data: profiles, error } = await serviceSupabase
    .from('profiles')
    .select('user_id, beta_code, created_at, role') // assuming created_at as proxy for activatedAt or add beta_activated_at col
    .eq('beta_active', true);

  if (error) return res.status(500).json({ error: error.message });

  // Get emails for these users
  const { data: { users } } = await serviceSupabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const userMap = new Map(users.map(u => [u.id, u.email]));

  const testers = profiles.map(p => ({
    user_id: p.user_id,
    email: userMap.get(p.user_id) || 'Unknown',
    code: p.beta_code,
    activatedAt: p.created_at, // or specific field if added
    isAdmin: p.role === 'super' || p.role === 'admin'
  }));

  return res.json({ testers });
}
