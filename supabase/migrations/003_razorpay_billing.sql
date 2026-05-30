-- ─────────────────────────────────────────────────────────────────────────────
-- 003_razorpay_billing.sql
-- Adds Razorpay support for platform subscription billing.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add Razorpay plan ID columns to subscription_plans
ALTER TABLE subscription_plans
  ADD COLUMN IF NOT EXISTS razorpay_plan_id_monthly  TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_plan_id_yearly   TEXT;

-- 2. Add Razorpay subscription/customer IDs to subscriptions
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS razorpay_subscription_id  TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_customer_id      TEXT,
  ADD COLUMN IF NOT EXISTS billing_cycle             TEXT  -- 'monthly' | 'yearly'
    CONSTRAINT subscriptions_billing_cycle_check CHECK (billing_cycle IN ('monthly','yearly'));

-- 3. Platform-level settings table (admin-only, stores Razorpay keys, SMTP, etc.)
CREATE TABLE IF NOT EXISTS platform_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  description TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_by  UUID REFERENCES auth.users(id)
);

-- 4. Payment orders — tracks every Razorpay order / subscription payment
CREATE TABLE IF NOT EXISTS payment_orders (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id              UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  subscription_id        UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  plan_id                UUID REFERENCES subscription_plans(id) ON DELETE SET NULL,

  -- Razorpay identifiers
  razorpay_order_id      TEXT UNIQUE,
  razorpay_payment_id    TEXT,
  razorpay_subscription_id TEXT,
  razorpay_signature     TEXT,

  -- Amount stored in smallest currency unit (paise for INR)
  amount                 INTEGER NOT NULL,
  currency               TEXT    NOT NULL DEFAULT 'INR',
  billing_cycle          TEXT    NOT NULL DEFAULT 'monthly'
                           CONSTRAINT payment_orders_billing_cycle_check
                           CHECK (billing_cycle IN ('monthly','yearly')),

  status                 TEXT    NOT NULL DEFAULT 'created'
                           CONSTRAINT payment_orders_status_check
                           CHECK (status IN ('created','paid','failed','refunded','cancelled')),

  notes                  JSONB   DEFAULT '{}',
  error_description      TEXT,
  captured_at            TIMESTAMPTZ,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_orders_tenant      ON payment_orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status      ON payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_orders_razorpay_id ON payment_orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_created     ON payment_orders(created_at DESC);

-- Updated_at trigger for payment_orders
CREATE TRIGGER payment_orders_updated_at
  BEFORE UPDATE ON payment_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Updated_at trigger for platform_settings
CREATE TRIGGER platform_settings_updated_at
  BEFORE UPDATE ON platform_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. RLS Policies

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "super_admin_all_platform_settings" ON platform_settings;
CREATE POLICY "super_admin_all_platform_settings" ON platform_settings
  FOR ALL USING (is_super_admin());

ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "super_admin_all_payment_orders"   ON payment_orders;
DROP POLICY IF EXISTS "tenant_own_payment_orders"        ON payment_orders;
CREATE POLICY "super_admin_all_payment_orders" ON payment_orders
  FOR ALL USING (is_super_admin());
CREATE POLICY "tenant_own_payment_orders" ON payment_orders
  FOR SELECT USING (tenant_id = get_user_tenant_id());

-- 6. Seed default platform_settings keys (empty — admin fills via UI)
INSERT INTO platform_settings (key, value, description) VALUES
  ('razorpay_key_id',     '', 'Razorpay Key ID (rzp_live_... or rzp_test_...)'),
  ('razorpay_key_secret', '', 'Razorpay Key Secret — keep private'),
  ('razorpay_webhook_secret', '', 'Razorpay Webhook Secret for signature verification')
ON CONFLICT (key) DO NOTHING;
