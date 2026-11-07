export type Language = 'hi' | 'en';

export interface PersonalizationState {
  recipientName: string;
  senderName: string;
  creatorName: string;
}

export interface DiyaItem {
  id: number;
  blessingHi: string;
  blessingEn: string;
  titleHi: string;
  titleEn: string;
}

export interface FestiveCardItem {
  id: number;
  categoryHi: string;
  categoryEn: string;
  hindi: string;
  english: string;
  iconName: string;
  colorGradient: string;
}

export interface GalleryItem {
  id: string;
  titleHi: string;
  titleEn: string;
  category: 'tradition' | 'sweets' | 'decor' | 'palace';
  descriptionHi: string;
  descriptionEn: string;
  imageUrl: string;
  tagHi: string;
  tagEn: string;
}

export type PlanId = 'basic' | 'premium' | 'royal';

export type ThemeId = 'maroon_gold' | 'royal_purple' | 'saffron_cream' | 'emerald_green';

export interface ThemeConfig {
  id: ThemeId;
  nameHi: string;
  nameEn: string;
  previewBg: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  bgGradient: string;
}

export interface PlanConfig {
  id: PlanId;
  nameHi: string;
  nameEn: string;
  taglineHi: string;
  taglineEn: string;
  priceInInr: number;
  amountInPaise: number;
  isPopular?: boolean;
  featuresHi: string[];
  featuresEn: string[];
}

export interface CustomerFormData {
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string;
  recipientName: string;
  selectedPlan: PlanId;
  greetingMessage: string;
  preferredTheme: ThemeId;
  customInstructions: string;
}

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
  payment_status: 'created' | 'paid' | 'failed';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_verified: boolean;
  website_slug?: string;
  website_url?: string;
  card_storage_path?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  planId: PlanId;
  customerName: string;
  customerWhatsapp: string;
  customerEmail?: string;
  recipientName: string;
  greetingMessage?: string;
  preferredTheme?: ThemeId;
  customInstructions?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  error?: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  orderId: string;
  verified: boolean;
  websiteUrl?: string;
  websiteSlug?: string;
  cardDownloadUrl?: string;
  error?: string;
}

export interface CustomInquiryRequest {
  customerName: string;
  customerWhatsapp: string;
  customerEmail?: string;
  recipientName?: string;
  requirements: string;
  preferredTheme?: ThemeId;
  budgetRange?: string;
}

