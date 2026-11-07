import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Check,
  Crown,
  ShieldCheck,
  AlertCircle,
  Loader2,
  User,
  Phone,
  Mail,
  Heart,
  MessageSquare,
  Palette,
  FileText,
  Star,
  MessageCircle,
  ArrowRight,
  Eye,
  Lock,
  Globe,
  Info
} from 'lucide-react';
import { Language, PlanId, ThemeId, CustomerFormData } from '../types';
import { PLANS, THEMES, getPlanById } from '../data/plansData';
import { CornerOrnament, OrnateDivider, DiyaGraphic } from './DecorativeBorders';
import { generateCardSvg } from '../utils/cardGenerator';

interface CustomizationSectionProps {
  id?: string;
  lang: Language;
  onPaymentSuccess: (orderId: string) => void;
  onCustomInquiry: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const CustomizationSection: React.FC<CustomizationSectionProps> = ({
  id = 'customize',
  lang,
  onPaymentSuccess,
  onCustomInquiry,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('premium');
  const [previewLang, setPreviewLang] = useState<Language>(lang);
  const [showLivePreview, setShowLivePreview] = useState<boolean>(true);

  const [formData, setFormData] = useState<CustomerFormData>({
    customerName: '',
    customerWhatsapp: '',
    customerEmail: '',
    recipientName: '',
    selectedPlan: 'premium',
    greetingMessage: '',
    preferredTheme: 'maroon_gold',
    customInstructions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Sync selected plan with form
  const handleSelectPlan = (planId: PlanId) => {
    setSelectedPlanId(planId);
    setFormData((prev) => ({ ...prev, selectedPlan: planId }));
    const formElement = document.getElementById('customization-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const currentPlan = getPlanById(selectedPlanId);
  const planList = [PLANS.basic, PLANS.premium, PLANS.royal];

  // Generate live watermarked preview SVG on the fly
  const previewSvg = useMemo(() => {
    return generateCardSvg({
      recipientName: formData.recipientName,
      senderName: formData.customerName,
      greetingMessage: formData.greetingMessage,
      theme: formData.preferredTheme,
      lang: previewLang,
      isWatermarked: true // Strictly watermarked for free preview
    });
  }, [formData.recipientName, formData.customerName, formData.greetingMessage, formData.preferredTheme, previewLang]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = lang === 'hi' ? 'कृपया अपना नाम (प्रेषक) दर्ज करें' : 'Please enter your name (sender)';
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
          ? 'कृपया आगे बढ़ने से पहले सभी आवश्यक फ़ील्ड (प्रेषक का नाम, प्राप्तकर्ता का नाम, 10 अंकों का व्हाट्सएप नंबर) भरें।'
          : 'Please complete all required fields (Sender Name, Recipient Name, and 10-digit WhatsApp Number) to proceed with payment.'
      );
      // Auto-focus first error field
      const firstErrorField = Object.keys(newErrors)[0];
      const el = document.getElementById(`field-${firstErrorField}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      // 1. Ensure Razorpay script is loaded
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        throw new Error(
          lang === 'hi'
            ? 'रेज़रपे चेकआउट लोड करने में विफल रहा। कृपया इंटरनेट कनेक्शन या विज्ञापन अवरोधक (Adblocker) जांचें।'
            : 'Failed to load Razorpay Checkout SDK. Please disable ad-blockers and check your network connection.'
        );
      }

      // 2. Call server order creation endpoint
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          customerName: formData.customerName.trim(),
          customerWhatsapp: formData.customerWhatsapp.trim(),
          customerEmail: formData.customerEmail?.trim(),
          recipientName: formData.recipientName.trim(),
          greetingMessage: formData.greetingMessage?.trim(),
          theme: formData.preferredTheme,
          preferredTheme: formData.preferredTheme,
          customInstructions: formData.customInstructions?.trim()
        })
      });

      let orderData: any;
      try {
        orderData = await orderRes.json();
      } catch {
        const text = await orderRes.text();
        throw new Error(text || 'Server error occurred during payment order creation.');
      }

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || (lang === 'hi' ? 'ऑर्डर बनाने में असमर्थ' : 'Failed to create Razorpay order on server.'));
      }

      const { razorpayOrderId, amount, currency, keyId } = orderData;
      const internalOrderId = orderData.internalOrderId || orderData.orderId;

      if (!keyId) {
        throw new Error('Razorpay Key ID is not configured on the server. Please contact support.');
      }

      // 3. Launch Razorpay Standard Checkout Modal
      const options = {
        key: keyId,
        amount: amount,
        currency: currency || 'INR',
        name: 'Royal Diwali Wishes Platform',
        description: `${currentPlan.nameEn} (₹${currentPlan.priceInInr}) - Test Mode Checkout`,
        order_id: razorpayOrderId,
        image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=160&q=80',
        prefill: {
          name: formData.customerName.trim(),
          email: formData.customerEmail?.trim() || 'himanshukumar@example.com',
          contact: formData.customerWhatsapp.replace(/\D/g, '')
        },
        theme: {
          color: '#3B0D16' // Royal Maroon
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          }
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Verify Payment Server-Side with HMAC-SHA256
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: internalOrderId,
                internalOrderId: internalOrderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            let verifyData: any;
            try {
              verifyData = await verifyRes.json();
            } catch {
              const text = await verifyRes.text();
              throw new Error(text || 'Verification response error.');
            }

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || (lang === 'hi' ? 'भुगतान सत्यापन विफल रहा' : 'Payment signature verification failed.'));
            }

            // Payment verified & recorded
            onPaymentSuccess(internalOrderId);
          } catch (verifyErr: any) {
            setPaymentError(verifyErr.message || 'Payment verification failed');
          } finally {
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (failResp: any) => {
        setPaymentError(
          failResp.error?.description || (lang === 'hi' ? 'भुगतान अस्वीकार हो गया' : 'Payment was not completed. Please try again.')
        );
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      setPaymentError(err.message || 'An unexpected error occurred during checkout.');
      setIsSubmitting(false);
    }
  };

  const scrollToPreview = () => {
    setShowLivePreview(true);
    setTimeout(() => {
      const el = document.getElementById('free-preview-panel');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  return (
    <section
      id={id}
      className="relative z-20 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
    >
      {/* Background Royal Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-amber-500/15 via-saffron-500/10 to-transparent rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-semibold mb-3 shadow-inner">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className={lang === 'hi' ? 'font-devanagari font-bold' : 'font-heading font-bold'}>
            {lang === 'hi' ? 'राजसी योजनाएँ व कस्टमाइज़ेशन' : 'Royal Plans & Customization'}
          </span>
          <Sparkles className="w-4 h-4 text-gold-400" />
        </div>

        {/* Verbatim Prompts Heading & Subtitle */}
        <h2 className={lang === 'hi' ? 'font-devanagari font-bold text-3xl sm:text-4xl md:text-5xl gold-text-gradient mb-3' : 'font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl gold-text-gradient tracking-tight mb-3'}>
          {lang === 'hi' ? 'अपनी व्यक्तिगत राजसी दीपावली शुभकामनाएँ बनाएँ' : 'Create Your Personalized Royal Diwali Greeting'}
        </h2>

        <p className={lang === 'hi' ? 'font-devanagari text-base sm:text-lg text-gold-200/90 leading-relaxed' : 'font-body text-sm sm:text-base text-gold-200/90 leading-relaxed'}>
          {lang === 'hi'
            ? 'अपनी योजना चुनें, अपनी शुभकामनाएँ संजोएँ, और अपने प्रियजनों को एक सुंदर डिजिटल अनुभव उपहार में दें।'
            : 'Choose your plan, personalize your wishes, and gift a beautiful digital experience to your loved ones.'}
        </p>

        <OrnateDivider className="max-w-md mx-auto my-6" />
      </div>

      {/* 1. Three Pricing Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14 items-stretch relative z-10">
        {planList.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const isPopular = plan.isPopular;

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleSelectPlan(plan.id)}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 shadow-2xl transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-maroon-900/98 via-maroon-950/95 to-black/95 border-gold-400 shadow-gold-glow scale-[1.03] z-10 ring-2 ring-gold-400/50'
                  : 'bg-maroon-950/80 border-gold-500/30 hover:border-gold-400/60'
              }`}
            >
              {/* Popular Crown Badge */}
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center space-x-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 via-gold-400 to-amber-500 text-maroon-950 font-bold text-xs uppercase tracking-wider shadow-lg">
                  <Crown className="w-3.5 h-3.5 fill-current" />
                  <span>{lang === 'hi' ? 'सर्वाधिक लोकप्रिय' : 'Most Popular'}</span>
                </div>
              )}

              <CornerOrnament position="top-left" className="absolute top-2 left-2 w-6 h-6 opacity-60" />
              <CornerOrnament position="top-right" className="absolute top-2 right-2 w-6 h-6 opacity-60" />

              <div>
                {/* Plan Header */}
                <div className="text-center pt-2 pb-4">
                  <h3 className={lang === 'hi' ? 'font-devanagari font-bold text-2xl text-gold-200 mb-1' : 'font-heading font-bold text-2xl text-gold-200 mb-1'}>
                    {lang === 'hi' ? plan.nameHi : plan.nameEn}
                  </h3>
                  <p className="text-xs text-gold-300/80 font-body mb-4">
                    {lang === 'hi' ? plan.taglineHi : plan.taglineEn}
                  </p>

                  {/* Price Tag */}
                  <div className="flex items-baseline justify-center space-x-1 my-3">
                    <span className="text-xl sm:text-2xl font-bold text-gold-400">₹</span>
                    <span className="text-4xl sm:text-5xl font-extrabold gold-text-gradient font-heading tracking-tight">
                      {plan.priceInInr}
                    </span>
                    <span className="text-xs text-gold-300/70 ml-1">
                      {lang === 'hi' ? '/ एकमुश्त' : '/ one-time'}
                    </span>
                  </div>

                  <div className="inline-block px-3 py-0.5 rounded-full bg-gold-500/10 border border-gold-400/30 text-[11px] text-gold-300">
                    {lang === 'hi' ? 'रेज़रपे टेस्ट मोड • तुरंत सक्रिय' : 'Razorpay Test Mode • Instant'}
                  </div>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold-500/40 to-transparent my-4"></div>

                {/* Features List */}
                <ul className="space-y-3 my-4 text-left">
                  {(lang === 'hi' ? plan.featuresHi : plan.featuresEn).map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-ivory-100">
                      <div className="w-4 h-4 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span className={lang === 'hi' ? 'font-devanagari leading-relaxed' : 'font-body leading-relaxed'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan.id);
                  }}
                  className={`w-full py-3 px-6 rounded-full font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg ${
                    isSelected
                      ? 'bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 text-maroon-950 shadow-gold-glow'
                      : 'bg-maroon-900/90 hover:bg-gold-500/20 border-2 border-gold-400/60 text-gold-300 hover:text-gold-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className={lang === 'hi' ? 'font-devanagari font-bold' : 'font-heading font-bold'}>
                    {isSelected
                      ? (lang === 'hi' ? '✓ चयनित योजना' : '✓ Plan Selected')
                      : (lang === 'hi' ? `₹${plan.priceInInr} चुनें` : `Select ₹${plan.priceInInr}`)}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 2. Embedded Customer Customization Form + Free Watermarked Live Preview */}
      <div
        id="customization-form"
        className="royal-card-glow rounded-3xl p-6 sm:p-10 border-2 border-gold-400/50 shadow-2xl max-w-5xl mx-auto mb-16 relative z-10 bg-gradient-to-b from-maroon-950/95 via-maroon-900/90 to-maroon-950/95"
      >
        <CornerOrnament position="top-left" className="absolute top-3 left-3 w-7 h-7 opacity-75" />
        <CornerOrnament position="top-right" className="absolute top-3 right-3 w-7 h-7 opacity-75" />
        <CornerOrnament position="bottom-left" className="absolute bottom-3 left-3 w-7 h-7 opacity-75" />
        <CornerOrnament position="bottom-right" className="absolute bottom-3 right-3 w-7 h-7 opacity-75" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-400/50 flex items-center justify-center mx-auto mb-3">
            <DiyaGraphic isLit={true} size="sm" />
          </div>
          <h3 className={lang === 'hi' ? 'font-devanagari font-bold text-2xl sm:text-3xl gold-text-gradient mb-2' : 'font-heading font-bold text-2xl sm:text-3xl gold-text-gradient mb-2'}>
            {lang === 'hi' ? 'अपनी व्यक्तिगत शुभकामना विवरण भरें' : 'Fill Your Personal Greeting Details'}
          </h3>
          <p className="text-xs sm:text-sm text-gold-200/80 max-w-xl mx-auto">
            {lang === 'hi'
              ? `चयनित योजना: ${currentPlan.nameHi} (₹${currentPlan.priceInInr}) • आप निःशुल्क पूर्वावलोकन देख सकते हैं या तुरंत सक्रिय कर सकते हैं`
              : `Selected: ${currentPlan.nameEn} Plan (₹${currentPlan.priceInInr}) • Preview your greeting for free or complete secure payment`}
          </p>
        </div>

        {/* Clear Explanation Callout (Verbatim Part 5 Requirement) */}
        <div className="mb-8 p-4 rounded-2xl bg-gold-500/10 border border-gold-400/40 text-gold-200 text-xs sm:text-sm flex items-start space-x-3 shadow-inner">
          <Info className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-semibold text-amber-300 mb-0.5">
              {lang === 'hi' ? '✨ निःशुल्क पूर्वावलोकन व संपूर्ण ग्रीटिंग अनलॉक:' : '✨ Free Watermarked Preview vs. Full Experience:'}
            </p>
            <p className="text-gold-100/90">
              "Try your personalized greeting for free with a Himanshu Kumar watermark. Purchase a plan to unlock your full greeting website and downloadable card."
            </p>
          </div>
        </div>

        {/* Error Notification Banner */}
        {paymentError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs sm:text-sm flex items-start space-x-3 animate-fade-in shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">
                {lang === 'hi' ? 'भुगतान / सत्यापन त्रुटि:' : 'Payment / Validation Notice:'}
              </span>
              <span>{paymentError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handlePayNow} className="space-y-6">
          {/* Plan Selector Buttons */}
          <div>
            <label className="block text-xs font-semibold text-gold-300 uppercase tracking-wider mb-2">
              <span className="flex items-center space-x-1.5">
                <Crown className="w-4 h-4 text-gold-400" />
                <span>{lang === 'hi' ? 'योजना बदलें (Active Plan):' : 'Active Plan:'}</span>
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {planList.map((p) => {
                const isCurrent = formData.selectedPlan === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPlan(p.id)}
                    className={`py-2.5 px-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                      isCurrent
                        ? 'border-gold-400 bg-gradient-to-r from-gold-500/30 to-amber-500/25 ring-2 ring-gold-400/60 text-gold-200 shadow-md'
                        : 'border-gold-500/30 bg-maroon-950/70 text-gold-300/80 hover:border-gold-400/50'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="field-customerName">
              <label className="block text-xs font-semibold text-gold-300 mb-1.5">
                <span className="flex items-center space-x-1.5">
                  <User className="w-4 h-4 text-gold-400" />
                  <span>{lang === 'hi' ? 'आपका नाम (प्रेषक / Sender) *' : 'Your Name (Sender) *'}</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => {
                  setFormData({ ...formData, customerName: e.target.value });
                  if (errors.customerName) setErrors({ ...errors, customerName: '' });
                }}
                placeholder={lang === 'hi' ? 'उदा. हिमांशु कुमार' : 'e.g. Himanshu Kumar'}
                className={`name-input-field w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none shadow-inner ${
                  errors.customerName ? 'border-rose-400 ring-2 ring-rose-400/30' : 'border-gold-400'
                }`}
              />
              {errors.customerName && <p className="text-xs text-rose-400 mt-1">{errors.customerName}</p>}
            </div>

            <div id="field-recipientName">
              <label className="block text-xs font-semibold text-gold-300 mb-1.5">
                <span className="flex items-center space-x-1.5">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>{lang === 'hi' ? 'प्राप्तकर्ता का नाम (Recipient) *' : 'Recipient Name *'}</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => {
                  setFormData({ ...formData, recipientName: e.target.value });
                  if (errors.recipientName) setErrors({ ...errors, recipientName: '' });
                }}
                placeholder={lang === 'hi' ? 'उदा. हिमांशु कुमार व परिवार' : 'e.g. Himanshu Kumar & Family'}
                className={`name-input-field w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none shadow-inner ${
                  errors.recipientName ? 'border-rose-400 ring-2 ring-rose-400/30' : 'border-gold-400'
                }`}
              />
              {errors.recipientName && <p className="text-xs text-rose-400 mt-1">{errors.recipientName}</p>}
            </div>
          </div>

          {/* Row 2: WhatsApp Number & Optional Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="field-customerWhatsapp">
              <label className="block text-xs font-semibold text-gold-300 mb-1.5">
                <span className="flex items-center space-x-1.5">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'hi' ? 'व्हाट्सएप नंबर (10 अंक) *' : 'WhatsApp Number (10 digits) *'}</span>
                </span>
              </label>
              <input
                type="tel"
                value={formData.customerWhatsapp}
                onChange={(e) => {
                  setFormData({ ...formData, customerWhatsapp: e.target.value });
                  if (errors.customerWhatsapp) setErrors({ ...errors, customerWhatsapp: '' });
                }}
                placeholder="e.g. 9417885574"
                maxLength={13}
                className={`name-input-field w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none shadow-inner ${
                  errors.customerWhatsapp ? 'border-rose-400 ring-2 ring-rose-400/30' : 'border-gold-400'
                }`}
              />
              {errors.customerWhatsapp && <p className="text-xs text-rose-400 mt-1">{errors.customerWhatsapp}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1.5">
                <span className="flex items-center space-x-1.5">
                  <Mail className="w-4 h-4 text-gold-400" />
                  <span>{lang === 'hi' ? 'ईमेल (वैकल्पिक / Optional)' : 'Email (Optional)'}</span>
                </span>
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                placeholder="e.g. himanshukumar@example.com"
                className="name-input-field w-full px-4 py-3 rounded-xl border border-gold-400 text-sm font-semibold outline-none shadow-inner"
              />
              {errors.customerEmail && <p className="text-xs text-rose-400 mt-1">{errors.customerEmail}</p>}
            </div>
          </div>

          {/* Theme Selection: All 4 Themes (Maroon, Purple, Saffron, Emerald) */}
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-2">
              <span className="flex items-center space-x-1.5">
                <Palette className="w-4 h-4 text-gold-400" />
                <span>{lang === 'hi' ? 'पसंदीदा थीम (4 राजसी भारतीय थीम्स):' : 'Preferred Theme (4 Royal Indian Themes):'}</span>
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                const t = THEMES[tId];
                const isSelected = formData.preferredTheme === tId;
                return (
                  <button
                    key={tId}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredTheme: tId })}
                    className={`p-3 rounded-xl border text-xs text-left transition flex items-center space-x-2.5 ${
                      isSelected
                        ? 'border-gold-400 bg-gold-500/25 ring-2 ring-gold-400 text-gold-200 shadow-md'
                        : 'border-gold-500/25 bg-maroon-950/70 text-gold-300/80 hover:border-gold-400/40'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-gold-400/60 flex-shrink-0 shadow-sm"
                      style={{ background: t.primaryColor }}
                    ></span>
                    <span className="truncate font-medium">{lang === 'hi' ? t.nameHi.split('(')[0] : t.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Greeting Message & Language Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gold-300 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-gold-400" />
                <span>{lang === 'hi' ? 'व्यक्तिगत संदेश / शुभकामना:' : 'Personal Greeting Message:'}</span>
              </label>

              {/* Preview Language Toggle */}
              <div className="flex items-center space-x-1 bg-maroon-950 rounded-lg p-0.5 border border-gold-500/30 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPreviewLang('hi')}
                  className={`px-2 py-0.5 rounded ${previewLang === 'hi' ? 'bg-gold-500 text-maroon-950 font-bold' : 'text-gold-300/70 hover:text-gold-200'}`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLang('en')}
                  className={`px-2 py-0.5 rounded ${previewLang === 'en' ? 'bg-gold-500 text-maroon-950 font-bold' : 'text-gold-300/70 hover:text-gold-200'}`}
                >
                  EN
                </button>
              </div>
            </div>
            <textarea
              rows={3}
              value={formData.greetingMessage}
              onChange={(e) => setFormData({ ...formData, greetingMessage: e.target.value })}
              placeholder={
                lang === 'hi'
                  ? 'उदा. यह पावन पर्व आपके जीवन में सुख, शांति, समृद्धि और सफलता लेकर आए!'
                  : 'e.g. May this festival of lights illuminate your path with joy, good health, and success!'
              }
              className="name-input-field w-full px-4 py-3 rounded-xl border border-gold-400 text-sm font-semibold outline-none resize-none shadow-inner"
            />
          </div>

          {/* Optional Additional Customization Instructions */}
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1.5">
              <span className="flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-gold-400" />
                <span>{lang === 'hi' ? 'अतिरिक्त निर्देश (Optional Instructions):' : 'Additional Instructions (Optional):'}</span>
              </span>
            </label>
            <input
              type="text"
              value={formData.customInstructions}
              onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })}
              placeholder={lang === 'hi' ? 'उदा. विशेष फॉन्ट या संदेश प्राथमिकता...' : 'e.g. Special notes or requirements...'}
              className="name-input-field w-full px-4 py-3 rounded-xl border border-gold-400 text-sm font-semibold outline-none shadow-inner"
            />
          </div>

          {/* TWO CLEAR ACTIONS: 1. Preview Free Greeting | 2. Pay & Get Full Personalized Greeting */}
          <div className="pt-6 border-t border-gold-500/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              {/* Action 1: Preview Free Greeting */}
              <button
                type="button"
                onClick={scrollToPreview}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-sm sm:text-base text-gold-300 hover:text-gold-100 bg-maroon-900/90 hover:bg-gold-500/20 border-2 border-gold-400/60 shadow-lg transition flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4 text-gold-400" />
                <span className={lang === 'hi' ? 'font-devanagari font-bold' : 'font-heading font-bold'}>
                  {lang === 'hi' ? '👁️ निःशुल्क ग्रीटिंग पूर्वावलोकन देखें (FREE)' : 'Preview Your Greeting — FREE'}
                </span>
              </button>

              {/* Action 2: Pay & Get Full Personalized Greeting */}
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                <div className="text-center sm:text-right">
                  <span className="text-[11px] text-gold-400/80 uppercase tracking-widest block font-medium">
                    {lang === 'hi' ? 'कुल देय राशि:' : 'Plan Price:'}
                  </span>
                  <div className="flex items-baseline justify-center sm:justify-end space-x-1">
                    <span className="text-xl font-bold text-gold-300">₹</span>
                    <span className="text-3xl font-extrabold gold-text-gradient font-heading">{currentPlan.priceInInr}</span>
                    <span className="text-[11px] text-amber-300/80 ml-1">({currentPlan.nameEn})</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-base text-maroon-950 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow transition transform hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-maroon-950" />
                      <span>{lang === 'hi' ? 'रेज़रपे सुरक्षित भुगतान प्रारंभ हो रहा है...' : 'Creating secure payment...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-maroon-950" />
                      <span className={lang === 'hi' ? 'font-devanagari font-bold' : 'font-heading font-bold'}>
                        {lang === 'hi'
                          ? `₹${currentPlan.priceInInr} भुगतान करें व संपूर्ण शुभकामना प्राप्त करें`
                          : `Pay & Get Full Personalized Greeting (₹${currentPlan.priceInInr})`}
                      </span>
                      <ArrowRight className="w-5 h-5 text-maroon-950" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="inline-flex items-center space-x-1.5 text-xs text-gold-400/70">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {lang === 'hi'
                    ? 'सुरक्षित रेज़रपे टेस्ट मोड • सर्वर-सत्यापित भुगतान • तुरंत वेबसाइट लिंक व एचडी कार्ड'
                    : 'Razorpay Test Mode Sandbox • Instant link and greeting generation'}
                </span>
              </span>
            </div>
          </div>
        </form>

        {/* 3. LIVE WATERMARKED GREETING CARD PREVIEW (Part 2 & Part 3) */}
        {showLivePreview && (
          <div
            id="free-preview-panel"
            className="mt-12 pt-8 border-t-2 border-gold-500/40"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold border border-gold-400/40 mb-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>{lang === 'hi' ? 'वाटरमार्क सहित निःशुल्क पूर्वावलोकन' : 'Free Watermarked Preview'}</span>
                </div>
                <h4 className="font-heading font-bold text-lg sm:text-xl text-gold-200">
                  {lang === 'hi' ? 'आपका लाइव ग्रीटिंग कार्ड पूर्वावलोकन' : 'Your Live Greeting Card Preview'}
                </h4>
              </div>

              {/* Watermark Notice */}
              <div className="text-center sm:text-right text-[11px] text-gold-300/80 max-w-sm">
                <span>
                  {lang === 'hi'
                    ? 'वाटरमार्क: "Designed & Developed by Himanshu Kumar"'
                    : 'Permanent Watermark: "Designed & Developed by Himanshu Kumar"'}
                </span>
                <span className="block text-amber-400 text-[10px]">
                  {lang === 'hi' ? 'क्लीन एचडी कार्ड व बिना वाटरमार्क डाउनलोड किसी भी प्लान के साथ अनलॉक होता है।' : 'Clean HD download without watermark is unlocked upon purchasing any plan.'}
                </span>
              </div>
            </div>

            {/* SVG Render Container with Right-Click Protection */}
            <div
              onContextMenu={(e) => e.preventDefault()}
              className="relative w-full rounded-2xl overflow-hidden border-2 border-gold-400/50 shadow-2xl bg-black select-none"
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
            >
              <div
                className="w-full h-auto"
                dangerouslySetInnerHTML={{ __html: previewSvg }}
              />

              {/* Watermark Protection overlay shield to discourage simple browser right-click save */}
              <div
                className="absolute inset-0 pointer-events-none border border-gold-400/30 rounded-2xl"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(24, 11, 11, 0.4) 100%)'
                }}
              ></div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-maroon-950/70 border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gold-300">
              <span className="text-center sm:text-left">
                {lang === 'hi'
                  ? '✨ यह आपका लाइव पूर्वावलोकन है। नाम, भाषा या संदेश बदलने पर यह तुरंत अपडेट होता है।'
                  : '✨ This is your live preview. It automatically updates when you change names, language, theme, or message above.'}
              </span>

              <button
                type="button"
                onClick={() => {
                  const formElement = document.getElementById('customization-form');
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="inline-flex items-center space-x-1 font-bold text-amber-300 hover:text-amber-100 transition whitespace-nowrap"
              >
                <span>{lang === 'hi' ? `₹${currentPlan.priceInInr} में अनलॉक करें →` : `Unlock Clean Card for ₹${currentPlan.priceInInr} →`}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Theme Selector Showcase */}
      <div className="royal-card-glow rounded-3xl p-6 sm:p-10 border border-gold-500/40 shadow-2xl mb-14 text-center max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-center space-x-2 text-saffron-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{lang === 'hi' ? 'उपलब्ध 4 राजसी भारतीय थीम्स' : 'Available in 4 Royal Indian Themes'}</span>
          <Star className="w-3.5 h-3.5 fill-current" />
        </div>

        <h3 className={lang === 'hi' ? 'font-devanagari font-bold text-xl sm:text-2xl text-gold-200 mb-6' : 'font-heading font-bold text-xl sm:text-2xl text-gold-200 mb-6'}>
          {lang === 'hi' ? 'अपनी मनपसंद थीम चुनें जो आपके परिवार की पहचान बने' : 'Choose the Royal Palette That Resonates With You'}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
            const theme = THEMES[tId];
            const isSelected = formData.preferredTheme === tId;
            return (
              <button
                key={tId}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, preferredTheme: tId }));
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-gold-400 bg-gold-500/15 ring-2 ring-gold-400/50 shadow-md'
                    : 'border-gold-500/20 bg-maroon-950/60 hover:border-gold-400/40'
                }`}
              >
                <div
                  className="w-full h-14 rounded-xl mb-3 border border-gold-400/30 flex items-center justify-center shadow-inner"
                  style={{ background: theme.bgGradient }}
                >
                  <DiyaGraphic isLit={true} size="xs" />
                </div>
                <div>
                  <span className="font-heading font-semibold text-xs text-gold-200 block line-clamp-1">
                    {lang === 'hi' ? theme.nameHi.split('(')[0] : theme.nameEn}
                  </span>
                  <span className="text-[10px] text-gold-400/70 block mt-0.5">
                    {isSelected ? '✓ ' + (lang === 'hi' ? 'चयनित' : 'Selected') : (lang === 'hi' ? 'पूर्वावलोकन' : 'Preview')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Custom Inquiries (₹10–₹100) */}
      <div className="royal-card-glow rounded-3xl p-6 sm:p-10 border-2 border-dashed border-gold-400/50 shadow-2xl max-w-3xl mx-auto text-center relative z-10">
        <div className="w-12 h-12 rounded-full bg-saffron-500/20 border border-saffron-400/50 flex items-center justify-center mx-auto mb-3">
          <MessageCircle className="w-6 h-6 text-saffron-400" />
        </div>

        <h3 className={lang === 'hi' ? 'font-devanagari font-bold text-2xl text-ivory-50 mb-2' : 'font-heading font-bold text-2xl text-ivory-50 mb-2'}>
          {lang === 'hi' ? 'विशेष कस्टमाइज़ेशन या अतिरिक्त आवश्यकताएँ? (₹10–₹100)' : 'Special Custom Requests or Custom Quotes (₹10–₹100)'}
        </h3>

        <p className={lang === 'hi' ? 'font-devanagari text-sm sm:text-base text-gold-200/90 max-w-xl mx-auto mb-6 leading-relaxed' : 'font-body text-sm sm:text-base text-gold-200/90 max-w-xl mx-auto mb-6 leading-relaxed'}>
          {lang === 'hi'
            ? 'यदि आपके पास विशेष पारिवारिक संदेश, कंपनी लोगो, अतिरिक्त ऑडियो या अलग डिज़ाइन आवश्यकताएँ हैं, तो सीधे हिमांशु से संपर्क करें और अपनी आवश्यकता अनुसार कस्टम कोटेशन प्राप्त करें।'
            : 'Have bespoke family requirements, company greetings, special music, or unique layouts outside the standard plans? Request a manual quotation from Himanshu.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onCustomInquiry}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-full font-bold text-sm sm:text-base text-maroon-950 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow transition transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-maroon-950" />
            <span className={lang === 'hi' ? 'font-devanagari' : 'font-heading'}>
              {lang === 'hi' ? 'कस्टम अनुरोध फॉर्म भरें' : 'Submit Custom Inquiry'}
            </span>
          </button>

          <a
            href="https://wa.me/919417885574?text=Hello%20Himanshu,%20I%20am%20interested%20in%20a%20custom%20Diwali%20wishes%20website%20(range%20%E2%82%B910%E2%80%93%E2%82%B9100).%20Please%20guide%20me!"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full font-semibold text-sm text-gold-300 hover:text-gold-100 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 transition"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp: +91 9417885574</span>
          </a>
        </div>
      </div>
    </section>
  );
};
