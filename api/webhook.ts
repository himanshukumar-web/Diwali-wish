import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getWebhookSecret, verifyWebhookSignature } from './_shared/razorpay';
import {
  getOrderByRazorpayOrderId,
  saveOrder,
  isWebhookEventProcessed,
  markWebhookEventProcessed
} from './_shared/db';
import { generateWebsiteSlug, generateWebsiteUrl, generateCardSvg, uploadCardToStorage } from './_shared/generator';

// Disable default body parser so raw body can be accessed if needed
export const config = {
  api: {
    bodyParser: true
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const webhookSecret = getWebhookSecret();
  const signature = req.headers['x-razorpay-signature'] as string;

  // 1. Verify webhook secret configuration
  if (!webhookSecret) {
    console.warn(
      '⚠️ RAZORPAY_WEBHOOK_SECRET is not configured. Webhooks cannot be validated. Configure RAZORPAY_WEBHOOK_SECRET in environment variables.'
    );
    return res.status(503).json({
      error: 'Webhook secret is not configured on this server.'
    });
  }

  if (!signature) {
    return res.status(400).json({ error: 'Missing X-Razorpay-Signature header' });
  }

  // 2. Validate webhook signature
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  const isValid = verifyWebhookSignature({
    rawBody,
    signature,
    webhookSecret
  });

  if (!isValid) {
    console.error('Invalid Razorpay webhook signature');
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const eventId = event?.id || event?.event_id;
  const eventType = event?.event;

  // 3. Idempotency Check: Prevent duplicate event processing
  if (eventId && (await isWebhookEventProcessed(eventId))) {
    return res.status(200).json({ message: 'Event already processed' });
  }

  try {
    // 4. Handle relevant events
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event?.payload?.payment?.entity;
      const orderEntity = event?.payload?.order?.entity;
      const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        const order = await getOrderByRazorpayOrderId(razorpayOrderId);
        if (order) {
          if (!order.payment_verified || order.payment_status !== 'paid') {
            order.payment_status = 'paid';
            order.payment_verified = true;
            if (paymentId) order.razorpay_payment_id = paymentId;

            // Generate personalized website & card
            const slug = order.website_slug || generateWebsiteSlug(order);
            const hostHeader = req.headers['x-forwarded-host'] || req.headers['host'];
            const protoHeader = req.headers['x-forwarded-proto'] || 'https';
            const origin = hostHeader ? `${protoHeader}://${hostHeader}` : undefined;
            const websiteUrl = generateWebsiteUrl(slug, order.id, origin);

            order.website_slug = slug;
            order.website_url = websiteUrl;

            try {
              const cardSvg = generateCardSvg(order);
              const cardUrl = await uploadCardToStorage(order.id, cardSvg);
              if (cardUrl) order.card_storage_path = cardUrl;
            } catch {
              // Non-fatal
            }

            order.updated_at = new Date().toISOString();
            await saveOrder(order);
          }
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event?.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;

      if (razorpayOrderId) {
        const order = await getOrderByRazorpayOrderId(razorpayOrderId);
        if (order && !order.payment_verified) {
          order.payment_status = 'failed';
          order.updated_at = new Date().toISOString();
          await saveOrder(order);
        }
      }
    }

    // 5. Mark event as processed
    if (eventId) {
      await markWebhookEventProcessed(eventId, eventType, event);
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

