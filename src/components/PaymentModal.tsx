import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ShieldCheck, AlertCircle, Loader2, User, Phone, Mail, Heart, MessageSquare, Palette, FileText } from 'lucide-react';
import { Language, PlanId, ThemeId, CustomerFormData } from '../types';
import { PLANS, THEMES, getPlanById } from '../data/plansData';
import { CornerOrnament, OrnateDivider, DiyaGraphic } from './DecorativeBorders';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanId: PlanId;
  lang: Language;
  onPaymentSuccess: (orderId: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPlanId,
  lang,
  onPaymentSuccess
}) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    customerName: '',
    customerWhatsapp: '',
    customerEmail: '',
    recipientName: '',
    selectedPlan: selectedPlanId,
    greetingMessage: '',
    preferredTheme: 'maroon_gold',
    customInstructions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      selectedPlan: selectedPlanId
    }));
  }, [selectedPlanId]);

  if (!isOpen) return null;

  const currentPlan = getPlanById(formData.selectedPlan);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = lang === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your name (sender)';
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = lang === 'hi' ? 'कृपया प्राप्तकर्ता का नाम दर्ज करें' : 'Please enter recipient name';
    }

    const cleanPhone = formData.customerWhatsapp.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.customerWhatsapp = lang === 'hi' ? 'कृपया 10 अंकों का वैध व्हाट्सएप नंबर दर्ज करें' : 'Please enter a valid 10-digit WhatsApp number';
    }

    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = lang === 'hi' ? 'कृपया वैध ईमेल पता दर्ज करें' : 'Please enter a valid email address';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setPaymentError(
        lang === 'hi'
          ? 'कृपया आगे बढ़ने से पहले सभी आवश्यक फ़ील्ड (प्रेषक का नाम, प्राप्तकर्ता का नाम, व्हाट्सएप नंबर) भरें।'
          : 'Please complete all required fields (Sender Name, Recipient Name, WhatsApp Number) before proceeding.'
      );
      return false;
    }

    return true;
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // 1. Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay Checkout SDK. Please check your internet connection.');
      }

      // 2. Create order on server (server calculates amount)
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: formData.selectedPlan,
          customerName: formData.customerName.trim(),
          customerWhatsapp: formData.customerWhatsapp.trim(),
          customerEmail: formData.customerEmail.trim(),
          recipientName: formData.recipientName.trim(),
          greetingMessage: formData.greetingMessage.trim(),
          preferredTheme: formData.preferredTheme,
          customInstructions: formData.customInstructions.trim()
        })
      });

      let orderData: any;
      try {
        orderData = await response.json();
      } catch {
        const text = await response.text();
        throw new Error(text || 'Failed to create order on server');
      }

      if (!response.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create order on server');
      }

      const { razorpayOrderId, amount, currency, keyId } = orderData;
      const orderId = orderData.internalOrderId || orderData.orderId;

      // 3. Open Razorpay Standard Checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency || 'INR',
        name: 'Royal Diwali Wishes Platform',
        description: `${currentPlan.nameEn} (₹${currentPlan.priceInInr}) - Test Mode`,
        order_id: razorpayOrderId,
        prefill: {
          name: formData.customerName.trim(),
          email: formData.customerEmail.trim() || undefined,
          contact: formData.customerWhatsapp.replace(/\D/g, '')
        },
        theme: {
          color: '#3B0D16' // Royal Maroon
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            setPaymentError(
              lang === 'hi'
                ? 'भुगतान रद्द कर दिया गया। आप किसी भी समय पुनः प्रयास कर सकते हैं।'
                : 'Payment checkout was cancelled. You can retry at any time.'
            );
          }
        },
        handler: async (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setIsSubmitting(true);
          try {
            // 4. Server-Side HMAC SHA256 Signature Verification
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success || !verifyData.verified) {
              throw new Error(verifyData.error || 'Payment verification failed on server');
            }

            // 5. Success! Navigate to Order Success Page
            setIsSubmitting(false);
            onPaymentSuccess(orderId);
          } catch (verifyErr: any) {
            console.error('Payment verification error:', verifyErr);
            setIsSubmitting(false);
            setPaymentError(
              verifyErr.message ||
                (lang === 'hi'
                  ? 'सर्वर पर भुगतान सत्यापन विफल रहा। कृपया सहायता से संपर्क करें।'
                  : 'Payment verification failed on server. Please contact support.')
            );
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (failResp: any) => {
        setIsSubmitting(false);
        const desc = failResp.error?.description || 'Payment failed';
        setPaymentError(`${desc}. Please try again.`);
      });

      rzp.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setIsSubmitting(false);
      setPaymentError(err.message || 'Payment initiation failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-maroon-900 via-maroon-950 to-[#180B0B] border-2 border-gold-400/60 rounded-3xl p-6 sm:p-8 text-ivory-100 shadow-2xl my-8 overflow-hidden"
      >
        <CornerOrnament position="top-left" className="absolute top-2 left-2 w-8 h-8 opacity-70" />
        <CornerOrnament position="top-right" className="absolute top-2 right-2 w-8 h-8 opacity-70" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 rounded-full bg-maroon-900/80 hover:bg-gold-500/20 text-gold-400 hover:text-gold-200 border border-gold-400/40 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-2 pb-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>{lang === 'hi' ? 'सुरक्षित चेकआउट' : 'Secure Checkout'}</span>
            <span className="text-amber-400">• {currentPlan.nameEn} (₹{currentPlan.priceInInr})</span>
          </div>

          <h2 className={lang === 'hi' ? 'font-devanagari font-bold text-2xl sm:text-3xl text-gold-200' : 'font-heading font-bold text-2xl sm:text-3xl text-gold-200'}>
            {lang === 'hi' ? 'अपनी दीपावली भेंट कस्टमाइज़ करें' : 'Customize Your Royal Greeting'}
          </h2>

          <p className="text-xs text-gold-300/80 mt-1 font-devanagari">
            {lang === 'hi'
              ? 'विवरण दर्ज करें। भुगतान के तुरंत बाद आपका लिंक व कार्ड जनरेट हो जाएगा।'
              : 'Enter details below. Your personalized website and card will be activated immediately upon test payment.'}
          </p>

          <OrnateDivider className="max-w-xs mx-auto my-4" />
        </div>

        {paymentError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{paymentError}</span>
          </div>
        )}

        <form onSubmit={handlePayNow} className="space-y-4">
          {/* Plan Selector Radios */}
          <div>
            <label className="block text-xs font-semibold text-gold-300 uppercase tracking-wider mb-2">
              {lang === 'hi' ? 'योजना का चयन (Plan):' : 'Select Plan:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(PLANS) as PlanId[]).map((pId) => {
                const p = PLANS[pId];
                const isChosen = formData.selectedPlan === pId;
                return (
                  <button
                    key={pId}
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedPlan: pId })}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                      isChosen
                        ? 'border-gold-400 bg-gold-500/20 shadow-md ring-2 ring-gold-400/40 text-gold-200'
                        : 'border-gold-500/20 bg-maroon-950/70 text-gold-400/80 hover:border-gold-400/40'
                    }`}
                  >
                    <span className="font-heading font-bold text-xs sm:text-sm">{p.nameEn}</span>
                    <span className="text-sm sm:text-base font-extrabold text-amber-300 mt-0.5">₹{p.priceInInr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 1: Sender Name & Recipient Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                <span className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-gold-400" />
                  <span>{lang === 'hi' ? 'आपका नाम (प्रेषक / Sender) *' : 'Your Name (Sender) *'}</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder={lang === 'hi' ? 'उदा. हिमांशु कुमार' : 'e.g. Himanshu Kumar'}
                className="name-input-field w-full px-3.5 py-2 rounded-xl border border-gold-400 text-sm font-semibold outline-none"
              />
              {errors.customerName && <p className="text-[11px] text-rose-400 mt-0.5">{errors.customerName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                <span className="flex items-center space-x-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>{lang === 'hi' ? 'प्राप्तकर्ता का नाम (Recipient) *' : 'Recipient Name *'}</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                placeholder={lang === 'hi' ? 'उदा. हिमांशु कुमार व परिवार' : 'e.g. Himanshu Kumar & Family'}
                className="name-input-field w-full px-3.5 py-2 rounded-xl border border-gold-400 text-sm font-semibold outline-none"
              />
              {errors.recipientName && <p className="text-[11px] text-rose-400 mt-0.5">{errors.recipientName}</p>}
            </div>
          </div>

          {/* Row 2: WhatsApp Number & Optional Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'hi' ? 'व्हाट्सएप नंबर (10 अंक) *' : 'WhatsApp Number (10 digits) *'}</span>
                </span>
              </label>
              <input
                type="tel"
                value={formData.customerWhatsapp}
                onChange={(e) => setFormData({ ...formData, customerWhatsapp: e.target.value })}
                placeholder="e.g. 9417885574"
                maxLength={13}
                className="name-input-field w-full px-3.5 py-2 rounded-xl border border-gold-400 text-sm font-semibold outline-none"
              />
              {errors.customerWhatsapp && <p className="text-[11px] text-rose-400 mt-0.5">{errors.customerWhatsapp}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-gold-400" />
                  <span>{lang === 'hi' ? 'ईमेल (वैकल्पिक / Optional)' : 'Email (Optional)'}</span>
                </span>
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                placeholder="e.g. himanshukumar@example.com"
                className="name-input-field w-full px-3.5 py-2 rounded-xl border border-gold-400 text-sm font-semibold outline-none"
              />
              {errors.customerEmail && <p className="text-[11px] text-rose-400 mt-0.5">{errors.customerEmail}</p>}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1.5">
              <span className="flex items-center space-x-1">
                <Palette className="w-3.5 h-3.5 text-gold-400" />
                <span>{lang === 'hi' ? 'पसंदीदा थीम (Preferred Theme):' : 'Preferred Theme:'}</span>
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                const t = THEMES[tId];
                const isSelected = formData.preferredTheme === tId;
                return (
                  <button
                    key={tId}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredTheme: tId })}
                    className={`p-2 rounded-xl border text-xs text-left transition flex items-center space-x-2 ${
                      isSelected
                        ? 'border-gold-400 bg-gold-500/25 ring-1 ring-gold-400 text-gold-200'
                        : 'border-gold-500/20 bg-maroon-950/70 text-gold-300/80 hover:border-gold-400/40'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gold-400/50 flex-shrink-0"
                      style={{ background: t.primaryColor }}
                    ></span>
                    <span className="truncate">{lang === 'hi' ? t.nameHi.split('(')[0] : t.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Greeting Message */}
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              <span className="flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
                <span>{lang === 'hi' ? 'व्यक्तिगत संदेश / शुभकामना (Greeting Message):' : 'Personal Greeting Message:'}</span>
              </span>
            </label>
            <textarea
              rows={2}
              value={formData.greetingMessage}
              onChange={(e) => setFormData({ ...formData, greetingMessage: e.target.value })}
              placeholder={
                lang === 'hi'
                  ? 'उदा. यह पावन पर्व आपके जीवन में सुख, शांति, समृद्धि और सफलता लेकर आए!'
                  : 'e.g. May this festival of lights illuminate your path with joy, good health, and success!'
              }
              className="name-input-field w-full px-3.5 py-2 rounded-xl border border-gold-400 text-xs sm:text-sm font-semibold outline-none resize-none"
            />
          </div>

          {/* Optional Additional Customization Instructions */}
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              <span className="flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-gold-400" />
                <span>{lang === 'hi' ? 'अतिरिक्त निर्देश (Optional Instructions):' : 'Additional Instructions (Optional):'}</span>
              </span>
            </label>
            <input
              type="text"
              value={formData.customInstructions}
              onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })}
              placeholder={lang === 'hi' ? 'उदा. विशेष फॉन्ट या संदेश प्राथमिकता...' : 'e.g. Special notes or requirements...'}
              className="name-input-field w-full px-3.5 py-2 rounded-xl border border-gold-400 text-xs sm:text-sm font-semibold outline-none"
            />
          </div>

          {/* Pricing & Submit CTA */}
          <div className="pt-3 border-t border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <span className="text-xs text-gold-400/80 uppercase tracking-widest block">
                {lang === 'hi' ? 'कुल देय राशि:' : 'Total Amount:'}
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold text-gold-300">₹</span>
                <span className="text-3xl font-extrabold gold-text-gradient font-heading">{currentPlan.priceInInr}</span>
                <span className="text-[11px] text-amber-300/80 ml-1">({currentPlan.nameEn} • Test Mode)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-maroon-950 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-maroon-950" />
                  <span>{lang === 'hi' ? 'भुगतान प्रक्रिया चालू है...' : 'Processing...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-maroon-950" />
                  <span>{lang === 'hi' ? `₹${currentPlan.priceInInr} का टेस्ट भुगतान करें` : `Pay ₹${currentPlan.priceInInr} via Razorpay`}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

