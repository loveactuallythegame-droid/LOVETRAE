import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user_id = req.query.user_id as string;
  if (!user_id) return res.status(400).json({ error: 'user_id required' });
  const { data } = await serviceSupabase.from('subscriptions').select('*').eq('user_id', user_id).single();
  const now = Date.now();
  const grace = data?.grace_until ? new Date(data.grace_until).getTime() : 0;
  const effective = data?.status === 'active' || (data?.status === 'past_due' && grace > now);
  res.json({ status: data?.status || 'free', effective, grace_until: data?.grace_until || null });
}
