import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';
import { logAudit } from '@/lib/audit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const actor = (req.headers['x-user-id'] as string) || 'system';
  const { user_id, email, route, priority, message, context } = req.body as { user_id?: string; email?: string; route?: string; priority?: string; message: string; context?: any };
  if (!message || typeof message !== 'string') return res.status(400).json({ error: 'message required' });
  const payload = { user_id, email, route, priority: priority || 'medium', message, context: JSON.stringify(context || {}), created_at: new Date().toISOString() };
  const { error } = await serviceSupabase.from('beta_feedback').insert(payload);
  if (error) return res.status(500).json({ error: error.message });
  await logAudit('feedback_submit', { route, priority }, actor);
  res.json({ ok: true });
}

