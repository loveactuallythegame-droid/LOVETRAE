import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';
import { logAudit } from '@/lib/audit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const actor = (req.headers['x-user-id'] as string) || 'system';
  if (req.method === 'GET') {
    const level = parseInt(req.query.level as string);
    const { data, error } = await serviceSupabase.from('prompts_versions').select('*').eq('level', level).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, data });
  }
  if (req.method === 'POST') {
    const { action, version_id } = req.body as { action: string; version_id: string };
    if (action === 'rollback') {
      const { data: ver, error: e1 } = await serviceSupabase.from('prompts_versions').select('*').eq('id', version_id).single();
      if (e1) return res.status(500).json({ error: e1.message });
      const { error: e2 } = await serviceSupabase.from('prompts').update({ text: ver?.text, variant: ver?.variant }).eq('level', ver?.level);
      if (e2) return res.status(500).json({ error: e2.message });
      await logAudit('prompt_rollback', { level: ver?.level, version_id }, actor);
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: 'Unsupported action' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
