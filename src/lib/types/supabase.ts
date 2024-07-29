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
      admin: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      hack: {
        Row: {
          description: string | null
          end_time: string | null
          id: string
          is_active: boolean | null
          start_time: string | null
          term: number | null
          title: string | null
          winner: string | null
        }
        Insert: {
          description?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          start_time?: string | null
          term?: number | null
          title?: string | null
          winner?: string | null
        }
        Update: {
          description?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          start_time?: string | null
          term?: number | null
          title?: string | null
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hack_term_fkey"
            columns: ["term"]
            isOneToOne: false
            referencedRelation: "term"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hack_winner_fkey"
            columns: ["winner"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      submission: {
        Row: {
          created_at: string
          hack: string | null
          id: string
          is_winner: boolean | null
          points_scored: number | null
          submission_additional_links: Json | null
          submission_description: string | null
          submission_link: string | null
          submission_title: string | null
          term: number | null
          user: string | null
        }
        Insert: {
          created_at?: string
          hack?: string | null
          id?: string
          is_winner?: boolean | null
          points_scored?: number | null
          submission_additional_links?: Json | null
          submission_description?: string | null
          submission_link?: string | null
          submission_title?: string | null
          term?: number | null
          user?: string | null
        }
        Update: {
          created_at?: string
          hack?: string | null
          id?: string
          is_winner?: boolean | null
          points_scored?: number | null
          submission_additional_links?: Json | null
          submission_description?: string | null
          submission_link?: string | null
          submission_title?: string | null
          term?: number | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_hack_fkey"
            columns: ["hack"]
            isOneToOne: false
            referencedRelation: "hack"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_term_fkey"
            columns: ["term"]
            isOneToOne: false
            referencedRelation: "term"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      term: {
        Row: {
          id: number
          is_active: boolean | null
          is_monsoon: boolean | null
          year: number | null
        }
        Insert: {
          id?: number
          is_active?: boolean | null
          is_monsoon?: boolean | null
          year?: number | null
        }
        Update: {
          id?: number
          is_active?: boolean | null
          is_monsoon?: boolean | null
          year?: number | null
        }
        Relationships: []
      }
      user: {
        Row: {
          batch: number | null
          created_at: string
          email: string | null
          id: string
          major: string | null
          name: string | null
          roll_number: string | null
        }
        Insert: {
          batch?: number | null
          created_at?: string
          email?: string | null
          id?: string
          major?: string | null
          name?: string | null
          roll_number?: string | null
        }
        Update: {
          batch?: number | null
          created_at?: string
          email?: string | null
          id?: string
          major?: string | null
          name?: string | null
          roll_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
