import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './env';
import { OrderRecord, CustomInquiryRequest } from './types';
import fs from 'fs';
import path from 'path';

let supabaseClient: SupabaseClient | null = null;

// Local fallback store for offline/local development or before Supabase service role key is set
const memoryOrders = new Map<string, OrderRecord>();
const memoryWebhookEvents = new Set<string>();
const memoryInquiries: any[] = [];

// Persistence file for local fallback testing (uses /tmp on Vercel lambda)
const isLambda = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const FALLBACK_DIR = isLambda ? path.join('/tmp', '.data') : path.resolve(process.cwd(), '.data');
const FALLBACK_FILE = path.join(FALLBACK_DIR, 'local_orders.json');

function loadFallbackStore() {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const data = JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
      if (Array.isArray(data.orders)) {
        data.orders.forEach((o: OrderRecord) => memoryOrders.set(o.id, o));
      }
      if (Array.isArray(data.webhookEvents)) {
        data.webhookEvents.forEach((id: string) => memoryWebhookEvents.add(id));
      }
      if (Array.isArray(data.inquiries)) {
        memoryInquiries.push(...data.inquiries);
      }
    }
  } catch {
    // Ignore error
  }
}

function saveFallbackStore() {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) {
      fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    }
    const data = {
      orders: Array.from(memoryOrders.values()),
      webhookEvents: Array.from(memoryWebhookEvents.values()),
      inquiries: memoryInquiries
    };
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch {
    // Ignore error
  }
}

loadFallbackStore();

export function getDbClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  const { url, serviceRoleKey, anonKey } = getSupabaseConfig();
  const keyToUse = serviceRoleKey || anonKey;

  if (url && keyToUse) {
    try {
      supabaseClient = createClient(url, keyToUse, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
      return supabaseClient;
    } catch (err) {
      console.warn('Could not initialize Supabase client, using fallback store:', err);
    }
  }
  return null;
}

export async function saveOrder(order: OrderRecord): Promise<OrderRecord> {
  const db = getDbClient();

  // Always keep in local fallback store
  memoryOrders.set(order.id, order);
  saveFallbackStore();

  if (db) {
    try {
      const { data, error } = await db.from('orders').upsert({
        id: order.id,
        customer_name: order.customer_name,
        customer_whatsapp: order.customer_whatsapp,
        customer_email: order.customer_email || null,
        recipient_name: order.recipient_name,
        greeting_message: order.greeting_message,
        theme: order.theme,
        custom_instructions: order.custom_instructions || null,
        plan_id: order.plan_id,
        amount: order.amount,
        currency: order.currency,
        payment_status: order.payment_status,
        razorpay_order_id: order.razorpay_order_id || null,
        razorpay_payment_id: order.razorpay_payment_id || null,
        razorpay_signature: order.razorpay_signature || null,
        payment_verified: order.payment_verified,
        website_slug: order.website_slug || null,
        website_url: order.website_url || null,
        card_storage_path: order.card_storage_path || null,
        whatsapp_delivery_status: order.whatsapp_delivery_status || 'not_requested',
        whatsapp_message_id: order.whatsapp_message_id || null,
        whatsapp_error: order.whatsapp_error || null,
        updated_at: new Date().toISOString()
      }).select().single();

      if (error) {
        console.warn('Supabase saveOrder error (using fallback):', error.message);
      } else if (data) {
        return data as OrderRecord;
      }
    } catch (err: any) {
      console.warn('Supabase connection error:', err?.message);
    }
  }

  return order;
}

export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  const db = getDbClient();

  if (db) {
    try {
      const { data, error } = await db
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (!error && data) {
        return data as OrderRecord;
      }
    } catch {
      // Fallback
    }
  }

  return memoryOrders.get(orderId) || null;
}

export async function getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<OrderRecord | null> {
  const db = getDbClient();

  if (db) {
    try {
      const { data, error } = await db
        .from('orders')
        .select('*')
        .eq('razorpay_order_id', razorpayOrderId)
        .maybeSingle();

      if (!error && data) {
        return data as OrderRecord;
      }
    } catch {
      // Fallback
    }
  }

  for (const order of memoryOrders.values()) {
    if (order.razorpay_order_id === razorpayOrderId) {
      return order;
    }
  }

  return null;
}

export async function getOrderBySlug(slug: string): Promise<OrderRecord | null> {
  const db = getDbClient();

  if (db) {
    try {
      const { data, error } = await db
        .from('orders')
        .select('*')
        .eq('website_slug', slug)
        .maybeSingle();

      if (!error && data) {
        return data as OrderRecord;
      }
    } catch {
      // Fallback
    }
  }

  for (const order of memoryOrders.values()) {
    if (order.website_slug === slug) {
      return order;
    }
  }

  return null;
}

export async function getAllOrders(): Promise<OrderRecord[]> {
  const db = getDbClient();

  if (db) {
    try {
      const { data, error } = await db
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as OrderRecord[];
      }
    } catch {
      // Fallback
    }
  }

  return Array.from(memoryOrders.values()).sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
}

export async function isWebhookEventProcessed(eventId: string): Promise<boolean> {
  if (memoryWebhookEvents.has(eventId)) return true;
  const db = getDbClient();

  if (db) {
    try {
      const { data } = await db
        .from('webhook_events')
        .select('id')
        .eq('id', eventId)
        .maybeSingle();

      if (data) return true;
    } catch {
      // Fallback
    }
  }

  return false;
}

export async function markWebhookEventProcessed(eventId: string, eventType: string, payload?: any): Promise<void> {
  memoryWebhookEvents.add(eventId);
  saveFallbackStore();

  const db = getDbClient();
  if (db) {
    try {
      await db.from('webhook_events').insert({
        id: eventId,
        event_type: eventType,
        payload: payload || null
      });
    } catch {
      // Ignore
    }
  }
}

export async function saveCustomInquiry(inquiry: CustomInquiryRequest & { id: string }): Promise<void> {
  memoryInquiries.push({ ...inquiry, created_at: new Date().toISOString() });
  saveFallbackStore();

  const db = getDbClient();
  if (db) {
    try {
      await db.from('custom_inquiries').insert({
        id: inquiry.id,
        customer_name: inquiry.customerName,
        customer_whatsapp: inquiry.customerWhatsapp,
        customer_email: inquiry.customerEmail || null,
        recipient_name: inquiry.recipientName || null,
        requirements: inquiry.requirements,
        preferred_theme: inquiry.preferredTheme || 'maroon_gold',
        budget_range: inquiry.budgetRange || '₹10–₹100'
      });
    } catch {
      // Ignore
    }
  }
}

export async function getAllInquiries(): Promise<any[]> {
  const db = getDbClient();

  if (db) {
    try {
      const { data, error } = await db
        .from('custom_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  return memoryInquiries;
}

