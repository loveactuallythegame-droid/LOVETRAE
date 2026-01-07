import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from './env';

const SUPABASE_URL = (ENV.SUPABASE_URL) as string;
const SUPABASE_ANON_KEY = (ENV.SUPABASE_ANON_KEY) as string;

const useMock = !SUPABASE_URL || !SUPABASE_ANON_KEY;

export const supabase: any = useMock
  ? {
      from: (_table: string) => {
        const q: any = {
          select: (_q?: string) => q,
          insert: (_row: any) => ({ select: (_s?: string) => ({ data: _row, error: null }), single: () => ({ data: _row, error: null }) }),
          update: (_patch: any) => ({
            eq: (_col: string, _val: any) => ({ select: (_s?: string) => ({ data: { ..._patch }, error: null }), single: () => ({ data: { ..._patch }, error: null }) }),
            is: (_col: string, _val: any) => ({ select: (_s?: string) => ({ data: { ..._patch }, error: null }) }),
          }),
          eq: (_col: string, _val: any) => q,
          not: (_col: string, _op: string, _val: any) => q,
          limit: (_n: number) => ({ data: [], error: null }),
          single: () => ({ data: null, error: null }),
          upsert: (_p: any, _opts?: any) => ({ data: _p, error: null }),
        };
        return q;
      },
      channel: (_name: string) => {
        const ch: any = {
          on: (_event: string, _spec: any, _cb: Function) => ch,
          subscribe: () => ch,
        };
        return ch;
      },
      removeChannel: (_ch: any) => {},
      auth: {
        getSession: async () => ({ data: { session: { user: { id: 'preview', email: 'preview@local' } } } }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async (_opts: any) => ({ data: { user: { id: 'preview' } }, error: null }),
        signUp: async (_opts: any) => ({ data: { user: { id: 'preview' } }, error: null }),
        signInWithOAuth: async (_opts: any) => ({ data: { provider: 'google' }, error: null }),
      },
    }
  : createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

export type Profile = {
  user_id: string;
  partner_id: string | null;
  origin_story: string | null;
  first_red_flag: string | null;
  relationship_score: number | null;
  sarcasm_level: number | null;
  couple_code: string | null;
  beta_code: string | null;
  is_beta: boolean | null;
};

export type Fight = {
  id: string;
  couple_id: string;
  timestamp: string;
  partner_a_input: string | null;
  partner_b_input: string | null;
  ai_analysis: string | null;
  repair_attempts: string | null;
  completion_status: string | null;
};

export async function createFight(couple_id: string) {
  const timestamp = new Date().toISOString();
  const { data, error } = await supabase.from('fights').insert({ couple_id, timestamp }).select('*').single();
  if (error) throw error;
  return data as Fight;
}

export async function updateFight(id: string, patch: Partial<Fight>) {
  const { data, error } = await supabase.from('fights').update(patch).eq('id', id).select('*').single();
  if (error) throw error;
  return data as Fight;
}

export function subscribeFight(id: string, cb: (payload: any) => void) {
  return supabase
    .channel(`fight_${id}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'fights', filter: `id=eq.${id}` }, cb)
    .subscribe();
}

export interface Game {
  id: string;
  name: string;
  category: 'emotional' | 'conflict' | 'creative' | 'romance';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp: number;
  description: string;
  mechanics: string;
  marcieIntro: string;
}

export type GameSession = {
  id: string;
  game_id: string;
  user_id: string;
  couple_id: string;
  started_at: string;
  finished_at: string | null;
  score: number | null;
  state: string | null;
};

export async function listGames(): Promise<Game[]> {
  const { data, error } = await supabase.from('games').select('*');
  if (error) throw error;
  return (data || []).map((g: any) => ({
    id: g.id,
    name: g.name,
    category: (g.category as string) as Game['category'],
    difficulty: (typeof g.difficulty === 'string'
      ? g.difficulty
      : g.difficulty >= 3
      ? 'Hard'
      : g.difficulty === 2
      ? 'Medium'
      : 'Easy') as Game['difficulty'],
    xp: g.xp_reward ?? g.xp ?? 100,
    description: g.description ?? '',
    mechanics: g.mechanics ?? '',
    marcieIntro: g.marcies_script ?? g.marcieIntro ?? '',
  }));
}

export async function createGameSession(game_id: string, user_id: string, couple_id: string) {
  const started_at = new Date().toISOString();
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({ game_id, user_id, couple_id, started_at })
    .select('*')
    .single();
  if (error) throw error;
  return data as GameSession;
}

export async function updateGameSession(id: string, patch: Partial<GameSession>) {
  const { data, error } = await supabase.from('game_sessions').update(patch).eq('id', id).select('*').single();
  if (error) throw error;
  return data as GameSession;
}

export function subscribeGameSession(id: string, cb: (payload: any) => void) {
  return supabase
    .channel(`game_session_${id}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `id=eq.${id}` }, cb)
    .subscribe();
}

export async function upsertProfile(profile: Partial<Profile>) {
  const res = await supabase.from('profiles').upsert(profile, { onConflict: 'user_id' });
  try {
    if ((profile as any).user_id) await AsyncStorage.setItem(`profile_${(profile as any).user_id}`, JSON.stringify(profile));
  } catch {}
  return res;
}

export async function getProfile(user_id: string) {
  try {
    const res = await supabase.from('profiles').select('*').eq('user_id', user_id).single();
    if (!res.error && res.data) {
      await AsyncStorage.setItem(`profile_${user_id}`, JSON.stringify(res.data));
    }
    return res;
  } catch (e) {
    const cached = await AsyncStorage.getItem(`profile_${user_id}`);
    if (cached) return { data: JSON.parse(cached), error: null } as any;
    throw e;
  }
}

export async function subscribeCouple(code: string, cb: (data: any) => void) {
  return supabase
    .channel('profiles_realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `couple_code=eq.${code}` }, (payload: any) => cb(payload))
    .subscribe();
}

export async function linkPartners(user_id: string, partner_id: string, couple_code: string) {
  await supabase.from('profiles').update({ partner_id, couple_code }).eq('user_id', user_id);
  await supabase.from('profiles').update({ partner_id: user_id, couple_code }).eq('user_id', partner_id);
}

export async function linkPartnersTransactional(user_id: string, partner_id: string, couple_code: string) {
  const me = await supabase.from('profiles').select('partner_id').eq('user_id', user_id).single();
  const them = await supabase.from('profiles').select('partner_id').eq('user_id', partner_id).single();
  if (me.data?.partner_id || them.data?.partner_id) throw new Error('already_linked');
  const u1 = await supabase.from('profiles').update({ partner_id, couple_code }).eq('user_id', user_id).is('partner_id', null).select('user_id');
  const u2 = await supabase.from('profiles').update({ partner_id: user_id, couple_code }).eq('user_id', partner_id).is('partner_id', null).select('user_id');
  const ok = !u1.error && !u2.error && (u1.data?.length || 0) > 0 && (u2.data?.length || 0) > 0;
  if (!ok) throw new Error('link_failed');
  return true;
}

export async function signInEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signInWithGoogle(redirectTo?: string) {
  return supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
}

export async function resetPassword(email: string, redirectTo?: string) {
  return supabase.auth.resetPasswordForEmail(email, { redirectTo });
}
