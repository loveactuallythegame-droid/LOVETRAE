import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';
import { logAudit } from '@/lib/audit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.body;
  const actor = req.headers['x-user-id'] as string || 'system';

  const { error } = await serviceSupabase.from('games').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  await logAudit('game_delete', { id }, actor);
  res.json({ ok: true });
}
