import fs from 'fs';
import path from 'path';

let loaded = false;

export function loadEnv() {
  if (loaded) return;
  loaded = true;

  // Try loading from .env.local if not already in process.env
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch {
    // Ignore error in serverless environment where .env.local might not exist on disk
  }
}

export function getRazorpayKeys() {
  loadEnv();
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  // Strictly verify test mode
  if (keyId.startsWith('rzp_live_')) {
    throw new Error('SECURITY VIOLATION: Razorpay Live keys are strictly rejected. Only Razorpay Test keys (rzp_test_...) are allowed.');
  }

  return { keyId, keySecret };
}

export function getSupabaseConfig() {
  loadEnv();
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://gdkiuunwkeqyvunycofv.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  return { url, serviceRoleKey, anonKey };
}

export function getWebhookSecret() {
  loadEnv();
  return process.env.RAZORPAY_WEBHOOK_SECRET || '';
}

export function getAdminSecret() {
  loadEnv();
  return process.env.ADMIN_SECRET || 'diwali_admin_2026';
}

