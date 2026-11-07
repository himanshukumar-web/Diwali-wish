import type { VercelRequest, VercelResponse } from '@vercel/node';
import { saveCustomInquiry } from './_shared/db';

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
    const { customerName, customerWhatsapp, customerEmail, recipientName, requirements, preferredTheme, budgetRange } = req.body || {};

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    if (!customerWhatsapp || !customerWhatsapp.trim()) {
      return res.status(400).json({ success: false, error: 'WhatsApp number is required' });
    }

    if (!requirements || !requirements.trim()) {
      return res.status(400).json({ success: false, error: 'Please specify your customization requirements' });
    }

    const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await saveCustomInquiry({
      id: inquiryId,
      customerName: customerName.trim(),
      customerWhatsapp: customerWhatsapp.trim(),
      customerEmail: customerEmail?.trim(),
      recipientName: recipientName?.trim(),
      requirements: requirements.trim(),
      preferredTheme: preferredTheme || 'maroon_gold',
      budgetRange: budgetRange || '₹10–₹100'
    });

    // Create prefilled WhatsApp message for Himanshu (+91 9417885574)
    const whatsappPhone = '919417885574';
    const msg = `🪔 *Namaste Himanshu! Custom Diwali Wishes Inquiry*\n\n` +
      `*From:* ${customerName.trim()}\n` +
      `*WhatsApp:* ${customerWhatsapp.trim()}\n` +
      (recipientName ? `*Recipient:* ${recipientName.trim()}\n` : '') +
      `*Theme:* ${preferredTheme || 'Maroon & Gold'}\n` +
      `*Budget Range:* ${budgetRange || '₹10–₹100'}\n` +
      `*Special Customization:* ${requirements.trim()}\n\n` +
      `Please provide a manual quotation for my custom Diwali greeting website! ✨`;

    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(msg)}`;

    return res.status(200).json({
      success: true,
      inquiryId,
      whatsappUrl
    });
  } catch (err: any) {
    console.error('Error in /api/custom-inquiry:', err);
    return res.status(500).json({ success: false, error: 'Failed to record custom inquiry' });
  }
}

