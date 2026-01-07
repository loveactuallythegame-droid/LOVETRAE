import { supabase } from './supabaseClient';

export async function getSubscriptionStatus() {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return { status: 'free' };
  const sub = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
  const s = sub.data || { status: 'free' };
  const now = Date.now();
  const grace = s.grace_until ? new Date(s.grace_until).getTime() : 0;
  const effective = s.status === 'active' || (s.status === 'past_due' && grace > now);
  return { ...s, effective };
}

export function canUsePremium(effective: boolean) { return effective; }
