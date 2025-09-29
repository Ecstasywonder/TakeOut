import { createClient } from '@supabase/supabase-js';

// Add these lines to declare ImportMetaEnv and extend ImportMeta
declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL?: string;
    readonly VITE_SUPABASE_ANON_KEY?: string;
    // add other env variables here if needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const SUPABASE_CONFIGURED = Boolean(supabaseUrl && supabaseAnonKey);

if (!SUPABASE_CONFIGURED) {
  console.warn(
    'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set. Supabase client will be a no-op; add them to .env and restart the dev server.'
  );
}

const _supabase = SUPABASE_CONFIGURED
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : ({
      auth: {
        signInWithPassword: async () => {
          throw new Error('Supabase not configured: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing');
        },
        signUp: async () => {
          throw new Error('Supabase not configured: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing');
        },
      },
      from: () => ({
        select: async () => {
          throw new Error('Supabase not configured: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing');
        },
        insert: async () => {
          throw new Error('Supabase not configured: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing');
        },
        update: async () => {
          throw new Error('Supabase not configured: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing');
        },
        delete: async () => {
          throw new Error('Supabase not configured: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing');
        },
      }),
    } as unknown as ReturnType<typeof createClient>);

export const supabase = _supabase;
