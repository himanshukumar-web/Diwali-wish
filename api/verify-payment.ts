import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyPaymentSignature } from './_shared/razorpay';
import { getOrderById, getOrderByRazorpayOrderId, saveOrder } from './_shared/db';
import { generateWebsiteSlug, generateWebsiteUrl, generateCardSvg, uploadCardToStorage } from './_shared/generator';

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
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required Razorpay payment verification parameters'
      });
    }

    // 1. Locate the order by internal ID or Razorpay Order ID
    let order = orderId ? await getOrderById(orderId) : null;
    if (!order) {
      order = await getOrderByRazorpayOrderId(razorpay_order_id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order reference not found on server'
      });
    }

    // 2. Validate that the Razorpay Order ID matches what was created on the server
    if (order.razorpay_order_id && order.razorpay_order_id !== razorpay_order_id) {
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
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
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
    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;

    // 6. Generate unique personalized website slug & URL
    const slug = order.website_slug || generateWebsiteSlug(order);
    const hostHeader = req.headers['x-forwarded-host'] || req.headers['host'];
    const protoHeader = req.headers['x-forwarded-proto'] || 'https';
    const origin = hostHeader ? `${protoHeader}://${hostHeader}` : undefined;
    const websiteUrl = generateWebsiteUrl(slug, order.id, origin);

    order.website_slug = slug;
    order.website_url = websiteUrl;

    // 7. Generate downloadable festive card SVG / PNG
    try {
      const cardSvg = generateCardSvg(order);
      const storageUrl = await uploadCardToStorage(order.id, cardSvg);
      if (storageUrl) {
        order.card_storage_path = storageUrl;
      }
    } catch (cardErr) {
      console.warn('Card upload warning:', cardErr);
      // Non-fatal: website is fulfilled; card can also be rendered/downloaded in browser
    }

    order.updated_at = new Date().toISOString();
    await saveOrder(order);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      verified: true,
      websiteUrl: order.website_url,
      websiteSlug: order.website_slug,
      cardDownloadUrl: order.card_storage_path || undefined
    });
  } catch (err: any) {
    console.error('Error in /api/verify-payment:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Payment verification failed'
    });
  }
}

