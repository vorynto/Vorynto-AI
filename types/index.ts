export type UserRole = "super_admin" | "tenant_admin" | "tenant_user";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo_url?: string;
  email?: string;
  phone?: string;
  is_active: boolean;
  is_setup_complete: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  tenant_id?: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  features: string[];
  feature_limits: Record<string, number>;
  is_active: boolean;
  is_featured: boolean;
}

export interface Subscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: string;
  billing_cycle: string;
  current_period_end?: string;
  trial_end?: string;
  plan?: SubscriptionPlan;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

export interface Feature {
  key: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export interface StatsCard {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}

export type { Database } from "./supabase";
