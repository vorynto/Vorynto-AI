// Auto-generated types from Supabase schema
// Run: supabase gen types typescript --local > types/supabase.ts
// This is a placeholder - regenerate after connecting to your Supabase project

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          domain: string | null;
          logo_url: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          timezone: string;
          currency: string;
          is_active: boolean;
          is_setup_complete: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tenants"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["tenants"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          tenant_id: string | null;
          role: "super_admin" | "tenant_admin" | "tenant_user";
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          is_active: boolean;
          last_seen: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      subscription_plans: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price_monthly: number;
          price_yearly: number;
          currency: string;
          features: Json;
          feature_limits: Json;
          is_active: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["subscription_plans"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["subscription_plans"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          tenant_id: string;
          plan_id: string;
          status: string;
          billing_cycle: string;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          trial_end: string | null;
          canceled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["subscriptions"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      crm_contacts: {
        Row: {
          id: string;
          tenant_id: string;
          first_name: string | null;
          last_name: string | null;
          email: string | null;
          phone: string | null;
          company: string | null;
          job_title: string | null;
          status: string;
          source: string | null;
          tags: string[] | null;
          custom_fields: Json;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["crm_contacts"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["crm_contacts"]["Insert"]>;
      };
      campaigns: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          type: string;
          status: string;
          subject: string | null;
          content: string | null;
          scheduled_at: string | null;
          sent_at: string | null;
          total_recipients: number;
          sent_count: number;
          delivered_count: number;
          opened_count: number;
          clicked_count: number;
          failed_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["campaigns"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["campaigns"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_user_tenant_id: { Args: Record<string, never>; Returns: string };
      is_super_admin: { Args: Record<string, never>; Returns: boolean };
      is_tenant_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: "super_admin" | "tenant_admin" | "tenant_user";
      subscription_status: "active" | "trialing" | "past_due" | "canceled" | "paused" | "incomplete";
      campaign_type: "whatsapp" | "sms" | "email";
      campaign_status: "draft" | "scheduled" | "sending" | "sent" | "failed" | "paused";
    };
  };
}
