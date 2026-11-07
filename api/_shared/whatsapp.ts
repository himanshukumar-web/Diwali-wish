import { loadEnv } from './env';
import { WhatsAppDeliveryStatus } from './types';

export interface WhatsAppDeliveryResult {
  status: WhatsAppDeliveryStatus;
  messageId?: string;
  recipientPhone?: string;
  mode: 'cloud_api' | 'manual_fallback';
  error?: string;
  manualShareUrl?: string;
}

export interface SendWhatsAppOptions {
  customerPhone: string;
  customerName: string;
  recipientName: string;
  greetingMessage?: string;
  websiteUrl: string;
  cardImageUrl?: string;
  lang?: 'hi' | 'en';
}

/**
 * Normalizes an Indian or international phone number for WhatsApp.
 * Strips spaces, dashes, symbols and ensures standard country code.
 */
export function formatWhatsAppPhone(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) return '';

  // If 10 digits (standard Indian mobile), prepend 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  // If starts with 0 and has 11 digits (e.g. 09417885574), strip 0 and prepend 91
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Builds the official royal WhatsApp greeting text for manual or automated fallback.
 */
export function buildWhatsAppMessageText(options: SendWhatsAppOptions): string {
  const isHi = options.lang !== 'en';
  const cName = options.customerName.trim() || 'Himanshu Kumar';
  const rName = options.recipientName.trim() || 'Dear';
  const customMsg = options.greetingMessage?.trim() || 
    (isHi 
      ? 'यह पावन पर्व आपके जीवन में सुख, शांति, समृद्धि और सफलता लेकर आए!'
      : 'May this divine festival of lights illuminate your path with joy, health and prosperity!');

  if (isHi) {
    return `🪔 *॥ शुभ दीपावली ॥* ✨\n\n` +
      `प्रिय *${rName}* और आपके पूरे परिवार को दीपावली की हार्दिक शुभकामनाएँ! ❤️\n\n` +
      `"${customMsg}"\n\n` +
      `✨ *${cName}* की तरफ से आपके लिए तैयार की गई विशेष राजसी दीपावली विशिंग वेबसाइट यहाँ देखें:\n` +
      `👉 ${options.websiteUrl}\n\n` +
      `🎨 *Designed & Developed by Himanshu Kumar*\nWith Love ❤️`;
  }

  return `🪔 *॥ HAPPY DIWALI ॥* ✨\n\n` +
    `Dear *${rName}* & Your Wonderful Family, wishing you a joyous and blessed Diwali! ❤️\n\n` +
    `"${customMsg}"\n\n` +
    `✨ A royal personalized digital Diwali experience crafted especially for you by *${cName}*:\n` +
    `👉 ${options.websiteUrl}\n\n` +
    `🎨 *Designed & Developed by Himanshu Kumar*\nWith Love ❤️`;
}

/**
 * Dispatches a WhatsApp greeting via WhatsApp Business Cloud API (Meta Graph API).
 * If Cloud API credentials are not yet configured in environment variables,
 * it returns a clean 'pending_configuration' status and provides a 1-click manual share fallback.
 */
export async function sendWhatsAppGreeting(options: SendWhatsAppOptions): Promise<WhatsAppDeliveryResult> {
  loadEnv();

  const recipientPhone = formatWhatsAppPhone(options.customerPhone);
  const manualText = buildWhatsAppMessageText(options);
  const manualShareUrl = `https://api.whatsapp.com/send?phone=${recipientPhone}&text=${encodeURIComponent(manualText)}`;

  const apiToken = process.env.WHATSAPP_API_TOKEN || process.env.META_WHATSAPP_TOKEN || '';
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || '';
  const apiVersion = process.env.WHATSAPP_API_VERSION || 'v20.0';

  // If credentials are not set, preserve order fulfillment and provide manual fallback
  if (!apiToken || !phoneNumberId) {
    return {
      status: 'pending_configuration',
      mode: 'manual_fallback',
      recipientPhone,
      manualShareUrl,
      error: 'WhatsApp Business Cloud API credentials (WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID) not configured in server environment.'
    };
  }

  if (!recipientPhone || recipientPhone.length < 10) {
    return {
      status: 'failed',
      mode: 'manual_fallback',
      recipientPhone,
      manualShareUrl,
      error: 'Invalid recipient WhatsApp phone number.'
    };
  }

  const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  // Payload: If approved template name is configured, use template; otherwise use rich text
  const payload = templateName
    ? {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: options.lang === 'en' ? 'en' : 'hi' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: options.recipientName },
                { type: 'text', text: options.customerName },
                { type: 'text', text: options.websiteUrl }
              ]
            }
          ]
        }
      }
    : {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhone,
        type: 'text',
        text: {
          preview_url: true,
          body: manualText
        }
      };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data: any = await res.json();

    if (res.ok && data?.messages?.[0]?.id) {
      return {
        status: 'sent',
        messageId: data.messages[0].id,
        recipientPhone,
        mode: 'cloud_api',
        manualShareUrl
      };
    }

    const errorMsg = data?.error?.message || `WhatsApp API error: ${res.status} ${res.statusText}`;
    console.warn('WhatsApp Business Cloud API error:', errorMsg);

    return {
      status: 'failed',
      recipientPhone,
      mode: 'manual_fallback',
      error: errorMsg,
      manualShareUrl
    };
  } catch (err: any) {
    console.warn('WhatsApp dispatch network exception:', err.message);
    return {
      status: 'failed',
      recipientPhone,
      mode: 'manual_fallback',
      error: err.message || 'Network exception while connecting to WhatsApp Cloud API',
      manualShareUrl
    };
  }
}

