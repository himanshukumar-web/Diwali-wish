import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllOrders, getAllInquiries } from './_shared/db';
import { getAdminSecret } from './_shared/env';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Admin authorization check
  const adminKey = (req.headers['x-admin-key'] as string) || (req.query.key as string);
  const expectedSecret = getAdminSecret();

  if (!adminKey || adminKey !== expectedSecret) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid Admin Secret' });
  }

  try {
    const orders = await getAllOrders();
    const inquiries = await getAllInquiries();

    // Calculate revenue from verified paid orders
    const verifiedOrders = orders.filter((o) => o.payment_verified && o.payment_status === 'paid');
    const totalRevenueInr = verifiedOrders.reduce((sum, o) => sum + (o.amount || 0), 0) / 100;

    const stats = {
      totalOrders: orders.length,
      paidOrdersCount: verifiedOrders.length,
      pendingOrdersCount: orders.filter((o) => o.payment_status === 'created').length,
      failedOrdersCount: orders.filter((o) => o.payment_status === 'failed').length,
      totalRevenueInr,
      planBreakdown: {
        basic: verifiedOrders.filter((o) => o.plan_id === 'basic').length,
        premium: verifiedOrders.filter((o) => o.plan_id === 'premium').length,
        royal: verifiedOrders.filter((o) => o.plan_id === 'royal').length
      },
      totalInquiries: inquiries.length
    };

    // Sanitize order objects (strip raw payment signatures/secrets)
    const sanitizedOrders = orders.map((o) => ({
      id: o.id,
      customerName: o.customer_name,
      customerWhatsapp: o.customer_whatsapp,
      customerEmail: o.customer_email,
      recipientName: o.recipient_name,
      planId: o.plan_id,
      amountInInr: (o.amount || 0) / 100,
      paymentStatus: o.payment_status,
      paymentVerified: o.payment_verified,
      razorpayOrderId: o.razorpay_order_id,
      razorpayPaymentId: o.razorpay_payment_id,
      theme: o.theme,
      websiteSlug: o.website_slug,
      websiteUrl: o.website_url,
      cardStoragePath: o.card_storage_path,
      createdAt: o.created_at,
      updatedAt: o.updated_at
    }));

    return res.status(200).json({
      success: true,
      stats,
      orders: sanitizedOrders,
      inquiries
    });
  } catch (err: any) {
    console.error('Admin API error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve admin data' });
  }
}

