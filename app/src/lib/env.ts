// Centralized environment variable access
// Compatible with both Vite (import.meta.env) and Metro (process.env)
const getEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

export const ENV = {
  // Third-party APIs
  OPENAI_API_KEY: getEnv('EXPO_PUBLIC_OPENAI_API_KEY'),
  ANTHROPIC_API_KEY: getEnv('EXPO_PUBLIC_ANTHROPIC_API_KEY'),
  SENTRY_DSN: getEnv('EXPO_PUBLIC_SENTRY_DSN'),
  ELEVENLABS_API_KEY: getEnv('EXPO_PUBLIC_ELEVENLABS_API_KEY'),
  ELEVENLABS_VOICE_ID_MARCIE: getEnv('EXPO_PUBLIC_ELEVENLABS_VOICE_ID_MARCIE'),
  GIPHY_API_KEY: getEnv('EXPO_PUBLIC_GIPHY_API_KEY'),
  MAPBOX_API_KEY: getEnv('EXPO_PUBLIC_MAPBOX_API_KEY'),

  // Firebase Configuration
  FIREBASE_API_KEY: getEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  FIREBASE_AUTH_DOMAIN: getEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  FIREBASE_PROJECT_ID: getEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  FIREBASE_STORAGE_BUCKET: getEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  FIREBASE_MESSAGING_SENDER_ID: getEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  FIREBASE_APP_ID: getEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),

  // Supabase (if still used)
  SUPABASE_URL: getEnv('EXPO_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),

  // Internal App Config
  ENCRYPTION_PEPPER: getEnv('EXPO_PUBLIC_ENCRYPTION_PEPPER'),
  ADMIN_BASE_URL: getEnv('EXPO_PUBLIC_ADMIN_BASE_URL'),
};
