export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      elections: {
        Row: {
          announcement_date: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          phases: Json | null
          result_date: string | null
          source_url: string | null
          start_date: string | null
          state_code: string | null
          status: Database["public"]["Enums"]["election_status"]
          type: Database["public"]["Enums"]["election_type"]
          updated_at: string
        }
        Insert: {
          announcement_date?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          phases?: Json | null
          result_date?: string | null
          source_url?: string | null
          start_date?: string | null
          state_code?: string | null
          status?: Database["public"]["Enums"]["election_status"]
          type: Database["public"]["Enums"]["election_type"]
          updated_at?: string
        }
        Update: {
          announcement_date?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          phases?: Json | null
          result_date?: string | null
          source_url?: string | null
          start_date?: string | null
          state_code?: string | null
          status?: Database["public"]["Enums"]["election_status"]
          type?: Database["public"]["Enums"]["election_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "elections_state_code_fkey"
            columns: ["state_code"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["code"]
          },
        ]
      }
      kb_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          document_id: string
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string
          document_id: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          document_id?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "kb_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "kb_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_documents: {
        Row: {
          category: string | null
          created_at: string
          id: string
          language: Database["public"]["Enums"]["preferred_language"]
          source: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          language?: Database["public"]["Enums"]["preferred_language"]
          source?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          language?: Database["public"]["Enums"]["preferred_language"]
          source?: string | null
          title?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read_at: string | null
          related_election_id: string | null
          scheduled_at: string | null
          sent_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read_at?: string | null
          related_election_id?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read_at?: string | null
          related_election_id?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_election_id_fkey"
            columns: ["related_election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      polling_booths: {
        Row: {
          address: string | null
          booth_number: string | null
          constituency: string | null
          created_at: string
          district: string
          id: string
          landmark: string | null
          name: string
          pincode: string | null
          state_code: string
        }
        Insert: {
          address?: string | null
          booth_number?: string | null
          constituency?: string | null
          created_at?: string
          district: string
          id?: string
          landmark?: string | null
          name: string
          pincode?: string | null
          state_code: string
        }
        Update: {
          address?: string | null
          booth_number?: string | null
          constituency?: string | null
          created_at?: string
          district?: string
          id?: string
          landmark?: string | null
          name?: string
          pincode?: string | null
          state_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "polling_booths_state_code_fkey"
            columns: ["state_code"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["code"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          district: string | null
          email: string | null
          email_notifications: boolean
          full_name: string | null
          id: string
          journey_progress: Json
          language: Database["public"]["Enums"]["preferred_language"] | null
          pincode: string | null
          state: string | null
          updated_at: string
          voter_status: Database["public"]["Enums"]["voter_status"] | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          district?: string | null
          email?: string | null
          email_notifications?: boolean
          full_name?: string | null
          id: string
          journey_progress?: Json
          language?: Database["public"]["Enums"]["preferred_language"] | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          voter_status?: Database["public"]["Enums"]["voter_status"] | null
        }
        Update: {
          age?: number | null
          created_at?: string
          district?: string | null
          email?: string | null
          email_notifications?: boolean
          full_name?: string | null
          id?: string
          journey_progress?: Json
          language?: Database["public"]["Enums"]["preferred_language"] | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          voter_status?: Database["public"]["Enums"]["voter_status"] | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          created_at: string
          id: string
          questions: Json
          score: number
          state_code: string | null
          total: number
          user_id: string | null
        }
        Insert: {
          answers?: Json
          created_at?: string
          id?: string
          questions?: Json
          score?: number
          state_code?: string | null
          total?: number
          user_id?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          questions?: Json
          score?: number
          state_code?: string | null
          total?: number
          user_id?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          bucket: string
          count: number
          id: string
          window_start: string
        }
        Insert: {
          bucket: string
          count?: number
          id: string
          window_start?: string
        }
        Update: {
          bucket?: string
          count?: number
          id?: string
          window_start?: string
        }
        Relationships: []
      }
      states: {
        Row: {
          code: string
          name: string
          name_hi: string | null
          name_te: string | null
          type: string
        }
        Insert: {
          code: string
          name: string
          name_hi?: string | null
          name_te?: string | null
          type?: string
        }
        Update: {
          code?: string
          name?: string
          name_hi?: string | null
          name_te?: string | null
          type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      match_kb_chunks: {
        Args: {
          filter_language?: string
          match_count?: number
          query_embedding: string
        }
        Returns: {
          content: string
          document_title: string
          id: string
          similarity: number
          source: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      election_status: "upcoming" | "announced" | "ongoing" | "completed"
      election_type:
        | "general"
        | "state_assembly"
        | "by_election"
        | "local_body"
        | "presidential"
      preferred_language: "en" | "hi" | "te"
      voter_status: "not_registered" | "applied" | "registered" | "unsure"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      election_status: ["upcoming", "announced", "ongoing", "completed"],
      election_type: [
        "general",
        "state_assembly",
        "by_election",
        "local_body",
        "presidential",
      ],
      preferred_language: ["en", "hi", "te"],
      voter_status: ["not_registered", "applied", "registered", "unsure"],
    },
  },
} as const
