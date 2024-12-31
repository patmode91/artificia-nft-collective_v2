export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_models: {
        Row: {
          created_at: string | null
          id: number
          model_data: string | null
          model_name: string
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          model_data?: string | null
          model_name: string
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: never
          model_data?: string | null
          model_name?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_models_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      art_generation_settings: {
        Row: {
          color_scheme: string | null
          complexity: number | null
          created_at: string | null
          id: number
          style: string | null
          user_id: number | null
        }
        Insert: {
          color_scheme?: string | null
          complexity?: number | null
          created_at?: string | null
          id?: never
          style?: string | null
          user_id?: number | null
        }
        Update: {
          color_scheme?: string | null
          complexity?: number | null
          created_at?: string | null
          id?: never
          style?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "art_generation_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      art_generations: {
        Row: {
          complexity: number | null
          created_at: string
          id: string
          metadata: Json | null
          prompt: string
          result_url: string | null
          status: string | null
          style: string | null
          user_id: string | null
        }
        Insert: {
          complexity?: number | null
          created_at?: string
          id?: string
          metadata?: Json | null
          prompt: string
          result_url?: string | null
          status?: string | null
          style?: string | null
          user_id?: string | null
        }
        Update: {
          complexity?: number | null
          created_at?: string
          id?: string
          metadata?: Json | null
          prompt?: string
          result_url?: string | null
          status?: string | null
          style?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "art_generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborations: {
        Row: {
          collaborator_id: number | null
          created_at: string | null
          id: number
          nft_id: number | null
        }
        Insert: {
          collaborator_id?: number | null
          created_at?: string | null
          id?: never
          nft_id?: number | null
        }
        Update: {
          collaborator_id?: number | null
          created_at?: string | null
          id?: never
          nft_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collaborations_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          nft_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          nft_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          nft_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_engagement: {
        Row: {
          created_at: string | null
          id: number
          nft_id: number | null
          user_id: number | null
          vote: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          nft_id?: number | null
          user_id?: number | null
          vote?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: never
          nft_id?: number | null
          user_id?: number | null
          vote?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "community_engagement_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          nft_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          nft_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nft_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      market_analytics: {
        Row: {
          created_at: string | null
          id: number
          nft_id: number | null
          sale_date: string | null
          sale_price: number | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          nft_id?: number | null
          sale_date?: string | null
          sale_price?: number | null
        }
        Update: {
          created_at?: string | null
          id?: never
          nft_id?: number | null
          sale_date?: string | null
          sale_price?: number | null
        }
        Relationships: []
      }
      nft_interactions: {
        Row: {
          created_at: string | null
          id: number
          interaction_type: string
          mood_change: number | null
          timestamp: string | null
          token_id: number | null
          transaction_hash: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          interaction_type: string
          mood_change?: number | null
          timestamp?: string | null
          token_id?: number | null
          transaction_hash?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          interaction_type?: string
          mood_change?: number | null
          timestamp?: string | null
          token_id?: number | null
          transaction_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nft_interactions_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "nft_states"
            referencedColumns: ["token_id"]
          },
        ]
      }
      nft_states: {
        Row: {
          agility: number | null
          base_state: string
          created_at: string | null
          current_mood: number | null
          evolution_stage: number | null
          interactions: number | null
          last_evolution: string | null
          last_update: string | null
          metadata_uri: string | null
          owner_address: string
          strength: number | null
          token_id: number
          wisdom: number | null
        }
        Insert: {
          agility?: number | null
          base_state: string
          created_at?: string | null
          current_mood?: number | null
          evolution_stage?: number | null
          interactions?: number | null
          last_evolution?: string | null
          last_update?: string | null
          metadata_uri?: string | null
          owner_address: string
          strength?: number | null
          token_id: number
          wisdom?: number | null
        }
        Update: {
          agility?: number | null
          base_state?: string
          created_at?: string | null
          current_mood?: number | null
          evolution_stage?: number | null
          interactions?: number | null
          last_evolution?: string | null
          last_update?: string | null
          metadata_uri?: string | null
          owner_address?: string
          strength?: number | null
          token_id?: number
          wisdom?: number | null
        }
        Relationships: []
      }
      nfts: {
        Row: {
          contract_address: string | null
          created_at: string
          creator_id: string | null
          description: string | null
          id: string
          image_url: string
          is_minted: boolean | null
          metadata: Json | null
          price: number | null
          title: string
          token_id: string | null
        }
        Insert: {
          contract_address?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_minted?: boolean | null
          metadata?: Json | null
          price?: number | null
          title: string
          token_id?: string | null
        }
        Update: {
          contract_address?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_minted?: boolean | null
          metadata?: Json | null
          price?: number | null
          title?: string
          token_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nfts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: number
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: never
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: never
          username?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
