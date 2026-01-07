import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';
import { logAudit } from '@/lib/audit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { user_id } = req.body;
  const actor = req.headers['x-user-id'] as string || 'system';

  const { error } = await serviceSupabase.from('profiles').update({ status: 'banned' }).eq('user_id', user_id);
  if (error) return res.status(500).json({ error: error.message });

  await logAudit('ban_user', { user_id }, actor);
  res.json({ ok: true });
}
