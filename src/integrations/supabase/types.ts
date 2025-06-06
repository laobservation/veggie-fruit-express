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
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          background_color: string
          canonical_url: string | null
          created_at: string | null
          display_order: number | null
          icon: string | null
          id: string
          image_icon: string | null
          is_visible: boolean | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          name: string
          og_description: string | null
          og_image: string | null
          og_title: string | null
          og_url: string | null
          robots_directives: string | null
          structured_data: Json | null
          updated_at: string | null
        }
        Insert: {
          background_color?: string
          canonical_url?: string | null
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          image_icon?: string | null
          is_visible?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          name: string
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_url?: string | null
          robots_directives?: string | null
          structured_data?: Json | null
          updated_at?: string | null
        }
        Update: {
          background_color?: string
          canonical_url?: string | null
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          image_icon?: string | null
          is_visible?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          name?: string
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_url?: string | null
          robots_directives?: string | null
          structured_data?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_videos: {
        Row: {
          created_at: string
          id: string
          platform: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          product_data: Json
          product_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_data: Json
          product_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_data?: Json
          product_id?: string
        }
        Relationships: []
      }
      footer_settings: {
        Row: {
          company_name: string | null
          contact_info: Json | null
          copyright_text: string | null
          created_at: string | null
          description: string | null
          id: number
          quick_links: Json | null
          social_links: Json | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          contact_info?: Json | null
          copyright_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          quick_links?: Json | null
          social_links?: Json | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          contact_info?: Json | null
          copyright_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          quick_links?: Json | null
          social_links?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      instagram_posts: {
        Row: {
          caption: string
          created_at: string | null
          id: string
          thumbnail_url: string | null
          updated_at: string | null
          video_url: string
        }
        Insert: {
          caption: string
          created_at?: string | null
          id?: string
          thumbnail_url?: string | null
          updated_at?: string | null
          video_url: string
        }
        Update: {
          caption?: string
          created_at?: string | null
          id?: string
          thumbnail_url?: string | null
          updated_at?: string | null
          video_url?: string
        }
        Relationships: []
      }
      Orders: {
        Row: {
          Adresse: string | null
          "Client Name": string | null
          created_at: string
          delivery_day: string | null
          id: number
          notified: boolean | null
          order_items: Json | null
          Phone: number | null
          preferred_time: string | null
          shipping_cost: number | null
          status: string | null
          subtotal: number | null
          total_amount: number | null
        }
        Insert: {
          Adresse?: string | null
          "Client Name"?: string | null
          created_at?: string
          delivery_day?: string | null
          id?: number
          notified?: boolean | null
          order_items?: Json | null
          Phone?: number | null
          preferred_time?: string | null
          shipping_cost?: number | null
          status?: string | null
          subtotal?: number | null
          total_amount?: number | null
        }
        Update: {
          Adresse?: string | null
          "Client Name"?: string | null
          created_at?: string
          delivery_day?: string | null
          id?: number
          notified?: boolean | null
          order_items?: Json | null
          Phone?: number | null
          preferred_time?: string | null
          shipping_cost?: number | null
          status?: string | null
          subtotal?: number | null
          total_amount?: number | null
        }
        Relationships: []
      }
      Products: {
        Row: {
          additional_images: string[] | null
          category: string | null
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          link_to_category: boolean | null
          media_type: string | null
          name: string | null
          price: number | null
          stock: number | null
          unit: string | null
        }
        Insert: {
          additional_images?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          link_to_category?: boolean | null
          media_type?: string | null
          name?: string | null
          price?: number | null
          stock?: number | null
          unit?: string | null
        }
        Update: {
          additional_images?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          link_to_category?: boolean | null
          media_type?: string | null
          name?: string | null
          price?: number | null
          stock?: number | null
          unit?: string | null
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          id: string
          include_in_sitemap: boolean | null
          language_code: string | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          og_url: string | null
          page_slug: string
          robots_directives: string | null
          route: string
          structured_data: Json | null
          twitter_card: string | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          id?: string
          include_in_sitemap?: boolean | null
          language_code?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_url?: string | null
          page_slug: string
          robots_directives?: string | null
          route: string
          structured_data?: Json | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          id?: string
          include_in_sitemap?: boolean | null
          language_code?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_url?: string | null
          page_slug?: string
          robots_directives?: string | null
          route?: string
          structured_data?: Json | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          currency: string | null
          delivery_fee: number | null
          description: string | null
          enable_delivery: boolean | null
          enable_payments: boolean | null
          id: number
          minimum_order_value: number | null
          site_name: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_fee?: number | null
          description?: string | null
          enable_delivery?: boolean | null
          enable_payments?: boolean | null
          id?: number
          minimum_order_value?: number | null
          site_name?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_fee?: number | null
          description?: string | null
          enable_delivery?: boolean | null
          enable_payments?: boolean | null
          id?: number
          minimum_order_value?: number | null
          site_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      slides: {
        Row: {
          action_url: string | null
          call_to_action: string | null
          color: string
          created_at: string | null
          id: string
          image: string | null
          order: number | null
          position: string | null
          show_button: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          action_url?: string | null
          call_to_action?: string | null
          color?: string
          created_at?: string | null
          id?: string
          image?: string | null
          order?: number | null
          position?: string | null
          show_button?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          action_url?: string | null
          call_to_action?: string | null
          color?: string
          created_at?: string | null
          id?: string
          image?: string | null
          order?: number | null
          position?: string | null
          show_button?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonial_videos: {
        Row: {
          created_at: string
          display_order: number
          enable_redirect: boolean | null
          id: string
          is_active: boolean
          platform: string
          redirect_url: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_file_path: string | null
          video_file_size: number | null
          video_url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          enable_redirect?: boolean | null
          id?: string
          is_active?: boolean
          platform: string
          redirect_url?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_file_path?: string | null
          video_file_size?: number | null
          video_url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          enable_redirect?: boolean | null
          id?: string
          is_active?: boolean
          platform?: string
          redirect_url?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_file_path?: string | null
          video_file_size?: number | null
          video_url?: string
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string
          id: number
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: number
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_order_by_id: {
        Args: { order_id: number }
        Returns: boolean
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
