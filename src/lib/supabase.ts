import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://owpyvcobpfwwigqmlbwv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93cHl2Y29icGZ3d2lncW1sYnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDM4MTgsImV4cCI6MjA2OTQ3OTgxOH0.UnZXMeIv7dFUztLlIFOC7R5wVJ9uV8RTXPnxLYX_zso';

// More detailed error handling for production
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is not defined. Please check your environment variables.');
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY is not defined. Please check your environment variables.');
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      vsl_analytics: {
        Row: {
          id: string;
          session_id: string;
          event_type: 'page_enter' | 'video_play' | 'video_progress' | 'pitch_reached' | 'offer_click' | 'page_exit';
          event_data: any;
          timestamp: string;
          created_at: string;
          ip: string | null;
          country_code: string | null;
          country_name: string | null;
          city: string | null;
          region: string | null;
          last_ping: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          event_type: 'page_enter' | 'video_play' | 'video_progress' | 'pitch_reached' | 'offer_click' | 'page_exit';
          event_data?: any;
          timestamp?: string;
          created_at?: string;
          ip?: string | null;
          country_code?: string | null;
          country_name?: string | null;
          city?: string | null;
          region?: string | null;
          last_ping?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          event_type?: 'page_enter' | 'video_play' | 'video_progress' | 'pitch_reached' | 'offer_click' | 'page_exit';
          event_data?: any;
          timestamp?: string;
          created_at?: string;
          ip?: string | null;
          country_code?: string | null;
          country_name?: string | null;
          city?: string | null;
          region?: string | null;
          last_ping?: string | null;
        };
      };
    };
  };
};