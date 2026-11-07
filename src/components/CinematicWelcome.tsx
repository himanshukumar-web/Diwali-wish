import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { Language } from '../types';
import { openingData, getPersonalizedHeadings } from '../data/wishesData';
import { MandalaOrnament, DiyaGraphic, ToranGarland, CornerOrnament, OrnateDivider, TempleBell } from './DecorativeBorders';
import { royalAudio } from '../utils/audioSynth';

interface CinematicWelcomeProps {
  lang: Language;
  recipientName: string;
  senderName: string;
  onEnter: () => void;
}

export const CinematicWelcome: React.FC<CinematicWelcomeProps> = ({
  lang,
  recipientName,
  senderName,
  onEnter,
}) => {
  const headings = getPersonalizedHeadings(recipientName, senderName);

  const handleRingBell = () => {
    royalAudio.playTempleBell();
  };

  const handleOpenWishes = () => {
    royalAudio.playSparkleChime();
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-maroon-900 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8">
      {/* Background Decorative Arches & Radial Light */}
      <div className="absolute inset-0 bg-royal-gradient pointer-events-none opacity-95"></div>
      
      {/* Palace Arch Silhouette at top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
        <ToranGarland />
      </div>

      {/* Rotating Background Mandala */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 overflow-hidden">
        <MandalaOrnament className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] max-w-none" />
      </div>

      {/* Floating Palace Lanterns / Ambient Light Glows */}
      <div className="absolute top-1/4 left-10 w-48 h-48 bg-saffron-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-gold-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Main Royal Invitation Scroll / Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-20 max-w-3xl w-full mx-auto my-auto royal-card-glow rounded-3xl p-6 sm:p-10 md:p-12 text-center border-2 border-gold-500/40 shadow-2xl overflow-hidden"
      >
        {/* Four Corner Ornaments */}
        <CornerOrnament position="top-left" className="absolute top-3 left-3 w-8 h-8 sm:w-12 sm:h-12" />
        <CornerOrnament position="top-right" className="absolute top-3 right-3 w-8 h-8 sm:w-12 sm:h-12" />
        <CornerOrnament position="bottom-left" className="absolute bottom-3 left-3 w-8 h-8 sm:w-12 sm:h-12" />
        <CornerOrnament position="bottom-right" className="absolute bottom-3 right-3 w-8 h-8 sm:w-12 sm:h-12" />

        {/* Temple Bell for Interactive Blessing */}
        <div className="flex justify-center mb-3">
          <TempleBell className="w-9 h-9" onClick={handleRingBell} />
        </div>

        {/* 1. Sacred Sanskrit Ganesha Inscription */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-20 inline-block px-6 py-2 rounded-full bg-maroon-900/95 border border-gold-400/50 mb-3 shadow-lg backdrop-blur-md"
        >
          <span className="ganesha-greeting text-gold-300 font-bold text-sm sm:text-base drop-shadow select-none">
            {openingData.ganeshaMantra}
          </span>
        </motion.div>

        {/* Sender Attribution Badge if present */}
        {senderName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-saffron-500/20 border border-saffron-400/50 text-saffron-300 text-xs sm:text-sm font-semibold mb-3 shadow-md"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400 animate-pulse" />
            <span className="font-devanagari">
              {lang === 'hi' ? `${senderName} की तरफ से सस्नेह संदेश` : `A Special Greeting from ${senderName}`}
            </span>
          </motion.div>
        )}

        {/* 2. Grand Auspicious Diwali Main Heading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.9 }}
          className="my-1 overflow-visible"
        >
          <h1 className="diwali-main-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl gold-text-gradient select-none">
            {openingData.shubhDiwali}
          </h1>
        </motion.div>

        {/* 3. Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-4"
        >
          {lang === 'hi' ? (
            <h2 className="diwali-subtitle-hindi text-base sm:text-2xl text-gold-200 font-semibold leading-relaxed">
              {openingData.mainHeadingHi}
            </h2>
          ) : (
            <h2 className="font-heading italic text-lg sm:text-2xl text-gold-200/90 font-medium">
              {openingData.mainHeadingEn}
            </h2>
          )}
        </motion.div>

        <OrnateDivider />

        {/* Dedicated Recipient Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-6 p-4 rounded-2xl bg-maroon-800/60 border border-gold-500/30 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center space-x-2 text-saffron-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1.5">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
            <span>Dedicated with Warmth & Reverence</span>
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
          </div>
          <p className="font-devanagari text-base sm:text-xl text-ivory-100 font-medium leading-relaxed">
            {lang === 'hi' ? headings.heroPersonalNoteHi : headings.heroPersonalNoteEn}
          </p>
        </motion.div>

        {/* Flanking Glowing Diyas + Heartfelt Quote */}
        <div className="flex items-center justify-between gap-4 my-6">
          <div className="hidden sm:block">
            <DiyaGraphic isLit={true} size="md" />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.9 }}
            className="flex-1 text-center px-2"
          >
            <p className="font-devanagari text-sm sm:text-base text-gold-200/95 font-medium leading-relaxed not-italic mb-2">
              "{openingData.quoteHi}"
            </p>
            <p className="font-heading text-xs sm:text-sm text-ivory-200/80 italic">
              "{openingData.quoteEn}"
            </p>
          </motion.div>

          <div className="hidden sm:block">
            <DiyaGraphic isLit={true} size="md" />
          </div>
        </div>

        {/* Mobile Diya visible on small screens */}
        <div className="flex justify-center sm:hidden mb-4">
          <DiyaGraphic isLit={true} size="md" />
        </div>

        {/* The Grand "Open Your Special Wishes" Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="pt-2"
        >
          <button
            onClick={handleOpenWishes}
            className="relative group inline-flex items-center justify-center px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-heading font-bold text-base sm:text-lg text-maroon-900 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
          >
            {/* Animated Shimmer Ribbon */}
            <span className="absolute inset-0 rounded-full overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            </span>

            <Sparkles className="w-5 h-5 mr-2 text-maroon-800" />
            <span className={lang === 'hi' ? 'font-devanagari font-bold' : ''}>
              {lang === 'hi' ? openingData.buttonHi : openingData.buttonEn}
            </span>
            <Sparkles className="w-5 h-5 ml-2 text-maroon-800" />
          </button>

          <p className="text-[11px] text-gold-400/80 mt-3 font-devanagari not-italic">
            {lang === 'hi'
              ? '✨ स्पर्श करें और उत्सव की पावन धारा में प्रवेश करें'
              : '✨ Click to unveil the royal celebration crafted for your family'}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
