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
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          resource_id: string | null
          resource_type: string | null
          tenant_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string | null
          tenant_id: string
          type: Database["public"]["Enums"]["campaign_type"]
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject?: string | null
          tenant_id: string
          type: Database["public"]["Enums"]["campaign_type"]
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string | null
          tenant_id?: string
          type?: Database["public"]["Enums"]["campaign_type"]
          updated_at?: string | null
          variables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          audience_filter: Json | null
          clicked_count: number | null
          content: string | null
          created_at: string | null
          created_by: string | null
          delivered_count: number | null
          failed_count: number | null
          id: string
          name: string
          opened_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          sent_count: number | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          subject: string | null
          template_id: string | null
          tenant_id: string
          total_recipients: number | null
          type: Database["public"]["Enums"]["campaign_type"]
          updated_at: string | null
        }
        Insert: {
          audience_filter?: Json | null
          clicked_count?: number | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          name: string
          opened_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          subject?: string | null
          template_id?: string | null
          tenant_id: string
          total_recipients?: number | null
          type: Database["public"]["Enums"]["campaign_type"]
          updated_at?: string | null
        }
        Update: {
          audience_filter?: Json | null
          clicked_count?: number | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          name?: string
          opened_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          subject?: string | null
          template_id?: string | null
          tenant_id?: string
          total_recipients?: number | null
          type?: Database["public"]["Enums"]["campaign_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_configs: {
        Row: {
          ai_model: string | null
          allowed_domains: string[] | null
          created_at: string | null
          fallback_message: string | null
          id: string
          is_active: boolean | null
          name: string
          position: string | null
          primary_color: string | null
          system_prompt: string | null
          tenant_id: string
          type: string | null
          updated_at: string | null
          welcome_message: string | null
          widget_config: Json | null
        }
        Insert: {
          ai_model?: string | null
          allowed_domains?: string[] | null
          created_at?: string | null
          fallback_message?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          position?: string | null
          primary_color?: string | null
          system_prompt?: string | null
          tenant_id: string
          type?: string | null
          updated_at?: string | null
          welcome_message?: string | null
          widget_config?: Json | null
        }
        Update: {
          ai_model?: string | null
          allowed_domains?: string[] | null
          created_at?: string | null
          fallback_message?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          position?: string | null
          primary_color?: string | null
          system_prompt?: string | null
          tenant_id?: string
          type?: string | null
          updated_at?: string | null
          welcome_message?: string | null
          widget_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_configs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_pages: {
        Row: {
          content: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          slug: string
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug: string
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_pages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_pages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_activities: {
        Row: {
          completed_at: string | null
          contact_id: string | null
          created_at: string | null
          created_by: string | null
          deal_id: string | null
          description: string | null
          id: string
          scheduled_at: string | null
          tenant_id: string
          title: string | null
          type: string
        }
        Insert: {
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          id?: string
          scheduled_at?: string | null
          tenant_id: string
          title?: string | null
          type: string
        }
        Update: {
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          id?: string
          scheduled_at?: string | null
          tenant_id?: string
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string | null
          custom_fields: Json | null
          email: string | null
          email_opt_in: boolean | null
          first_name: string | null
          id: string
          job_title: string | null
          last_contact_at: string | null
          last_name: string | null
          phone: string | null
          sms_opt_in: boolean | null
          source: string | null
          status: Database["public"]["Enums"]["contact_status"] | null
          tags: string[] | null
          tenant_id: string
          updated_at: string | null
          whatsapp_opt_in: boolean | null
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          email_opt_in?: boolean | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_contact_at?: string | null
          last_name?: string | null
          phone?: string | null
          sms_opt_in?: boolean | null
          source?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          tags?: string[] | null
          tenant_id: string
          updated_at?: string | null
          whatsapp_opt_in?: boolean | null
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          email_opt_in?: boolean | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_contact_at?: string | null
          last_name?: string | null
          phone?: string | null
          sms_opt_in?: boolean | null
          source?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          tags?: string[] | null
          tenant_id?: string
          updated_at?: string | null
          whatsapp_opt_in?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contacts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_deals: {
        Row: {
          assigned_to: string | null
          contact_id: string | null
          created_at: string | null
          currency: string | null
          expected_close_date: string | null
          id: string
          notes: string | null
          probability: number | null
          stage: Database["public"]["Enums"]["deal_stage"] | null
          tenant_id: string
          title: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          assigned_to?: string | null
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          probability?: number | null
          stage?: Database["public"]["Enums"]["deal_stage"] | null
          tenant_id: string
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          assigned_to?: string | null
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          probability?: number | null
          stage?: Database["public"]["Enums"]["deal_stage"] | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      meta_ads_configs: {
        Row: {
          access_token: string | null
          account_name: string | null
          ad_account_id: string | null
          connected_at: string | null
          created_at: string | null
          id: string
          is_connected: boolean | null
          page_id: string | null
          pixel_id: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          account_name?: string | null
          ad_account_id?: string | null
          connected_at?: string | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          page_id?: string | null
          pixel_id?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          account_name?: string | null
          ad_account_id?: string | null
          connected_at?: string | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          page_id?: string | null
          pixel_id?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meta_ads_configs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          last_seen: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          last_seen?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          last_seen?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_orders: {
        Row: {
          amount: number
          billing_cycle: string
          captured_at: string | null
          created_at: string | null
          currency: string
          error_description: string | null
          id: string
          notes: Json | null
          plan_id: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          razorpay_subscription_id: string | null
          status: string
          subscription_id: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          billing_cycle?: string
          captured_at?: string | null
          created_at?: string | null
          currency?: string
          error_description?: string | null
          id?: string
          notes?: Json | null
          plan_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          razorpay_subscription_id?: string | null
          status?: string
          subscription_id?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          billing_cycle?: string
          captured_at?: string | null
          created_at?: string | null
          currency?: string
          error_description?: string | null
          id?: string
          notes?: Json | null
          plan_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          razorpay_subscription_id?: string | null
          status?: string
          subscription_id?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_orders_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: string
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      seo_projects: {
        Row: {
          audit_data: Json | null
          audit_score: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_audit_at: string | null
          name: string
          target_keywords: string[] | null
          tenant_id: string
          updated_at: string | null
          website_url: string
        }
        Insert: {
          audit_data?: Json | null
          audit_score?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_audit_at?: string | null
          name: string
          target_keywords?: string[] | null
          tenant_id: string
          updated_at?: string | null
          website_url: string
        }
        Update: {
          audit_data?: Json | null
          audit_score?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_audit_at?: string | null
          name?: string
          target_keywords?: string[] | null
          tenant_id?: string
          updated_at?: string | null
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_projects_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          feature_limits: Json | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price_monthly: number
          price_yearly: number
          razorpay_plan_id_monthly: string | null
          razorpay_plan_id_yearly: string | null
          slug: string
          sort_order: number | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          feature_limits?: Json | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price_monthly?: number
          price_yearly?: number
          razorpay_plan_id_monthly?: string | null
          razorpay_plan_id_yearly?: string | null
          slug: string
          sort_order?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          feature_limits?: Json | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          razorpay_plan_id_monthly?: string | null
          razorpay_plan_id_yearly?: string | null
          slug?: string
          sort_order?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string | null
          canceled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          razorpay_customer_id: string | null
          razorpay_subscription_id: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tenant_id: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
        }
        Insert: {
          billing_cycle?: string | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_api_keys: {
        Row: {
          created_at: string | null
          created_by: string | null
          encrypted_value: string
          id: string
          is_verified: boolean | null
          key_name: string
          provider: string
          tenant_id: string
          updated_at: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          encrypted_value: string
          id?: string
          is_verified?: boolean | null
          key_name: string
          provider: string
          tenant_id: string
          updated_at?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          encrypted_value?: string
          id?: string
          is_verified?: boolean | null
          key_name?: string
          provider?: string
          tenant_id?: string
          updated_at?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_api_keys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_api_keys_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_features: {
        Row: {
          created_at: string | null
          extra_config: Json | null
          feature_key: string
          id: string
          is_enabled: boolean | null
          tenant_id: string
          usage_count: number | null
          usage_limit: number | null
        }
        Insert: {
          created_at?: string | null
          extra_config?: Json | null
          feature_key: string
          id?: string
          is_enabled?: boolean | null
          tenant_id: string
          usage_count?: number | null
          usage_limit?: number | null
        }
        Update: {
          created_at?: string | null
          extra_config?: Json | null
          feature_key?: string
          id?: string
          is_enabled?: boolean | null
          tenant_id?: string
          usage_count?: number | null
          usage_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_features_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          domain: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_setup_complete: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          slug: string
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          domain?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_setup_complete?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          slug: string
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          domain?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_setup_complete?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          slug?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          created_at: string | null
          granted_by: string | null
          id: string
          is_granted: boolean | null
          permission_key: string
          profile_id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          is_granted?: boolean | null
          permission_key: string
          profile_id: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          is_granted?: boolean | null
          permission_key?: string
          profile_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_bot_configs: {
        Row: {
          created_at: string | null
          greeting_message: string | null
          id: string
          is_active: boolean | null
          language: string | null
          name: string
          phone_number: string | null
          provider: string | null
          system_prompt: string | null
          tenant_id: string
          updated_at: string | null
          voice_id: string | null
        }
        Insert: {
          created_at?: string | null
          greeting_message?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          name: string
          phone_number?: string | null
          provider?: string | null
          system_prompt?: string | null
          tenant_id: string
          updated_at?: string | null
          voice_id?: string | null
        }
        Update: {
          created_at?: string | null
          greeting_message?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          name?: string
          phone_number?: string | null
          provider?: string | null
          system_prompt?: string | null
          tenant_id?: string
          updated_at?: string | null
          voice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_bot_configs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      website_builder_projects: {
        Row: {
          created_at: string | null
          custom_domain: string | null
          id: string
          is_published: boolean | null
          name: string
          page_data: Json | null
          published_at: string | null
          subdomain: string | null
          template_id: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_domain?: string | null
          id?: string
          is_published?: boolean | null
          name: string
          page_data?: Json | null
          published_at?: string | null
          subdomain?: string | null
          template_id?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_domain?: string | null
          id?: string
          is_published?: boolean | null
          name?: string
          page_data?: Json | null
          published_at?: string | null
          subdomain?: string | null
          template_id?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "website_builder_projects_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_configs: {
        Row: {
          access_token: string | null
          connected_at: string | null
          created_at: string | null
          display_name: string | null
          id: string
          is_connected: boolean | null
          phone_number: string | null
          phone_number_id: string | null
          tenant_id: string
          updated_at: string | null
          waba_id: string | null
          webhook_verify_token: string | null
        }
        Insert: {
          access_token?: string | null
          connected_at?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_connected?: boolean | null
          phone_number?: string | null
          phone_number_id?: string | null
          tenant_id: string
          updated_at?: string | null
          waba_id?: string | null
          webhook_verify_token?: string | null
        }
        Update: {
          access_token?: string | null
          connected_at?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_connected?: boolean | null
          phone_number?: string | null
          phone_number_id?: string | null
          tenant_id?: string
          updated_at?: string | null
          waba_id?: string | null
          webhook_verify_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_configs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_conversations: {
        Row: {
          contact_id: string | null
          contact_name: string | null
          created_at: string | null
          id: string
          is_ai_active: boolean | null
          is_resolved: boolean | null
          last_message: string | null
          last_message_at: string | null
          tenant_id: string
          unread_count: number | null
          updated_at: string | null
          wa_contact_id: string
          wa_phone: string
        }
        Insert: {
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          id?: string
          is_ai_active?: boolean | null
          is_resolved?: boolean | null
          last_message?: string | null
          last_message_at?: string | null
          tenant_id: string
          unread_count?: number | null
          updated_at?: string | null
          wa_contact_id: string
          wa_phone: string
        }
        Update: {
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          id?: string
          is_ai_active?: boolean | null
          is_resolved?: boolean | null
          last_message?: string | null
          last_message_at?: string | null
          tenant_id?: string
          unread_count?: number | null
          updated_at?: string | null
          wa_contact_id?: string
          wa_phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          content: string | null
          conversation_id: string
          delivered_at: string | null
          direction: string
          id: string
          is_ai_generated: boolean | null
          media_url: string | null
          message_type: string | null
          read_at: string | null
          sent_at: string | null
          status: string | null
          tenant_id: string
          wa_message_id: string | null
        }
        Insert: {
          content?: string | null
          conversation_id: string
          delivered_at?: string | null
          direction: string
          id?: string
          is_ai_generated?: boolean | null
          media_url?: string | null
          message_type?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
          tenant_id: string
          wa_message_id?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string
          delivered_at?: string | null
          direction?: string
          id?: string
          is_ai_generated?: boolean | null
          media_url?: string | null
          message_type?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
          tenant_id?: string
          wa_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenant_id: { Args: never; Returns: string }
      is_super_admin: { Args: never; Returns: boolean }
      is_tenant_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      campaign_status:
        | "draft"
        | "scheduled"
        | "sending"
        | "sent"
        | "failed"
        | "paused"
      campaign_type: "whatsapp" | "sms" | "email"
      contact_status: "active" | "inactive" | "blocked"
      deal_stage:
        | "lead"
        | "qualified"
        | "proposal"
        | "negotiation"
        | "won"
        | "lost"
      subscription_status:
        | "active"
        | "trialing"
        | "past_due"
        | "canceled"
        | "paused"
        | "incomplete"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
      user_role: "super_admin" | "tenant_admin" | "tenant_user"
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
      campaign_status: [
        "draft",
        "scheduled",
        "sending",
        "sent",
        "failed",
        "paused",
      ],
      campaign_type: ["whatsapp", "sms", "email"],
      contact_status: ["active", "inactive", "blocked"],
      deal_stage: [
        "lead",
        "qualified",
        "proposal",
        "negotiation",
        "won",
        "lost",
      ],
      subscription_status: [
        "active",
        "trialing",
        "past_due",
        "canceled",
        "paused",
        "incomplete",
      ],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
      user_role: ["super_admin", "tenant_admin", "tenant_user"],
    },
  },
} as const
