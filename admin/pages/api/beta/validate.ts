import { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from 'crypto';
import { serviceSupabase } from '@/lib/supabaseClient';
import { logAudit } from '@/lib/audit';

function hashEmail(email: string) {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex').slice(0, 8);
}

const VALID_CODES = new Set(['TABSIMONBETA', 'MARCIEBETA', 'LOVEBETA2025']);
const FOUNDERS = new Set(['tab@example.com', 'simon@example.com']);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, code } = req.body as { email: string; code: string };
  if (!email) return res.status(400).json({ error: 'email required' });

  const actor = (req.headers['x-user-id'] as string) || 'system';

  const isFounder = FOUNDERS.has(email.trim().toLowerCase()) || code === 'TABSIMONBETA';
  const isValidSimple = VALID_CODES.has((code || '').trim());
  const hiddenPrefix = 'BETATESTER';
  const expectedHidden = `${hiddenPrefix}${hashEmail(email)}`;
  const isHiddenValid = (code || '').trim() === expectedHidden;

  if (!(isFounder || isValidSimple || isHiddenValid)) {
    await logAudit('beta_validate_failed', { email, code }, actor);
    return res.status(403).json({ ok: false, error: 'invalid_code' });
  }

  const { data: userRecord } = await serviceSupabase.auth.admin.listUsers({ page: 1, perPage: 200 }).catch(() => ({ data: { users: [] } } as any));
  const user = (userRecord?.users || []).find((u: any) => (u.email || '').toLowerCase() === email.trim().toLowerCase());
  const user_id = user?.id || null;

  const role = isFounder ? 'super' : 'standard';

  if (user_id) {
    await serviceSupabase.from('profiles').upsert({ user_id, role, plan: 'beta', beta_active: true, beta_code: code }).eq('user_id', user_id);
  }

  const features = [
    'unlockedGames',
    'unlimitedSOS',
    'customMarciePersonality',
    'healingHospitalAccess',
    ...(code === 'LOVEBETA2025' || code === 'TABSIMONBETA' ? ['adminPanelAccess'] : [])
  ];

  await logAudit('beta_validate_success', { email, code, role }, actor);
  return res.json({ 
    ok: true, 
    success: true,
    role, 
    beta_active: true, 
    plan: 'beta', 
    user_id,
    features 
  });
}
