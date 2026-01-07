import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';
import { logAudit } from '@/lib/audit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { id, name, mechanics, category, xp_reward, marcies_script, sarcasm_level, difficulty } = req.body;
  const actor = req.headers['x-user-id'] as string || 'system';

  const payload = { 
    name, 
    mechanics, 
    category, 
    xp_reward: parseInt(xp_reward), 
    marcies_script, 
    sarcasm_level: parseInt(sarcasm_level),
    difficulty
  };

  let result;
  if (id) {
    result = await serviceSupabase.from('games').update(payload).eq('id', id).select().single();
  } else {
    result = await serviceSupabase.from('games').insert(payload).select().single();
  }

  if (result.error) return res.status(500).json({ error: result.error.message });

  await logAudit('game_save', { ...payload, id: result.data.id }, actor);
  res.json({ ok: true, data: result.data });
}
