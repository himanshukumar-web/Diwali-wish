export type PlanId = 'basic' | 'premium' | 'royal';
export type ThemeId = 'maroon_gold' | 'royal_purple' | 'saffron_cream' | 'emerald_green';
export type WhatsAppDeliveryStatus = 'sent' | 'pending_configuration' | 'failed' | 'not_requested';

export interface OrderRecord {
  id: string;
  customer_name: string;
  customer_whatsapp: string;
  customer_email?: string;
  recipient_name: string;
  greeting_message: string;
  theme: ThemeId;
  custom_instructions?: string;
  plan_id: PlanId;
  amount: number; // in paise
  currency: string;
  payment_status: 'created' | 'paid' | 'failed' | 'refunded';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_verified: boolean;
  website_slug?: string;
  website_url?: string;
  card_storage_path?: string;
  whatsapp_delivery_status?: WhatsAppDeliveryStatus;
  whatsapp_message_id?: string;
  whatsapp_error?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomInquiryRequest {
  id: string;
  customer_name?: string;
  customerName?: string;
  customer_whatsapp?: string;
  customerWhatsapp?: string;
  customer_email?: string;
  customerEmail?: string;
  recipient_name?: string;
  recipientName?: string;
  requirements?: string;
  customization_details?: string;
  preferred_theme?: string;
  preferredTheme?: string;
  budget_range?: string;
  budgetRange?: string;
  status?: string;
  created_at?: string;
}
