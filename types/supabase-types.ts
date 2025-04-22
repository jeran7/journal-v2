export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          trading_experience: string | null
          preferred_markets: string[] | null
          preferred_timeframes: string[] | null
          risk_tolerance: number | null
          default_position_size: number | null
          theme_preference: string | null
          layout_settings: Json | null
          bio: string | null
          trading_style: string | null
          achievements: Json | null
          email_notifications: boolean
          completed_onboarding: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          trading_experience?: string | null
          preferred_markets?: string[] | null
          preferred_timeframes?: string[] | null
          risk_tolerance?: number | null
          default_position_size?: number | null
          theme_preference?: string | null
          layout_settings?: Json | null
          bio?: string | null
          trading_style?: string | null
          achievements?: Json | null
          email_notifications?: boolean
          completed_onboarding?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          trading_experience?: string | null
          preferred_markets?: string[] | null
          preferred_timeframes?: string[] | null
          risk_tolerance?: number | null
          default_position_size?: number | null
          theme_preference?: string | null
          layout_settings?: Json | null
          bio?: string | null
          trading_style?: string | null
          achievements?: Json | null
          email_notifications?: boolean
          completed_onboarding?: boolean
        }
      }
      oauth_accounts: {
        Row: {
          id: string
          user_id: string
          provider: string
          provider_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          provider_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          provider_id?: string
          created_at?: string
        }
      }
      security_logs: {
        Row: {
          id: string
          user_id: string
          event_type: string
          ip_address: string
          user_agent: string
          created_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          event_type: string
          ip_address: string
          user_agent: string
          created_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: string
          ip_address?: string
          user_agent?: string
          created_at?: string
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
