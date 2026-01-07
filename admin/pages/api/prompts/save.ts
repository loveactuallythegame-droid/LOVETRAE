import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';
import { logAudit } from '@/lib/audit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { level, text, variant } = req.body as { level: number; text: string; variant?: string };
  const actor = (req.headers['x-user-id'] as string) || 'system';

  const { data: saved, error } = await serviceSupabase.from('prompts').upsert({ level, text, variant }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  await serviceSupabase.from('prompts_versions').insert({ prompt_id: saved?.id, level, text, variant });

  await logAudit('prompt_save', { level }, actor);
  res.json({ ok: true });
}
