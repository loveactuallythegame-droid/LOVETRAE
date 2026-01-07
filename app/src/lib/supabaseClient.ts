import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

const url = ENV.SUPABASE_URL || '';
const anonKey = ENV.SUPABASE_ANON_KEY || '';
export const supabase = createClient(url, anonKey);
