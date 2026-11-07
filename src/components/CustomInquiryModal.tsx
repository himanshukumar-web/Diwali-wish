import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, MessageCircle, Send, CheckCircle2, User, Phone, Mail, FileText, AlertCircle } from 'lucide-react';
import { Language, ThemeId } from '../types';
import { THEMES } from '../data/plansData';
import { CornerOrnament, OrnateDivider } from './DecorativeBorders';

interface CustomInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const CustomInquiryModal: React.FC<CustomInquiryModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerWhatsapp: '',
    customerEmail: '',
    recipientName: '',
    requirements: '',
    preferredTheme: 'maroon_gold' as ThemeId,
    budgetRange: '₹10–₹100'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.customerName.trim() || !formData.customerWhatsapp.trim() || !formData.requirements.trim()) {
      setError(lang === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें।' : 'Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/custom-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSubmittedWhatsAppUrl(data.whatsappUrl);
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-gradient-to-b from-maroon-900 via-maroon-950 to-[#180B0B] border-2 border-gold-400/60 rounded-3xl p-6 sm:p-8 text-ivory-100 shadow-2xl my-8 overflow-hidden"
      >
        <CornerOrnament position="top-left" className="absolute top-2 left-2 w-7 h-7 opacity-70" />
        <CornerOrnament position="top-right" className="absolute top-2 right-2 w-7 h-7 opacity-70" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-maroon-900/80 hover:bg-gold-500/20 text-gold-400 hover:text-gold-200 border border-gold-400/40 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {!submittedWhatsAppUrl ? (
          <>
            <div className="text-center pt-2 pb-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-saffron-500/15 border border-saffron-400/30 text-saffron-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
                <span>{lang === 'hi' ? 'कस्टम कोटेशन (₹10–₹100)' : 'Custom Quotation (₹10–₹100)'}</span>
              </div>

              <h2 className={lang === 'hi' ? 'font-devanagari font-bold text-2xl text-gold-200' : 'font-heading font-bold text-2xl text-gold-200'}>
                {lang === 'hi' ? 'विशेष कस्टमाइज़ेशन अनुरोध' : 'Special Custom Request'}
              </h2>
              <p className="text-xs text-gold-300/80 mt-1">
                {lang === 'hi'
                  ? 'अपनी विशेष आवश्यकताएँ बताएं। हिमांशु द्वारा आपको तुरंत कोटेशन दिया जाएगा।'
                  : 'Tell us your custom requirements for a manual quotation from Himanshu.'}
              </p>

              <OrnateDivider className="max-w-xs mx-auto my-3" />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">
                  {lang === 'hi' ? 'आपका नाम *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder={lang === 'hi' ? 'उदा. हिमांशु कुमार' : 'e.g. Himanshu Kumar'}
                  className="name-input-field w-full px-3.5 py-2 rounded-xl border border-gold-400 text-xs sm:text-sm font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">
                    {lang === 'hi' ? 'व्हाट्सएप नंबर *' : 'WhatsApp Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerWhatsapp}
                    onChange={(e) => setFormData({ ...formData, customerWhatsapp: e.target.value })}
                    placeholder="e.g. 9417885574"
                    className="name-input-field w-full px-3.5 py-2 rounded-xl border border-gold-400 text-xs sm:text-sm font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">
                    {lang === 'hi' ? 'बजट रेंज' : 'Budget Range'}
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gold-400 text-xs sm:text-sm font-semibold bg-white text-maroon-900 outline-none"
                  >
                    <option value="₹10–₹25">₹10 – ₹25</option>
                    <option value="₹25–₹50">₹25 – ₹50</option>
                    <option value="₹50–₹100">₹50 – ₹100</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">
                  {lang === 'hi' ? 'कस्टमाइज़ेशन विवरण व आवश्यकताएँ *' : 'Customization Details & Special Wishes *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder={
                    lang === 'hi'
                      ? 'उदा. कंपनी के 50 कर्मचारियों के लिए व्यक्तिगत नाम, विशेष पारिवारिक कविता, या विशिष्ट फोटो जोड़ना...'
                      : 'e.g. Corporate team greetings, bespoke poem, custom photos or background music...'
                  }
                  className="name-input-field w-full px-3.5 py-2 rounded-xl border border-gold-400 text-xs sm:text-sm font-semibold outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-maroon-950 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow flex items-center justify-center space-x-2 transition"
              >
                <Send className="w-4 h-4 text-maroon-950" />
                <span>{isSubmitting ? 'अनुरोध भेजा जा रहा है...' : 'अनुरोध भेजें व व्हाट्सएप पर चैट करें'}</span>
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-2xl text-gold-200 mb-2">
              {lang === 'hi' ? 'अनुरोध दर्ज कर लिया गया!' : 'Inquiry Submitted Successfully!'}
            </h3>
            <p className="text-xs text-gold-300/80 mb-6">
              {lang === 'hi'
                ? 'अब नीचे दिए गए बटन पर क्लिक करें और हिमांशु से सीधे व्हाट्सएप पर बात करें।'
                : 'Click below to start direct WhatsApp chat with Himanshu with your prefilled inquiry.'}
            </p>
            <a
              href={submittedWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{lang === 'hi' ? 'व्हाट्सएप चैट खोलें' : 'Open WhatsApp Chat'}</span>
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
};

