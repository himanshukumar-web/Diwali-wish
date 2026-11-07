import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyPaymentSignature } from './_shared/razorpay';
import { getOrderById, getOrderByRazorpayOrderId, saveOrder } from './_shared/db';
import { generateWebsiteSlug, generateWebsiteUrl, generateCardSvg, uploadCardToStorage } from './_shared/generator';
import { sendWhatsAppGreeting } from './_shared/whatsapp';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const rzpOrderId = req.body?.razorpay_order_id || req.body?.razorpayOrderId;
    const rzpPaymentId = req.body?.razorpay_payment_id || req.body?.razorpayPaymentId;
    const rzpSignature = req.body?.razorpay_signature || req.body?.razorpaySignature;
    const targetOrderId = req.body?.orderId || req.body?.internalOrderId;

    if (!rzpOrderId || !rzpPaymentId || !rzpSignature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required Razorpay payment verification parameters'
      });
    }

    // 1. Locate the order by internal ID or Razorpay Order ID
    let order = targetOrderId ? await getOrderById(targetOrderId) : null;
    if (!order) {
      order = await getOrderByRazorpayOrderId(rzpOrderId);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order reference not found on server'
      });
    }

    // 2. Validate that the Razorpay Order ID matches what was created on the server
    if (order.razorpay_order_id && order.razorpay_order_id !== rzpOrderId) {
      return res.status(400).json({
        success: false,
        error: 'Mismatched order ID: Razorpay order ID does not match server order'
      });
    }

    // 3. IDEMPOTENCY: If order was already verified and fulfilled, return existing data
    if (order.payment_verified && order.payment_status === 'paid' && order.website_url) {
      return res.status(200).json({
        success: true,
        orderId: order.id,
        verified: true,
        websiteUrl: order.website_url,
        websiteSlug: order.website_slug,
        cardDownloadUrl: order.card_storage_path || undefined
      });
    }

    // 4. MANDATORY SERVER-SIDE HMAC SHA256 SIGNATURE VERIFICATION
    const isValid = verifyPaymentSignature({
      razorpayOrderId: rzpOrderId,
      razorpayPaymentId: rzpPaymentId,
      razorpaySignature: rzpSignature
    });

    if (!isValid) {
      // Mark as failed in store
      order.payment_status = 'failed';
      order.updated_at = new Date().toISOString();
      await saveOrder(order);

      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Invalid payment signature. Verification failed.'
      });
    }

    // 5. Signature is valid! Fulfill the order
    order.payment_status = 'paid';
    order.payment_verified = true;
    order.razorpay_payment_id = rzpPaymentId;
    order.razorpay_signature = rzpSignature;

    // 6. Generate unique personalized website slug & URL
    const slug = order.website_slug || generateWebsiteSlug(order);
    const hostHeader = req.headers['x-forwarded-host'] || req.headers['host'];
    const protoHeader = req.headers['x-forwarded-proto'] || 'https';
    const origin = hostHeader ? `${protoHeader}://${hostHeader}` : undefined;
    const websiteUrl = generateWebsiteUrl(slug, order.id, origin);

    order.website_slug = slug;
    order.website_url = websiteUrl;

    // 7. Generate downloadable festive card SVG / PNG (strictly clean, unwatermarked for paid orders)
    try {
      const cardSvg = generateCardSvg({
        ...order,
        isWatermarked: false
      });
      const storageUrl = await uploadCardToStorage(order.id, cardSvg);
      if (storageUrl) {
        order.card_storage_path = storageUrl;
      }
    } catch (cardErr) {
      console.warn('Card upload warning:', cardErr);
      // Non-fatal: website is fulfilled; card can also be rendered/downloaded in browser
    }

    // 8. Automated WhatsApp Business Cloud API Delivery (with graceful fallback)
    try {
      const whatsappResult = await sendWhatsAppGreeting({
        customerPhone: order.customer_whatsapp,
        customerName: order.customer_name,
        recipientName: order.recipient_name,
        greetingMessage: order.greeting_message,
        websiteUrl: order.website_url,
        cardImageUrl: order.card_storage_path,
        lang: 'hi'
      });

      order.whatsapp_delivery_status = whatsappResult.status;
      if (whatsappResult.messageId) {
        order.whatsapp_message_id = whatsappResult.messageId;
      }
      if (whatsappResult.error && whatsappResult.status === 'failed') {
        order.whatsapp_error = whatsappResult.error;
      }
    } catch (waErr: any) {
      console.warn('WhatsApp dispatch warning:', waErr.message);
      order.whatsapp_delivery_status = 'pending_configuration';
    }

    order.updated_at = new Date().toISOString();
    await saveOrder(order);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      verified: true,
      websiteUrl: order.website_url,
      websiteSlug: order.website_slug,
      cardDownloadUrl: order.card_storage_path || undefined,
      whatsappDelivery: {
        status: order.whatsapp_delivery_status,
        messageId: order.whatsapp_message_id || null,
        error: order.whatsapp_error || null
      }
    });
  } catch (err: any) {
    console.error('Error in /api/verify-payment:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Payment verification failed'
    });
  }
}

