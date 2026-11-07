import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Sparkles, Heart, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { getFinalClosingParagraphs, getPersonalizedHeadings, creatorInfo } from '../data/wishesData';
import { MandalaOrnament, DiyaGraphic, CornerOrnament, OrnateDivider, ToranGarland } from './DecorativeBorders';

interface FinalClosingProps {
  lang: Language;
  recipientName: string;
  senderName: string;
  onReplayWelcome?: () => void;
}

export const FinalClosing: React.FC<FinalClosingProps> = ({
  lang,
  recipientName,
  senderName,
  onReplayWelcome,
}) => {
  const { paragraphsHi, paragraphsEn } = getFinalClosingParagraphs(recipientName, senderName);
  const headings = getPersonalizedHeadings(recipientName, senderName);
  const paragraphs = lang === 'hi' ? paragraphsHi : paragraphsEn;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="closing" className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-maroon-950 border-t border-gold-500/30">
      {/* Decorative Toran across top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
        <ToranGarland />
      </div>

      {/* Grand Rotating Sacred Rangoli in Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-15 overflow-hidden flex items-center justify-center">
        <MandalaOrnament className="w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] max-w-none" />
      </div>

      {/* Palace Night Sky Silhouette Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-amber-500/10 via-saffron-500/5 to-transparent rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="relative z-20 max-w-4xl mx-auto text-center">
        {/* Five Diyas Sacred Arrangement */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-6 mb-8">
          <DiyaGraphic isLit={true} size="sm" className="opacity-80" />
          <DiyaGraphic isLit={true} size="md" />
          <DiyaGraphic isLit={true} size="lg" />
          <DiyaGraphic isLit={true} size="md" />
          <DiyaGraphic isLit={true} size="sm" className="opacity-80" />
        </div>

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className={lang === 'hi' ? 'font-devanagari' : ''}>
              {recipientName || 'Dear'} & Your Wonderful Family
            </span>
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          </div>

          <h2 className={lang === 'hi' ? "font-devanagari font-bold text-3xl sm:text-4xl md:text-5xl gold-text-gradient mb-4" : "font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl gold-text-gradient tracking-tight mb-4"}>
            {lang === 'hi' ? "॥ दीपों का यह पर्व सदा जगमगाए ॥" : "May the Lights of Diwali Shine Forever"}
          </h2>

          <OrnateDivider className="max-w-md mx-auto" />
        </motion.div>

        {/* Closing Card with Ornaments */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative royal-card-glow rounded-3xl p-6 sm:p-10 md:p-12 my-8 border border-gold-500/40 shadow-2xl"
        >
          <CornerOrnament position="top-left" className="absolute top-3 left-3 w-8 h-8 sm:w-12 sm:h-12" />
          <CornerOrnament position="top-right" className="absolute top-3 right-3 w-8 h-8 sm:w-12 sm:h-12" />
          <CornerOrnament position="bottom-left" className="absolute bottom-3 left-3 w-8 h-8 sm:w-12 sm:h-12" />
          <CornerOrnament position="bottom-right" className="absolute bottom-3 right-3 w-8 h-8 sm:w-12 sm:h-12" />

          {/* Closing Paragraphs */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {paragraphs.map((p, idx) => (
              <p
                key={idx}
                className={`leading-relaxed ${
                  idx === paragraphs.length - 1
                    ? (lang === 'hi'
                        ? 'font-devanagari font-bold text-xl sm:text-2xl text-gold-300 pt-2'
                        : 'font-heading font-bold text-xl sm:text-2xl text-gold-300 pt-2')
                    : lang === 'hi'
                    ? 'font-devanagari text-base sm:text-lg text-ivory-100 font-medium'
                    : 'font-body text-base sm:text-lg text-ivory-100/90 font-normal'
                }`}
              >
                {p}
              </p>
            ))}
          </div>

          <OrnateDivider className="max-w-xs mx-auto my-8" />

          {/* The Grand Closing Signature (Dynamic Sender Signature) */}
          <div className="pt-2 pb-4">
            <p className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
              {lang === 'hi' ? 'सदा स्नेह और आदर के साथ' : 'Forever in Warmth & Affection'}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <h3 className="font-calligraphy text-5xl sm:text-6xl md:text-7xl gold-text-gradient font-bold tracking-wider drop-shadow-lg select-none">
                {headings.signature}
              </h3>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons: Replay Welcome & Back to Top */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {onReplayWelcome && (
            <button
              onClick={onReplayWelcome}
              className="group flex items-center space-x-2 px-6 py-2.5 rounded-full bg-maroon-900/90 hover:bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md transform hover:-translate-y-1"
              title="Replay Opening Welcome"
            >
              <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
              <span className={lang === 'hi' ? 'font-devanagari' : ''}>
                {lang === 'hi' ? 'स्वागत स्क्रीन पुनः देखें' : 'Replay Opening Welcome'}
              </span>
            </button>
          )}

          <button
            onClick={scrollToTop}
            className="group flex items-center space-x-2 px-6 py-2.5 rounded-full bg-maroon-900/90 hover:bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md transform hover:-translate-y-1"
            title="Scroll to Top"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span className={lang === 'hi' ? 'font-devanagari' : ''}>
              {lang === 'hi' ? 'शीर्ष पर लौटें' : 'Back to Top'}
            </span>
          </button>
        </div>

        {/* SECTION 6: PERMANENT WEBSITE CREATOR CREDIT */}
        <div className="mt-14 pt-8 border-t border-gold-500/30 max-w-2xl mx-auto text-center px-4">
          {/* Tagline row with side-positioned decorative glowing Diyas */}
          <div className="flex items-center justify-between sm:justify-center sm:gap-8 md:gap-12 mb-3 max-w-lg mx-auto">
            {/* Left Diya (positioned towards outer left with ample clearance) */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <DiyaGraphic isLit={true} size="xs" />
            </div>

            {/* Perfectly Centered Tagline */}
            <span className="font-heading font-medium text-[11px] sm:text-xs md:text-sm tracking-widest text-gold-300 uppercase px-2 sm:px-4 select-none">
              {creatorInfo.tagline}
            </span>

            {/* Right Diya (positioned towards outer right with ample clearance) */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <DiyaGraphic isLit={true} size="xs" />
            </div>
          </div>

          {/* Creator Title */}
          <p className="font-heading font-bold text-sm sm:text-base text-gold-200 tracking-wide mb-1.5">
            {creatorInfo.title}
          </p>

          {/* Copyright Notice */}
          <p className="text-[11px] sm:text-xs text-gold-400/60 font-body leading-relaxed">
            © 2026 Himanshu Kumar.
            <span className="block sm:inline sm:ml-1">All Rights Reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
