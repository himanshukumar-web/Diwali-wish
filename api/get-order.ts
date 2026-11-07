import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOrderById, getOrderBySlug } from './_shared/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { orderId, slug } = req.query as { orderId?: string; slug?: string };

    if (!orderId && !slug) {
      return res.status(400).json({ success: false, error: 'Either orderId or slug is required' });
    }

    const order = orderId ? await getOrderById(orderId) : await getOrderBySlug(slug!);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Return safe public fields only (do NOT leak signatures, internal tokens, or other users' private details)
    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        customerName: order.customer_name,
        recipientName: order.recipient_name,
        greetingMessage: order.greeting_message,
        theme: order.theme,
        planId: order.plan_id,
        amount: order.amount,
        currency: order.currency,
        paymentStatus: order.payment_status,
        paymentVerified: order.payment_verified,
        websiteSlug: order.website_slug,
        websiteUrl: order.website_url,
        cardDownloadUrl: order.card_storage_path,
        whatsappDeliveryStatus: order.whatsapp_delivery_status || 'pending_configuration',
        whatsappMessageId: order.whatsapp_message_id || null,
        createdAt: order.created_at
      }
    });
  } catch (err: any) {
    console.error('Error in /api/get-order:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve order' });
  }
}

