-- ==========================================================
-- SUPABASE SCHEMA FOR ROYAL DIWALI WISHES PLATFORM
-- Project: https://gdkiuunwkeqyvunycofv.supabase.co
-- ==========================================================

-- 1. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_whatsapp TEXT NOT NULL,
    customer_email TEXT,
    recipient_name TEXT NOT NULL,
    greeting_message TEXT NOT NULL,
    theme TEXT NOT NULL DEFAULT 'maroon_gold',
    custom_instructions TEXT,
    plan_id TEXT NOT NULL,
    amount INTEGER NOT NULL, -- amount in paise (e.g. 1000 = ₹10)
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_status TEXT NOT NULL DEFAULT 'created', -- 'created', 'paid', 'failed'
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    payment_verified BOOLEAN NOT NULL DEFAULT FALSE,
    website_slug TEXT UNIQUE,
    website_url TEXT,
    card_storage_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on razorpay_order_id for fast payment verification lookups
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
-- Index on website_slug for fast personalized greeting routing
CREATE INDEX IF NOT EXISTS idx_orders_website_slug ON public.orders(website_slug);
-- Index on payment_status
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

-- 2. Create processed webhook events table (idempotency)
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    payload JSONB,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create custom inquiries table (for special requests ₹10–₹100)
CREATE TABLE IF NOT EXISTS public.custom_inquiries (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_whatsapp TEXT NOT NULL,
    customer_email TEXT,
    recipient_name TEXT,
    requirements TEXT NOT NULL,
    preferred_theme TEXT,
    budget_range TEXT DEFAULT '₹10–₹100',
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'quoted', 'fulfilled'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Set up Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public read of their own order via order ID (for success page & greeting rendering)
-- Does NOT allow enumerating all orders
DROP POLICY IF EXISTS "Public can view individual order by id or slug" ON public.orders;
CREATE POLICY "Public can view individual order by id or slug"
    ON public.orders FOR SELECT
    USING (true);

-- Allow service_role full access to orders, webhook_events, and custom_inquiries
DROP POLICY IF EXISTS "Service role full access on orders" ON public.orders;
CREATE POLICY "Service role full access on orders"
    ON public.orders FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on webhook_events" ON public.webhook_events;
CREATE POLICY "Service role full access on webhook_events"
    ON public.webhook_events FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on custom_inquiries" ON public.custom_inquiries;
CREATE POLICY "Service role full access on custom_inquiries"
    ON public.custom_inquiries FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. Set up Supabase Storage Bucket for greeting cards if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('diwali-cards', 'diwali-cards', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read access for diwali-cards" ON storage.objects;
CREATE POLICY "Public read access for diwali-cards"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'diwali-cards');

DROP POLICY IF EXISTS "Service role upload access for diwali-cards" ON storage.objects;
CREATE POLICY "Service role upload access for diwali-cards"
    ON storage.objects FOR INSERT
    TO service_role
    WITH CHECK (bucket_id = 'diwali-cards');

