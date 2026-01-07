import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { env } from './env';

/**
 * Supabase client configuration
 */
export const supabase = createClient(env.supabase.url, env.supabase.anonKey, {
  auth: {
    storage: undefined, // Will be configured with AsyncStorage later
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
