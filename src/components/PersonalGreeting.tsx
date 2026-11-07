import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Check, Share2, Heart } from 'lucide-react';
import { Language } from '../types';
import { getPersonalGreetingParagraphs, getPersonalizedHeadings, generateWhatsAppMessage } from '../data/wishesData';
import { CornerOrnament, OrnateDivider, DiyaGraphic } from './DecorativeBorders';

interface PersonalGreetingProps {
  lang: Language;
  recipientName: string;
  senderName: string;
  onCopyWishes: () => void;
  copied: boolean;
}

export const PersonalGreeting: React.FC<PersonalGreetingProps> = ({
  lang,
  recipientName,
  senderName,
  onCopyWishes,
  copied,
}) => {
  const { paragraphsHi, paragraphsEn } = getPersonalGreetingParagraphs(recipientName, senderName);
  const headings = getPersonalizedHeadings(recipientName, senderName);
  const paragraphs = lang === 'hi' ? paragraphsHi : paragraphsEn;

  const handleShareWhatsApp = () => {
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?from=${encodeURIComponent(senderName || recipientName || 'Someone Special')}`
      : '';
    const message = generateWhatsAppMessage(senderName || recipientName, shareUrl);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="wishes" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Decorative Jharokha Arch Backdrop Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[85%] max-w-4xl bg-gradient-to-b from-maroon-700/30 via-gold-500/10 to-transparent rounded-full filter blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        {/* Sacred Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span className={lang === 'hi' ? 'font-devanagari' : ''}>
            {lang === 'hi' ? headings.senderBadgeHi : headings.senderBadgeEn}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
        </div>

        {/* Section Heading */}
        <h2 className={lang === 'hi' ? "font-devanagari font-bold text-3xl sm:text-4xl md:text-5xl text-ivory-100" : "font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-ivory-100 tracking-tight"}>
          {lang === 'hi' ? "एक खास परिवार के नाम ❤️" : "Dedicated to a Special Family ❤️"}
        </h2>

        {/* Subheading dedicated to Recipient & Family */}
        <p className="mt-2 font-heading font-semibold text-xl sm:text-2xl gold-text-gradient tracking-wide">
          {recipientName || 'Dear'} & Your Wonderful Family
        </p>

        <OrnateDivider className="max-w-md mx-auto" />
      </motion.div>

      {/* Royal Scroll Parchment Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative royal-card-glow rounded-3xl p-6 sm:p-10 md:p-12 border-2 border-gold-500/40 shadow-2xl overflow-hidden"
      >
        {/* Four Corner Golden Filigrees */}
        <CornerOrnament position="top-left" className="absolute top-3 left-3 w-10 h-10 sm:w-14 sm:h-14" />
        <CornerOrnament position="top-right" className="absolute top-3 right-3 w-10 h-10 sm:w-14 sm:h-14" />
        <CornerOrnament position="bottom-left" className="absolute bottom-3 left-3 w-10 h-10 sm:w-14 sm:h-14" />
        <CornerOrnament position="bottom-right" className="absolute bottom-3 right-3 w-10 h-10 sm:w-14 sm:h-14" />

        {/* Top Centered Floating Diya */}
        <div className="flex justify-center -mt-2 mb-6">
          <DiyaGraphic isLit={true} size="md" />
        </div>

        {/* The Heartfelt Wishes Paragraphs */}
        <div className="space-y-4 sm:space-y-5 text-center max-w-3xl mx-auto">
          {paragraphs.map((para, index) => {
            const isFirst = index === 0;
            const isLast = index === paragraphs.length - 1;

            return (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
                className={`leading-relaxed ${
                  isFirst
                    ? (lang === 'hi'
                        ? 'font-devanagari font-bold text-lg sm:text-2xl text-gold-300 drop-shadow'
                        : 'font-heading font-bold text-lg sm:text-2xl text-gold-300 drop-shadow')
                    : isLast
                    ? (lang === 'hi'
                        ? 'font-devanagari font-bold text-base sm:text-xl text-saffron-400 pt-2'
                        : 'font-heading font-bold text-base sm:text-xl text-saffron-400 pt-2')
                    : lang === 'hi'
                    ? 'font-devanagari text-base sm:text-lg text-ivory-100 font-medium'
                    : 'font-body text-base sm:text-lg text-ivory-100/90 font-normal'
                }`}
              >
                {para}
              </motion.p>
            );
          })}
        </div>

        <OrnateDivider className="max-w-xs mx-auto my-8" />

        {/* Closing Signature for this greeting */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-gold-400/80 font-semibold mb-1">
            {lang === 'hi' ? 'सस्नेह एवं शुभकामनाओं सहित' : 'With Deepest Respect & Blessings'}
          </p>
          <span className="font-calligraphy text-3xl sm:text-4xl text-gold-300 font-bold tracking-wide">
            {headings.signature}
          </span>
        </div>

        {/* Action Buttons: Copy & WhatsApp Share */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gold-500/20">
          <button
            onClick={onCopyWishes}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-maroon-800/80 hover:bg-maroon-700 border border-gold-500/40 text-gold-300 text-xs sm:text-sm font-semibold transition shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className={lang === 'hi' ? 'font-devanagari' : ''}>
              {copied ? (lang === 'hi' ? 'कॉपी हो गया!' : 'Copied!') : (lang === 'hi' ? 'शुभकामनाएँ कॉपी करें' : 'Copy Full Wishes')}
            </span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-400/40 text-white text-xs sm:text-sm font-semibold transition shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span className={lang === 'hi' ? 'font-devanagari' : ''}>
              {lang === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share to WhatsApp'}
            </span>
          </button>
        </div>
      </motion.div>
    </section>
  );
};
