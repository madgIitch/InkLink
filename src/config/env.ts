/**
 * Environment configuration
 * Access environment variables defined in .env file
 */

export const env = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  environment: process.env.EXPO_PUBLIC_ENV || 'development',
  isDevelopment: process.env.EXPO_PUBLIC_ENV === 'development',
  isProduction: process.env.EXPO_PUBLIC_ENV === 'production',
};
