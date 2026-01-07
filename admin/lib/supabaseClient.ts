import { createClient } from '@supabase/supabase-js';

let mockSession: any = { user: { id: 'preview-user', email: 'preview@local' } };

function createMock() {
  function makeQuery(table: string) {
    const state: any = { table, filters: {}, head: false };
    const q: any = {
      select: (_cols?: string, opts?: any) => { state.head = !!(opts && opts.head); return q; },
      eq: (col: string, val: any) => { state.filters[col] = val; return q; },
      single: async () => ({ data: null, error: null }),
      order: (_col: string, _opts?: any) => q,
      insert: async (_payload: any) => ({ data: null, error: null }),
      update: async (_payload: any) => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
      then: (onFulfilled: any) => Promise.resolve(state.head ? { count: 0 } : { data: [], error: null }).then(onFulfilled),
      catch: (onRejected: any) => Promise.resolve(state.head ? { count: 0 } : { data: [], error: null }).catch(onRejected)
    };
    return q;
  }
  return {
    auth: {
      getSession: async () => ({ data: { session: mockSession } }),
      signInWithOtp: async ({ email }: { email: string }) => { mockSession = { user: { id: 'preview-user', email } }; return { data: { user: mockSession.user }, error: null }; },
      signInWithOAuth: async ({ provider }: { provider: string }) => { mockSession = { user: { id: 'preview-user', email: `${provider}@preview.local` } }; return { data: { provider }, error: null }; },
      signOut: async () => { mockSession = null; return { error: null }; },
      admin: { listUsers: async (_opts?: any) => ({ data: { users: [] } }) }
    },
    from: (t: string) => makeQuery(t),
    rpc: async (_fn: string, _params?: any) => ({ data: Math.floor(Math.random() * 5), error: null }),
    channel: (_name: string) => {
      const ch: any = {
        on: (_event: string, _spec: any, _cb: Function) => ch,
        subscribe: () => ch
      };
      return ch;
    },
    removeChannel: (_ch: any) => {}
  } as any;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
export const isMock = !(url && anon);
export const supabase: any = !isMock ? createClient(url as string, anon as string) : createMock();

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
export const serviceSupabase: any = (url && serviceKey)
  ? createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : createMock();
