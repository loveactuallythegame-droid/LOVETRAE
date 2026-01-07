import { NextApiRequest, NextApiResponse } from 'next';
import { serviceSupabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { user_id, grant } = req.body;
  
  const role = grant ? 'admin' : 'standard';

  const { error } = await serviceSupabase
    .from('profiles')
    .update({ role })
    .eq('user_id', user_id);

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true, role });
}
