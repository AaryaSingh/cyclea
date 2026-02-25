/**
 * Supabase database types - generated to match schema.
 * Run `npx supabase gen types typescript` after pushing migrations for auto-generation.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type League = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          categories: string[];
          streak: number;
          xp: number;
          badges: string[];
          current_league: League | null;
          league_xp: number;
          has_left_league: boolean;
          age_range: string | null;
          cycle_status: string | null;
          birth_control: string | null;
          diagnosed_conditions: string[] | null;
          medications: string | null;
          gi_priorities: string[] | null;
          mental_health_focus: string[] | null;
          goals: string[] | null;
          education_preference: 'quick' | 'deep' | null;
          accessibility_prefs: Json | null;
          consent_analytics: boolean | null;
          consent_research: boolean | null;
          completed_lessons: string[] | null;
          unlocked_lessons: string[] | null;
          is_pregnant: boolean | null;
          pregnancy_mode: boolean | null;
          adaptive_mode: boolean | null;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      check_ins: {
        Row: {
          id: string;
          profile_id: string;
          created_at: string;
          data: Json;
        };
        Insert: {
          id?: string;
          profile_id: string;
          created_at?: string;
          data: Json;
        };
        Update: Partial<Database['public']['Tables']['check_ins']['Insert']>;
      };
      food_entries: {
        Row: {
          id: string;
          profile_id: string;
          created_at: string;
          name: string;
          time: string;
          category: string;
          cuisine: string | null;
          amount: string | null;
        };
        Insert: {
          id?: string;
          profile_id: string;
          created_at?: string;
          name: string;
          time: string;
          category: string;
          cuisine?: string | null;
          amount?: string | null;
        };
        Update: Partial<Database['public']['Tables']['food_entries']['Insert']>;
      };
      period_data: {
        Row: {
          id: string;
          profile_id: string;
          created_at: string;
          updated_at: string;
          last_period_start: string;
          average_cycle_length: number;
          period_length: number;
          is_irregular: boolean | null;
          cycle_variability: string | null;
          period_days: string[] | null;
        };
        Insert: {
          id?: string;
          profile_id: string;
          created_at?: string;
          updated_at?: string;
          last_period_start: string;
          average_cycle_length: number;
          period_length: number;
          is_irregular?: boolean | null;
          cycle_variability?: string | null;
          period_days?: string[] | null;
        };
        Update: Partial<Database['public']['Tables']['period_data']['Insert']>;
      };
      community_topics: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          members_count: number;
          posts_count: number;
          description: string;
          color: string;
          icon: string;
          online_count: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          members_count?: number;
          posts_count?: number;
          description: string;
          color: string;
          icon: string;
          online_count?: number | null;
        };
        Update: Partial<Database['public']['Tables']['community_topics']['Insert']>;
      };
      community_posts: {
        Row: {
          id: string;
          topic_id: string;
          author_id: string;
          author_name: string;
          author_badge: string | null;
          created_at: string;
          title: string;
          content: string;
          upvotes: number;
          views: number;
          is_pinned: boolean;
          flair: string | null;
        };
        Insert: {
          id?: string;
          topic_id: string;
          author_id: string;
          author_name: string;
          author_badge?: string | null;
          created_at?: string;
          title: string;
          content: string;
          upvotes?: number;
          views?: number;
          is_pinned?: boolean;
          flair?: string | null;
        };
        Update: Partial<Database['public']['Tables']['community_posts']['Insert']>;
      };
      community_comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          author_name: string;
          author_badge: string | null;
          parent_id: string | null;
          created_at: string;
          content: string;
          upvotes: number;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          author_name: string;
          author_badge?: string | null;
          parent_id?: string | null;
          created_at?: string;
          content: string;
          upvotes?: number;
        };
        Update: Partial<Database['public']['Tables']['community_comments']['Insert']>;
      };
      post_upvotes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['post_upvotes']['Insert']>;
      };
      comment_upvotes: {
        Row: {
          id: string;
          comment_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          comment_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['comment_upvotes']['Insert']>;
      };
    };
  };
}
