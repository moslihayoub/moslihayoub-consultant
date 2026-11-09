import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('votre-projet')
);

// Initialisation sécurisée du client Supabase
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'm84_supabase_auth_token'
      }
    })
  : null;

/**
 * Helper de test de connectivité
 */
export async function testSupabaseConnection() {
  if (!supabase) return { connected: false, reason: 'Supabase non configuré (fallback actif)' };
  try {
    const { error } = await supabase.from('leads').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      return { connected: false, error: error.message };
    }
    return { connected: true };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}
