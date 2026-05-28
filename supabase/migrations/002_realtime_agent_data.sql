-- ============================================================
-- Vorynto AI — Realtime Agent Data Tables
-- ============================================================

-- ============================================================
-- VOICE CALLS LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS voice_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  voice_bot_id UUID REFERENCES voice_bot_configs(id) ON DELETE SET NULL,
  caller_number VARCHAR(50) NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  outcome VARCHAR(100),
  sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'neutral', 'negative')) DEFAULT 'neutral',
  recording_url TEXT,
  transcript TEXT,
  called_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CHATBOT SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS chatbot_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  chatbot_id UUID REFERENCES chatbot_configs(id) ON DELETE SET NULL,
  visitor_id VARCHAR(255),
  page_url TEXT,
  is_resolved BOOLEAN DEFAULT false,
  lead_captured BOOLEAN DEFAULT false,
  message_count INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- ============================================================
-- META ADS CAMPAIGNS
-- ============================================================
CREATE TABLE IF NOT EXISTS meta_ad_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  meta_config_id UUID REFERENCES meta_ads_configs(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(20) CHECK (platform IN ('facebook', 'instagram', 'both')) DEFAULT 'facebook',
  budget DECIMAL(10,2) DEFAULT 0,
  spent DECIMAL(10,2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  roas DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(20) CHECK (status IN ('active', 'paused', 'completed', 'draft')) DEFAULT 'draft',
  external_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SEO KEYWORDS
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES seo_projects(id) ON DELETE CASCADE,
  keyword VARCHAR(500) NOT NULL,
  current_position INTEGER,
  previous_position INTEGER,
  change_7d INTEGER DEFAULT 0,
  monthly_volume INTEGER DEFAULT 0,
  difficulty INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, keyword)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_voice_calls_tenant ON voice_calls(tenant_id);
CREATE INDEX IF NOT EXISTS idx_voice_calls_called_at ON voice_calls(called_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_sessions_tenant ON chatbot_sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_meta_ad_campaigns_tenant ON meta_ad_campaigns(tenant_id);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_project ON seo_keywords(project_id);

-- ============================================================
-- ENABLE REALTIME ON ALL AGENT TABLES
-- ============================================================
ALTER TABLE whatsapp_conversations REPLICA IDENTITY FULL;
ALTER TABLE whatsapp_messages REPLICA IDENTITY FULL;
ALTER TABLE campaigns REPLICA IDENTITY FULL;
ALTER TABLE crm_contacts REPLICA IDENTITY FULL;
ALTER TABLE crm_deals REPLICA IDENTITY FULL;
ALTER TABLE voice_calls REPLICA IDENTITY FULL;
ALTER TABLE chatbot_sessions REPLICA IDENTITY FULL;
ALTER TABLE meta_ad_campaigns REPLICA IDENTITY FULL;
ALTER TABLE seo_projects REPLICA IDENTITY FULL;
ALTER TABLE seo_keywords REPLICA IDENTITY FULL;
ALTER TABLE website_builder_projects REPLICA IDENTITY FULL;

-- Add to realtime publication
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_conversations;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_messages;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE campaigns;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE crm_contacts;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE crm_deals;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE voice_calls;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE chatbot_sessions;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE meta_ad_campaigns;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE seo_projects;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE seo_keywords;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE website_builder_projects;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE voice_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;

-- RLS: tenant members can access their own rows
DO $$ BEGIN
CREATE POLICY "tenant_voice_calls" ON voice_calls FOR ALL TO authenticated
  USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
CREATE POLICY "tenant_chatbot_sessions" ON chatbot_sessions FOR ALL TO authenticated
  USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
CREATE POLICY "tenant_meta_ad_campaigns" ON meta_ad_campaigns FOR ALL TO authenticated
  USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
CREATE POLICY "tenant_seo_keywords" ON seo_keywords FOR ALL TO authenticated
  USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
