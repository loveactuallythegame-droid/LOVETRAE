import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { user_ids } = req.body;
  if (!Array.isArray(user_ids)) return res.status(400).json({ error: 'user_ids array required' });

  const { error } = await serviceSupabase
    .from('profiles')
    .update({ beta_active: false, plan: 'free', beta_code: null })
    .in('user_id', user_ids);

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
}
