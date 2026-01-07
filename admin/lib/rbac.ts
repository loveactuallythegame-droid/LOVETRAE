import { supabase, isMock } from './supabaseClient';

export async function getUserRole() {
  if (isMock) return 'super';
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;
  const role = (await supabase.from('profiles').select('role').eq('user_id', user.id).single()).data?.role || 'standard';
  return role as 'super' | 'standard';
}

export function canAccessAdmin(role: string) {
  return role === 'super' || role === 'standard';
}

export function isSuper(role: string) {
  return role === 'super';
}
