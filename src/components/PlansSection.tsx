import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Crown, Shield, Heart, MessageCircle, ArrowRight, Star } from 'lucide-react';
import { Language, PlanId, ThemeId } from '../types';
import { PLANS, THEMES } from '../data/plansData';
import { CornerOrnament, OrnateDivider, DiyaGraphic } from './DecorativeBorders';

interface PlansSectionProps {
  lang: Language;
  onSelectPlan: (planId: PlanId) => void;
  onCustomInquiry: () => void;
  onBackToHome?: () => void;
}

export const PlansSection: React.FC<PlansSectionProps> = ({
  lang,
  onSelectPlan,
  onCustomInquiry,
  onBackToHome
}) => {
  const [selectedThemePreview, setSelectedThemePreview] = useState<ThemeId>('maroon_gold');

  const planList = [PLANS.basic, PLANS.premium, PLANS.royal];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Background Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-amber-500/10 via-saffron-500/5 to-transparent rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 text-xs text-gold-400 hover:text-gold-200 transition mb-4 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30"
          >
            <span>← {lang === 'hi' ? 'मुख्य द्वार पर लौटें' : 'Back to Home'}</span>
          </button>
        )}

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span className={lang === 'hi' ? 'font-devanagari' : ''}>
            {lang === 'hi' ? 'राजसी योजनाएँ व कस्टमाइज़ेशन' : 'Royal Plans & Customization'}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
        </div>

        <h1 className={lang === 'hi' ? 'font-devanagari font-bold text-3xl sm:text-4xl md:text-5xl gold-text-gradient mb-3' : 'font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl gold-text-gradient tracking-tight mb-3'}>
          {lang === 'hi' ? 'अपनों के लिए संजोएँ एक अनूठी डिजिटल भेंट' : 'Gift a Handcrafted Royal Digital Experience'}
        </h1>

        <p className={lang === 'hi' ? 'font-devanagari text-base sm:text-lg text-gold-200/90 leading-relaxed' : 'font-body text-sm sm:text-base text-gold-200/90 leading-relaxed'}>
          {lang === 'hi'
            ? 'इस पावन पर्व पर अपने परिजनों और मित्रों को भेजें एक विशेष व्यक्तिगत वेबसाइट व शुभकामना कार्ड। सुरक्षित रेज़रपे टेस्ट पेमेंट द्वारा तुरंत एक्टिवेट करें।'
            : 'Celebrate this auspicious festival by sharing personalized greeting websites and downloadable cards with your loved ones. Instant activation via secure Razorpay checkout.'}
        </p>

        <OrnateDivider className="max-w-md mx-auto my-6" />
      </div>

      {/* Three Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
        {planList.map((plan) => {
          const isPopular = plan.isPopular;
          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 shadow-2xl transition-all ${
                isPopular
                  ? 'bg-gradient-to-b from-maroon-900/95 via-maroon-950/90 to-black/90 border-gold-400 shadow-gold-glow scale-105 z-10'
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
                    {lang === 'hi' ? 'रेज़रपे टेस्ट मोड • सुरक्षित भुगतान' : 'Razorpay Test Mode • Instant'}
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
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 ${
                    isPopular
                      ? 'bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 text-maroon-950 shadow-gold-glow'
                      : 'bg-maroon-900/90 hover:bg-gold-500/20 border-2 border-gold-400/60 text-gold-300 hover:text-gold-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className={lang === 'hi' ? 'font-devanagari font-bold' : 'font-heading font-bold'}>
                    {lang === 'hi' ? `₹${plan.priceInInr} में अभी शुरू करें` : `Get Started for ₹${plan.priceInInr}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Theme Selector Showcase */}
      <div className="royal-card-glow rounded-3xl p-6 sm:p-10 border border-gold-500/40 shadow-2xl mb-14 text-center max-w-4xl mx-auto">
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
            const isSelected = selectedThemePreview === tId;
            return (
              <button
                key={tId}
                onClick={() => setSelectedThemePreview(tId)}
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

      {/* SECTION 8: Custom Inquiries (₹10–₹100) */}
      <div className="royal-card-glow rounded-3xl p-6 sm:p-10 border-2 border-dashed border-gold-400/50 shadow-2xl max-w-3xl mx-auto text-center">
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
    </div>
  );
};

