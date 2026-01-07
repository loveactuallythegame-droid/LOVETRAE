import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';
import { logAudit } from '@/lib/audit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const actor = (req.headers['x-user-id'] as string) || 'system';
  if (req.method === 'GET') {
    const id = req.query.id as string;
    const { data, error } = await serviceSupabase.from('game_versions').select('*').eq('game_id', id).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, data });
  }
  if (req.method === 'POST') {
    const { action, id, version_id, payload } = req.body as { action: string; id: string; version_id?: string; payload?: any };
    if (action === 'snapshot') {
      const { error } = await serviceSupabase.from('game_versions').insert({ game_id: id, payload });
      if (error) return res.status(500).json({ error: error.message });
      await logAudit('game_snapshot', { id }, actor);
      return res.json({ ok: true });
    }
    if (action === 'rollback') {
      const { data: ver, error: e1 } = await serviceSupabase.from('game_versions').select('*').eq('id', version_id).single();
      if (e1) return res.status(500).json({ error: e1.message });
      const { error: e2 } = await serviceSupabase.from('games').update(ver?.payload || {}).eq('id', id);
      if (e2) return res.status(500).json({ error: e2.message });
      await logAudit('game_rollback', { id, version_id }, actor);
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: 'Unsupported action' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
