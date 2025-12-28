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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_stories: {
        Row: {
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          inventory_items: Json | null
          is_published: boolean
          level: string
          slug: string
          start_page_id: string
          subject_id: string[]
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          inventory_items?: Json | null
          is_published?: boolean
          level: string
          slug: string
          start_page_id?: string
          subject_id?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          inventory_items?: Json | null
          is_published?: boolean
          level?: string
          slug?: string
          start_page_id?: string
          subject_id?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_story_pages: {
        Row: {
          choices: Json
          collected_item_id: string | null
          created_at: string
          ending_type: string | null
          id: string
          image_url: string | null
          is_ending: boolean
          page_id: string
          sort_order: number
          story_id: string
          text: string
          text_feminine: string | null
          text_masculine: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          choices?: Json
          collected_item_id?: string | null
          created_at?: string
          ending_type?: string | null
          id?: string
          image_url?: string | null
          is_ending?: boolean
          page_id: string
          sort_order?: number
          story_id: string
          text: string
          text_feminine?: string | null
          text_masculine?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          choices?: Json
          collected_item_id?: string | null
          created_at?: string
          ending_type?: string | null
          id?: string
          image_url?: string | null
          is_ending?: boolean
          page_id?: string
          sort_order?: number
          story_id?: string
          text?: string
          text_feminine?: string | null
          text_masculine?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_story_pages_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "admin_stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_story_pages_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "published_stories_view"
            referencedColumns: ["id"]
          },
        ]
      }
      children_profiles: {
        Row: {
          avatar: string
          created_at: string
          id: string
          parent_user_id: string
          prenom: string
          updated_at: string
        }
        Insert: {
          avatar?: string
          created_at?: string
          id?: string
          parent_user_id: string
          prenom: string
          updated_at?: string
        }
        Update: {
          avatar?: string
          created_at?: string
          id?: string
          parent_user_id?: string
          prenom?: string
          updated_at?: string
        }
        Relationships: []
      }
      completed_stories: {
        Row: {
          child_profile_id: string | null
          completed_at: string
          ending_type: string | null
          id: string
          story_id: string
          user_id: string
        }
        Insert: {
          child_profile_id?: string | null
          completed_at?: string
          ending_type?: string | null
          id?: string
          story_id: string
          user_id: string
        }
        Update: {
          child_profile_id?: string | null
          completed_at?: string
          ending_type?: string | null
          id?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completed_stories_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "children_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          id: string
          last_login: string | null
          prenom: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          id: string
          last_login?: string | null
          prenom: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          id?: string
          last_login?: string | null
          prenom?: string
          updated_at?: string
        }
        Relationships: []
      }
      story_page_overrides: {
        Row: {
          created_at: string
          id: string
          page_id: string
          story_id: string
          text: string
          text_feminine: string | null
          text_masculine: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_id: string
          story_id: string
          text: string
          text_feminine?: string | null
          text_masculine?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_id?: string
          story_id?: string
          text?: string
          text_feminine?: string | null
          text_masculine?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      story_progress: {
        Row: {
          child_profile_id: string | null
          current_page_id: string
          id: string
          prenom_histoire: string | null
          story_id: string
          updated_at: string
          user_id: string
          visited_pages: Json | null
        }
        Insert: {
          child_profile_id?: string | null
          current_page_id: string
          id?: string
          prenom_histoire?: string | null
          story_id: string
          updated_at?: string
          user_id: string
          visited_pages?: Json | null
        }
        Update: {
          child_profile_id?: string | null
          current_page_id?: string
          id?: string
          prenom_histoire?: string | null
          story_id?: string
          updated_at?: string
          user_id?: string
          visited_pages?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "story_progress_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "children_profiles"
            referencedColumns: ["id"]
          },
        ]
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
          role?: Database["public"]["Enums"]["app_role"]
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
      published_stories_view: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string | null
          is_published: boolean | null
          level: string | null
          slug: string | null
          start_page_id: string | null
          subject_id: string[] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_published?: boolean | null
          level?: string | null
          slug?: string | null
          start_page_id?: string | null
          subject_id?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_published?: boolean | null
          level?: string | null
          slug?: string | null
          start_page_id?: string | null
          subject_id?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_admin_stats: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
