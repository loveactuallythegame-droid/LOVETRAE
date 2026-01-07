import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await serviceSupabase.from('profiles').select('user_id, partner_id, couple_code, plan, active_today, churned, relationship_health');
  if (error) return res.status(500).json({ error: error.message });
  const header = ['user_id','partner_id','couple_code','plan','active_today','churned','relationship_health'].join(',');
  const rows = (data || []).map((r: any) => [r.user_id, r.partner_id, r.couple_code, r.plan, r.active_today, r.churned, r.relationship_health].join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
  res.send(`${header}\n${rows}`);
}
