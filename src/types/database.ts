export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      blog_authors: {
        Row: {
          created_at: string
          display_name: string
          id: string
          key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          excerpt: string
          featured_image_id: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          excerpt: string
          featured_image_id?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          excerpt?: string
          featured_image_id?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "blog_authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_featured_image_id_fkey"
            columns: ["featured_image_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          card_label: string
          card_media_id: string | null
          created_at: string
          display_title: string
          id: string
          name: string
          offset_card: boolean
          published: boolean
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          card_label: string
          card_media_id?: string | null
          created_at?: string
          display_title: string
          id?: string
          name: string
          offset_card?: boolean
          published?: boolean
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          card_label?: string
          card_media_id?: string | null
          created_at?: string
          display_title?: string
          id?: string
          name?: string
          offset_card?: boolean
          published?: boolean
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_card_media_id_fkey"
            columns: ["card_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      category_collages: {
        Row: {
          category_id: string
          container_variant: string
          id: string
          overlay_pos_left_pct: number | null
          overlay_pos_top_pct: number | null
          overlay_primary: string | null
          overlay_secondary: string | null
          published: boolean
          updated_at: string
        }
        Insert: {
          category_id: string
          container_variant?: string
          id?: string
          overlay_pos_left_pct?: number | null
          overlay_pos_top_pct?: number | null
          overlay_primary?: string | null
          overlay_secondary?: string | null
          published?: boolean
          updated_at?: string
        }
        Update: {
          category_id?: string
          container_variant?: string
          id?: string
          overlay_pos_left_pct?: number | null
          overlay_pos_top_pct?: number | null
          overlay_primary?: string | null
          overlay_secondary?: string | null
          published?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_collages_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: true
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_pills: {
        Row: {
          category_id: string
          id: string
          label: string
          published: boolean
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          id?: string
          label: string
          published?: boolean
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          id?: string
          label?: string
          published?: boolean
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_pills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      collage_layers: {
        Row: {
          alt_text: string | null
          clip_variant: string | null
          collage_id: string
          decorative: boolean
          height_pct: number | null
          id: string
          layer_key: string
          layer_type: string
          media_id: string | null
          opacity: number
          panel_variant: string | null
          pos_left_pct: number
          pos_top_pct: number
          published: boolean
          rotation_deg: number
          sort_order: number
          updated_at: string
          width_pct: number
          z_index: number
        }
        Insert: {
          alt_text?: string | null
          clip_variant?: string | null
          collage_id: string
          decorative?: boolean
          height_pct?: number | null
          id?: string
          layer_key: string
          layer_type: string
          media_id?: string | null
          opacity?: number
          panel_variant?: string | null
          pos_left_pct: number
          pos_top_pct: number
          published?: boolean
          rotation_deg?: number
          sort_order?: number
          updated_at?: string
          width_pct: number
          z_index?: number
        }
        Update: {
          alt_text?: string | null
          clip_variant?: string | null
          collage_id?: string
          decorative?: boolean
          height_pct?: number | null
          id?: string
          layer_key?: string
          layer_type?: string
          media_id?: string | null
          opacity?: number
          panel_variant?: string | null
          pos_left_pct?: number
          pos_top_pct?: number
          published?: boolean
          rotation_deg?: number
          sort_order?: number
          updated_at?: string
          width_pct?: number
          z_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "collage_layers_collage_id_fkey"
            columns: ["collage_id"]
            isOneToOne: false
            referencedRelation: "category_collages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collage_layers_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_grid_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          media_id: string
          published: boolean
          sort_order: number
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          media_id: string
          published?: boolean
          sort_order?: number
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          media_id?: string
          published?: boolean
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "contact_grid_images_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          body: string | null
          id: string
          key: string
          media_id: string | null
          published: boolean
          updated_at: string
        }
        Insert: {
          body?: string | null
          id?: string
          key: string
          media_id?: string | null
          published?: boolean
          updated_at?: string
        }
        Update: {
          body?: string | null
          id?: string
          key?: string
          media_id?: string | null
          published?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      features: {
        Row: {
          description: string
          id: string
          image_alt: string
          key: string
          media_id: string
          published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          description: string
          id?: string
          image_alt: string
          key: string
          media_id: string
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          description?: string
          id?: string
          image_alt?: string
          key?: string
          media_id?: string
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "features_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          file_size_bytes: number | null
          height: number | null
          id: string
          mime_type: string
          storage_path: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          mime_type: string
          storage_path: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          mime_type?: string
          storage_path?: string
          width?: number | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_body: string
          about_heading: string
          contact_email: string
          contact_heading: string
          contact_phone: string
          explore_heading: string
          hero_background_media_id: string | null
          hero_cta_href: string
          hero_cta_text: string
          hero_headline: string
          hero_phone_media_id: string | null
          id: string
          logo_media_id: string | null
          meta_description: string | null
          meta_title: string | null
          promo_banner_text: string
          published: boolean
          site_name: string
          tagline: string
          updated_at: string
        }
        Insert: {
          about_body: string
          about_heading: string
          contact_email: string
          contact_heading: string
          contact_phone: string
          explore_heading: string
          hero_background_media_id?: string | null
          hero_cta_href: string
          hero_cta_text: string
          hero_headline: string
          hero_phone_media_id?: string | null
          id?: string
          logo_media_id?: string | null
          meta_description?: string | null
          meta_title?: string | null
          promo_banner_text: string
          published?: boolean
          site_name: string
          tagline: string
          updated_at?: string
        }
        Update: {
          about_body?: string
          about_heading?: string
          contact_email?: string
          contact_heading?: string
          contact_phone?: string
          explore_heading?: string
          hero_background_media_id?: string | null
          hero_cta_href?: string
          hero_cta_text?: string
          hero_headline?: string
          hero_phone_media_id?: string | null
          id?: string
          logo_media_id?: string | null
          meta_description?: string | null
          meta_title?: string | null
          promo_banner_text?: string
          published?: boolean
          site_name?: string
          tagline?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_hero_background_media_id_fkey"
            columns: ["hero_background_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_settings_hero_phone_media_id_fkey"
            columns: ["hero_phone_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_settings_logo_media_id_fkey"
            columns: ["logo_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          id: string
          label: string
          platform: string
          published: boolean
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          id?: string
          label: string
          platform: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          id?: string
          label?: string
          platform?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
