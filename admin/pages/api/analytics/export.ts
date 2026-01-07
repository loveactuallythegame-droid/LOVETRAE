import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const fights = await serviceSupabase.from('fights').select('*');
  const rows = (fights.data || []).map((f: any) => `${f.id},${f.couple_id},${f.timestamp}`);
  res.setHeader('Content-Type', 'text/csv');
  res.send(['id,couple_id,timestamp', ...rows].join('\n'));
}
