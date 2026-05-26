-- ============================================================
-- Vorynto AI - Multi-Tenant Database Schema
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('super_admin', 'tenant_admin', 'tenant_user');
CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'paused', 'incomplete');
CREATE TYPE campaign_type AS ENUM ('whatsapp', 'sms', 'email');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'failed', 'paused');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE contact_status AS ENUM ('active', 'inactive', 'blocked');
CREATE TYPE deal_stage AS ENUM ('lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost');

-- ============================================================
-- TENANTS (Companies / Customer Accounts)
-- ============================================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  logo_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  timezone VARCHAR(100) DEFAULT 'UTC',
  currency VARCHAR(10) DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  is_setup_complete BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  role user_role DEFAULT 'tenant_user',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTION PLANS
-- ============================================================
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'USD',
  stripe_price_id_monthly VARCHAR(255),
  stripe_price_id_yearly VARCHAR(255),
  features JSONB DEFAULT '[]',
  feature_limits JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status subscription_status DEFAULT 'trialing',
  billing_cycle VARCHAR(20) DEFAULT 'monthly',
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TENANT FEATURES (which features each tenant can access)
-- ============================================================
CREATE TABLE tenant_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature_key VARCHAR(100) NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  extra_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, feature_key)
);

-- ============================================================
-- TENANT API KEYS (third-party integrations)
-- ============================================================
CREATE TABLE tenant_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider VARCHAR(100) NOT NULL,
  key_name VARCHAR(100) NOT NULL,
  encrypted_value TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, provider, key_name)
);

-- ============================================================
-- USER PERMISSIONS (function-level access control)
-- ============================================================
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  permission_key VARCHAR(200) NOT NULL,
  is_granted BOOLEAN DEFAULT true,
  granted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, permission_key)
);

-- ============================================================
-- CRM - CONTACTS
-- ============================================================
CREATE TABLE crm_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  job_title VARCHAR(100),
  status contact_status DEFAULT 'active',
  source VARCHAR(100),
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}',
  assigned_to UUID REFERENCES profiles(id),
  whatsapp_opt_in BOOLEAN DEFAULT false,
  sms_opt_in BOOLEAN DEFAULT false,
  email_opt_in BOOLEAN DEFAULT true,
  last_contact_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CRM - DEALS / PIPELINE
-- ============================================================
CREATE TABLE crm_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  value DECIMAL(12,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'USD',
  stage deal_stage DEFAULT 'lead',
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  assigned_to UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CRM - ACTIVITIES / NOTES
-- ============================================================
CREATE TABLE crm_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES crm_deals(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WHATSAPP CONFIGURATION
-- ============================================================
CREATE TABLE whatsapp_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID UNIQUE NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  phone_number_id VARCHAR(100),
  waba_id VARCHAR(100),
  access_token TEXT,
  webhook_verify_token VARCHAR(255),
  is_connected BOOLEAN DEFAULT false,
  connected_at TIMESTAMPTZ,
  phone_number VARCHAR(50),
  display_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WHATSAPP CONVERSATIONS
-- ============================================================
CREATE TABLE whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
  wa_contact_id VARCHAR(50) NOT NULL,
  wa_phone VARCHAR(50) NOT NULL,
  contact_name VARCHAR(255),
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  is_ai_active BOOLEAN DEFAULT true,
  is_resolved BOOLEAN DEFAULT false,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WHATSAPP MESSAGES
-- ============================================================
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,
  wa_message_id VARCHAR(255),
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_type VARCHAR(50) DEFAULT 'text',
  content TEXT,
  media_url TEXT,
  status VARCHAR(20) DEFAULT 'sent',
  is_ai_generated BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ
);

-- ============================================================
-- CHATBOT CONFIGURATIONS
-- ============================================================
CREATE TABLE chatbot_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'website',
  ai_model VARCHAR(100) DEFAULT 'gpt-4o',
  system_prompt TEXT,
  welcome_message TEXT,
  fallback_message TEXT,
  primary_color VARCHAR(20) DEFAULT '#7c3aed',
  position VARCHAR(20) DEFAULT 'bottom-right',
  is_active BOOLEAN DEFAULT true,
  allowed_domains TEXT[],
  widget_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CAMPAIGNS
-- ============================================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type campaign_type NOT NULL,
  status campaign_status DEFAULT 'draft',
  subject VARCHAR(500),
  content TEXT,
  template_id UUID,
  audience_filter JSONB DEFAULT '{}',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CAMPAIGN TEMPLATES
-- ============================================================
CREATE TABLE campaign_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type campaign_type NOT NULL,
  subject VARCHAR(500),
  content TEXT NOT NULL,
  variables TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VOICE BOT CONFIGURATIONS
-- ============================================================
CREATE TABLE voice_bot_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  voice_id VARCHAR(100) DEFAULT 'alloy',
  language VARCHAR(20) DEFAULT 'en-US',
  system_prompt TEXT,
  greeting_message TEXT,
  is_active BOOLEAN DEFAULT true,
  phone_number VARCHAR(50),
  provider VARCHAR(50) DEFAULT 'openai',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- META ADS INTEGRATION
-- ============================================================
CREATE TABLE meta_ads_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID UNIQUE NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  access_token TEXT,
  ad_account_id VARCHAR(100),
  page_id VARCHAR(100),
  pixel_id VARCHAR(100),
  is_connected BOOLEAN DEFAULT false,
  connected_at TIMESTAMPTZ,
  account_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SEO PROJECTS
-- ============================================================
CREATE TABLE seo_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  website_url VARCHAR(500) NOT NULL,
  name VARCHAR(255) NOT NULL,
  target_keywords TEXT[],
  last_audit_at TIMESTAMPTZ,
  audit_score INTEGER,
  audit_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WEBSITE BUILDER PROJECTS
-- ============================================================
CREATE TABLE website_builder_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100),
  custom_domain VARCHAR(255),
  template_id VARCHAR(100),
  page_data JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id),
  assigned_to UUID REFERENCES profiles(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ticket_status DEFAULT 'open',
  priority ticket_priority DEFAULT 'medium',
  category VARCHAR(100),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CMS PAGE CONTENT (managed by super admin)
-- ============================================================
CREATE TABLE cms_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  content JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(200) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_profiles_tenant ON profiles(tenant_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_tenant_features_tenant ON tenant_features(tenant_id);
CREATE INDEX idx_crm_contacts_tenant ON crm_contacts(tenant_id);
CREATE INDEX idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX idx_crm_contacts_phone ON crm_contacts(phone);
CREATE INDEX idx_crm_deals_tenant ON crm_deals(tenant_id);
CREATE INDEX idx_whatsapp_convs_tenant ON whatsapp_conversations(tenant_id);
CREATE INDEX idx_whatsapp_msgs_conversation ON whatsapp_messages(conversation_id);
CREATE INDEX idx_campaigns_tenant ON campaigns(tenant_id);
CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_bot_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_ads_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_builder_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Helper function: get user's tenant_id
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper function: check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin');
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper function: check if user is tenant admin
CREATE OR REPLACE FUNCTION is_tenant_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'tenant_admin'));
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- RLS Policies: Tenants
CREATE POLICY "super_admin_all_tenants" ON tenants FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_users_own_tenant" ON tenants FOR SELECT USING (id = get_user_tenant_id());

-- RLS Policies: Profiles
CREATE POLICY "super_admin_all_profiles" ON profiles FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_users_own_profile" ON profiles FOR SELECT USING (tenant_id = get_user_tenant_id());
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE USING (id = auth.uid());

-- RLS Policies: Subscriptions
CREATE POLICY "super_admin_all_subs" ON subscriptions FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_sub" ON subscriptions FOR SELECT USING (tenant_id = get_user_tenant_id());

-- RLS Policies: Tenant Features
CREATE POLICY "super_admin_all_features" ON tenant_features FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_features" ON tenant_features FOR SELECT USING (tenant_id = get_user_tenant_id());

-- RLS Policies: Tenant API Keys
CREATE POLICY "super_admin_all_keys" ON tenant_api_keys FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_admin_own_keys" ON tenant_api_keys FOR ALL USING (tenant_id = get_user_tenant_id() AND is_tenant_admin());

-- RLS Policies: CRM Contacts
CREATE POLICY "super_admin_all_contacts" ON crm_contacts FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_contacts" ON crm_contacts FOR ALL USING (tenant_id = get_user_tenant_id());

-- RLS Policies: CRM Deals
CREATE POLICY "super_admin_all_deals" ON crm_deals FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_deals" ON crm_deals FOR ALL USING (tenant_id = get_user_tenant_id());

-- RLS Policies: WhatsApp
CREATE POLICY "super_admin_all_wa" ON whatsapp_configs FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_wa" ON whatsapp_configs FOR ALL USING (tenant_id = get_user_tenant_id() AND is_tenant_admin());
CREATE POLICY "super_admin_all_wa_convs" ON whatsapp_conversations FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_wa_convs" ON whatsapp_conversations FOR ALL USING (tenant_id = get_user_tenant_id());
CREATE POLICY "super_admin_all_wa_msgs" ON whatsapp_messages FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_wa_msgs" ON whatsapp_messages FOR ALL USING (tenant_id = get_user_tenant_id());

-- RLS Policies: Campaigns
CREATE POLICY "super_admin_all_campaigns" ON campaigns FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_campaigns" ON campaigns FOR ALL USING (tenant_id = get_user_tenant_id());

-- RLS Policies: Chatbot
CREATE POLICY "super_admin_all_chatbot" ON chatbot_configs FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_chatbot" ON chatbot_configs FOR ALL USING (tenant_id = get_user_tenant_id());

-- RLS Policies: Voice Bot
CREATE POLICY "super_admin_all_voice" ON voice_bot_configs FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_voice" ON voice_bot_configs FOR ALL USING (tenant_id = get_user_tenant_id());

-- RLS Policies: Meta Ads
CREATE POLICY "super_admin_all_meta" ON meta_ads_configs FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_meta" ON meta_ads_configs FOR ALL USING (tenant_id = get_user_tenant_id() AND is_tenant_admin());

-- RLS Policies: SEO
CREATE POLICY "super_admin_all_seo" ON seo_projects FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_seo" ON seo_projects FOR ALL USING (tenant_id = get_user_tenant_id());

-- RLS Policies: Website Builder
CREATE POLICY "super_admin_all_wb" ON website_builder_projects FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_wb" ON website_builder_projects FOR ALL USING (tenant_id = get_user_tenant_id());

-- RLS Policies: Support Tickets
CREATE POLICY "super_admin_all_tickets" ON support_tickets FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_tickets" ON support_tickets FOR ALL USING (tenant_id = get_user_tenant_id());

-- ============================================================
-- TRIGGERS: updated_at automation
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER crm_contacts_updated_at BEFORE UPDATE ON crm_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER crm_deals_updated_at BEFORE UPDATE ON crm_deals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER chatbot_configs_updated_at BEFORE UPDATE ON chatbot_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER whatsapp_configs_updated_at BEFORE UPDATE ON whatsapp_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: auto-create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'tenant_user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SEED: Default Subscription Plans
-- ============================================================
INSERT INTO subscription_plans (name, slug, description, price_monthly, price_yearly, features, feature_limits, is_featured, sort_order) VALUES
(
  'Starter', 'starter',
  'Perfect for small businesses getting started with AI automation',
  49.00, 490.00,
  '["AI CRM (500 contacts)", "WhatsApp AI Chatbot", "1,000 campaign messages/mo", "Website AI Chatbot", "Email support"]',
  '{"contacts": 500, "campaigns_per_month": 1000, "chatbot_conversations": 500, "team_members": 3}',
  false, 1
),
(
  'Growth', 'growth',
  'Scale your business with advanced AI tools and integrations',
  149.00, 1490.00,
  '["AI CRM (5,000 contacts)", "WhatsApp AI Chatbot + API", "10,000 campaign messages/mo", "AI Website Builder", "Voice Bot (100 mins/mo)", "Meta Ads Integration", "AI SEO Tools", "Priority support"]',
  '{"contacts": 5000, "campaigns_per_month": 10000, "chatbot_conversations": 5000, "team_members": 10, "voice_minutes": 100}',
  true, 2
),
(
  'Enterprise', 'enterprise',
  'Unlimited AI power for large organizations with custom requirements',
  399.00, 3990.00,
  '["Unlimited contacts", "All features included", "Unlimited campaigns", "Custom AI training", "Dedicated Voice Bot", "White-label option", "Custom integrations", "24/7 priority support", "Dedicated account manager"]',
  '{"contacts": -1, "campaigns_per_month": -1, "chatbot_conversations": -1, "team_members": -1, "voice_minutes": -1}',
  false, 3
);

-- ============================================================
-- SEED: CMS Pages
-- ============================================================
INSERT INTO cms_pages (slug, title, meta_title, meta_description, content) VALUES
('home', 'Home', 'Vorynto AI - Multi-Tenant AI Agent Platform', 'Transform your business with Vorynto AI. CRM, WhatsApp Bot, Bulk Campaigns, AI Website Builder, Voice Bot, Meta Ads and more.', '{"hero": {"title": "Transform Your Business with AI", "subtitle": "The all-in-one AI platform for modern businesses"}}'),
('about', 'About Us', 'About Vorynto AI', 'Learn about the team behind Vorynto AI and our mission to democratize AI for businesses.', '{}'),
('contact', 'Contact Us', 'Contact Vorynto AI', 'Get in touch with the Vorynto AI team. We are here to help you succeed.', '{}');
