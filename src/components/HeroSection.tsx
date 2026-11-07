import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Flame, Edit3 } from 'lucide-react';
import { Language } from '../types';
import { openingData, getPersonalizedHeadings } from '../data/wishesData';
import { DiyaGraphic, ToranGarland, OrnateDivider, MandalaOrnament, TempleBell } from './DecorativeBorders';
import { royalAudio } from '../utils/audioSynth';

interface HeroSectionProps {
  lang: Language;
  recipientName: string;
  senderName: string;
  onExploreDiyas: () => void;
  onEditName: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  recipientName,
  senderName,
  onExploreDiyas,
  onEditName,
}) => {
  const headings = getPersonalizedHeadings(recipientName, senderName);

  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
      {/* Decorative Toran Garland fixed at top edge of doorway */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
        <ToranGarland />
      </div>

      {/* Rotating Background Mandala Artwork */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 overflow-hidden">
        <MandalaOrnament className="w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] max-w-none" />
      </div>

      {/* Palace Lantern Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gold-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-saffron-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
        {/* Interactive Temple Bell */}
        <div className="mb-4">
          <TempleBell className="w-9 h-9" onClick={() => royalAudio.playTempleBell()} />
        </div>

        {/* 1. Sanskrit Greeting: "॥ श्री गणेशाय नमः ॥" */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 inline-block px-6 py-2 rounded-full bg-maroon-900/95 border border-gold-400/50 mb-3 shadow-lg backdrop-blur-md"
        >
          <span className="ganesha-greeting text-gold-300 font-bold text-base sm:text-lg drop-shadow select-none">
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
              {lang === 'hi' ? `${senderName} की तरफ से सस्नेह भेंट` : `Sent with Love from ${senderName}`}
            </span>
          </motion.div>
        )}

        {/* 2. Main Heading: "॥ शुभ दीपावली ॥" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="my-1 overflow-visible"
        >
          <h1 className="diwali-main-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl gold-text-gradient select-none">
            {openingData.shubhDiwali}
          </h1>
        </motion.div>

        {/* 3. Subtitle: "रोशनी, प्रेम और अपनत्व का पावन पर्व" */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-3"
        >
          {lang === 'hi' ? (
            <p className="diwali-subtitle-hindi text-lg sm:text-2xl text-gold-200 font-semibold leading-relaxed">
              {openingData.mainHeadingHi}
            </p>
          ) : (
            <p className="font-heading italic text-lg sm:text-2xl text-gold-200/90 font-medium">
              {openingData.mainHeadingEn}
            </p>
          )}
        </motion.div>

        <OrnateDivider className="max-w-md mx-auto mb-6" />

        {/* Dedicated Recipient Card (Dynamically Personalized) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="royal-card-glow rounded-3xl p-6 sm:p-8 border border-gold-500/40 shadow-2xl max-w-2xl w-full mx-auto"
        >
          <div className="flex items-center justify-center space-x-2 text-saffron-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
            <span>Dedicated with Heartfelt Affection</span>
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
          </div>

          <div className="flex items-center justify-center space-x-2 mb-2">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-gold-300">
              {recipientName || 'Dear'} & Your Wonderful Family
            </h2>
            <button
              onClick={onEditName}
              className="p-1.5 rounded-full hover:bg-gold-500/20 text-gold-400 hover:text-gold-200 transition"
              title="Edit Name"
              aria-label="Edit Recipient Name"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <p className="font-devanagari text-base sm:text-lg text-ivory-100 font-medium leading-relaxed mb-4">
            {lang === 'hi' ? headings.heroPersonalNoteHi : headings.heroPersonalNoteEn}
          </p>

          {/* Diya Array */}
          <div className="flex items-center justify-center space-x-4 my-2">
            <DiyaGraphic isLit={true} size="sm" />
            <DiyaGraphic isLit={true} size="md" />
            <DiyaGraphic isLit={true} size="sm" />
          </div>

          <p className="font-devanagari text-xs sm:text-sm text-gold-200/90 not-italic mt-3 leading-relaxed">
            "{openingData.quoteHi}"
          </p>
        </motion.div>

        {/* Call-to-Action to Light Diyas & Share */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <button
            onClick={onExploreDiyas}
            className="flex items-center space-x-2 px-8 py-3.5 rounded-full font-heading font-bold text-sm sm:text-base text-maroon-900 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow transition transform hover:-translate-y-1"
          >
            <Flame className="w-4 h-4 text-maroon-900" />
            <span className={lang === 'hi' ? 'font-devanagari font-bold' : ''}>
              {lang === 'hi' ? 'आइए, दीप प्रज्वलित करें 🪔' : 'Light Diyas Together 🪔'}
            </span>
          </button>

          <a
            href="#share"
            className="flex items-center space-x-2 px-6 py-3.5 rounded-full font-semibold text-xs sm:text-sm text-maroon-900 bg-gradient-to-r from-gold-400 to-amber-400 hover:from-gold-300 hover:to-amber-300 shadow-md transition transform hover:-translate-y-0.5"
          >
            <Heart className="w-4 h-4 fill-current text-maroon-900" />
            <span className={lang === 'hi' ? 'font-devanagari font-bold' : ''}>
              {lang === 'hi' ? 'शुभकामनाएँ साझा करें ❤️' : 'Share Diwali Wishes ❤️'}
            </span>
          </a>

          <a
            href="#wishes"
            className="flex items-center space-x-2 px-6 py-3.5 rounded-full font-semibold text-xs sm:text-sm text-gold-300 bg-maroon-800/80 hover:bg-maroon-700/80 border border-gold-500/40 shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className={lang === 'hi' ? 'font-devanagari' : 'font-heading'}>
              {lang === 'hi' ? 'विशेष शुभकामनाएँ पढ़ें' : 'Read Full Wishes'}
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
