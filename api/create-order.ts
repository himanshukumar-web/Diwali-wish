import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SERVER_PLANS } from './_shared/plans';
import { PlanId, ThemeId, OrderRecord } from './_shared/types';
import { getRazorpayKeys } from './_shared/env';
import { createRazorpayOrder } from './_shared/razorpay';
import { saveOrder } from './_shared/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
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
    const {
      planId,
      customerName,
      customerWhatsapp,
      customerEmail,
      recipientName,
      greetingMessage,
      preferredTheme,
      theme,
      customInstructions
    } = req.body || {};

    const activeTheme = preferredTheme || theme || 'maroon_gold';

    // 1. Validate required fields
    if (!planId || !SERVER_PLANS[planId as PlanId]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan selected. Must be one of: basic, premium, royal'
      });
    }

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, error: 'Customer / Sender name is required' });
    }

    if (!recipientName || !recipientName.trim()) {
      return res.status(400).json({ success: false, error: 'Recipient name is required' });
    }

    if (!customerWhatsapp || !customerWhatsapp.trim()) {
      return res.status(400).json({ success: false, error: 'WhatsApp number is required' });
    }

    const cleanPhone = customerWhatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid 10-digit WhatsApp number'
      });
    }

    // 2. Server-side calculated pricing — NEVER trust browser amount
    const selectedPlan = SERVER_PLANS[planId as PlanId];
    const amountInPaise = selectedPlan.amountInPaise;
    const { keyId } = getRazorpayKeys();

    if (!keyId) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: Razorpay Key ID not configured. Please ensure RAZORPAY_KEY_ID is set in environment variables.'
      });
    }

    // 3. Generate unique order ID
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // 4. Create order via Razorpay API
    const rzpOrder = await createRazorpayOrder({
      amountInPaise,
      currency: 'INR',
      receipt: orderId.slice(0, 40),
      notes: {
        orderId,
        planId,
        customerName: customerName.trim(),
        recipientName: recipientName.trim(),
        customerWhatsapp: cleanPhone,
        theme: activeTheme
      }
    });

    // 5. Save pending order record in Supabase / store
    const newOrder: OrderRecord = {
      id: orderId,
      customer_name: customerName.trim(),
      customer_whatsapp: cleanPhone,
      customer_email: customerEmail?.trim() || '',
      recipient_name: recipientName.trim(),
      greeting_message: greetingMessage?.trim() || 'Wishing you and your wonderful family a very Happy and Prosperous Diwali!',
      theme: (activeTheme as ThemeId) || 'maroon_gold',
      custom_instructions: customInstructions?.trim() || '',
      plan_id: planId as PlanId,
      amount: amountInPaise,
      currency: 'INR',
      payment_status: 'created',
      razorpay_order_id: rzpOrder.id,
      payment_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await saveOrder(newOrder);

    // 6. Return Razorpay order details to frontend (providing both orderId and internalOrderId for full compatibility)
    return res.status(200).json({
      success: true,
      orderId,
      internalOrderId: orderId,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId
    });
  } catch (err: any) {
    console.error('Error in /api/create-order:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to create order on server'
    });
  }
}
