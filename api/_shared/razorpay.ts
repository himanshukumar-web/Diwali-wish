import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getRazorpayKeys } from './env';

let razorpayInstance: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  const { keyId, keySecret } = getRazorpayKeys();
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment.');
  }

  // Reject live keys in test mode
  if (keyId.startsWith('rzp_live_')) {
    throw new Error('SECURITY VIOLATION: Razorpay Live keys are strictly prohibited in this test implementation.');
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }

  return razorpayInstance;
}

export async function createRazorpayOrder(params: {
  amountInPaise: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string }> {
  const client = getRazorpayClient();
  const order = await client.orders.create({
    amount: params.amountInPaise,
    currency: params.currency || 'INR',
    receipt: params.receipt,
    notes: params.notes || {}
  });

  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency
  };
}

export function verifyPaymentSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const { keySecret } = getRazorpayKeys();
  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET is not configured on the server.');
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = params;
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  // Timing safe comparison to prevent timing attacks
  try {
    const a = Buffer.from(generatedSignature, 'utf-8');
    const b = Buffer.from(razorpaySignature, 'utf-8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyWebhookSignature(params: {
  rawBody: string;
  signature: string;
  webhookSecret: string;
}): boolean {
  const { rawBody, signature, webhookSecret } = params;
  if (!rawBody || !signature || !webhookSecret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  try {
    const a = Buffer.from(expectedSignature, 'utf-8');
    const b = Buffer.from(signature, 'utf-8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

