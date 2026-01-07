import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';
import { logAudit } from '@/lib/audit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, segment, message } = req.body as { type: string; segment: string; message: string };
  const variant = (req.body as any).variant as string | undefined;
  if (type === 'scheduled') {
    await serviceSupabase.from('scheduled_notifications').insert({ segment, message, scheduled_for: new Date(Date.now() + 3600 * 1000).toISOString() });
    res.json({ ok: true, scheduled: true });
    return;
  }
  const users = await serviceSupabase.from('profiles').select('user_id, push_token, plan').or(segment === 'all' ? '' : `plan.eq.${segment}`);
  const tokens = (users.data || []).map((u: any) => u.push_token).filter(Boolean);
  await Promise.all(tokens.map((t: string) => fetch('https://exp.host/--/api/v2/push/send', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.EXPO_ACCESS_TOKEN}` }, body: JSON.stringify({ to: t, title: 'Announcement', body: message }) })));
  await logAudit('push_send', { type, segment }, 'system');
  await serviceSupabase.from('notification_stats').insert({ segment, variant, sent: tokens.length, opened: 0, converted: 0 });
  res.json({ ok: true, count: tokens.length });
}
