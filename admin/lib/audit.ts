import { serviceSupabase } from './supabaseClient';

export async function logAudit(action: string, payload: any, actor_id: string) {
  await serviceSupabase.from('audit_logs').insert({ action, payload: JSON.stringify(payload), actor_id, created_at: new Date().toISOString() });
}
