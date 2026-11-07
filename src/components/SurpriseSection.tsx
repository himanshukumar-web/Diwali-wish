import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gift, Heart, Sparkles, MailOpen, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { surpriseData, getPersonalizedHeadings } from '../data/wishesData';
import { CornerOrnament, OrnateDivider, DiyaGraphic } from './DecorativeBorders';
import { royalAudio } from '../utils/audioSynth';

interface SurpriseSectionProps {
  lang: Language;
  recipientName: string;
  senderName: string;
}

export const SurpriseSection: React.FC<SurpriseSectionProps> = ({
  lang,
  recipientName,
  senderName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const headings = getPersonalizedHeadings(recipientName, senderName);

  const handleOpenSurprise = () => {
    royalAudio.playSparkleChime();
    setIsOpen(true);

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.65 },
      colors: ['#D4AF37', '#FF9933', '#FFF3DC', '#FFD700', '#FF4D6D'],
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const messageParagraphs = lang === 'hi' ? surpriseData.messageHi : surpriseData.messageEn;

  return (
    <section id="surprise" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Background Heart Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-700/15 rounded-full filter blur-3xl pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Initial Sealed Envelope / Gift State */
          <motion.div
            key="sealed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.6 }}
            className="royal-card-glow rounded-3xl p-8 sm:p-12 text-center border-2 border-gold-500/40 shadow-2xl relative overflow-hidden"
          >
            <CornerOrnament position="top-left" className="absolute top-3 left-3 w-8 h-8 sm:w-12 sm:h-12" />
            <CornerOrnament position="top-right" className="absolute top-3 right-3 w-8 h-8 sm:w-12 sm:h-12" />
            <CornerOrnament position="bottom-left" className="absolute bottom-3 left-3 w-8 h-8 sm:w-12 sm:h-12" />
            <CornerOrnament position="bottom-right" className="absolute bottom-3 right-3 w-8 h-8 sm:w-12 sm:h-12" />

            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-xs sm:text-sm font-semibold mb-4">
              <Heart className="w-3.5 h-3.5 fill-current text-rose-400 animate-pulse" />
              <span className={lang === 'hi' ? 'font-devanagari' : ''}>
                {lang === 'hi' ? surpriseData.badgeHi : surpriseData.badgeEn}
              </span>
              <Heart className="w-3.5 h-3.5 fill-current text-rose-400 animate-pulse" />
            </div>

            {/* Title */}
            <h2 className={lang === 'hi' ? "font-devanagari font-bold text-3xl sm:text-4xl md:text-5xl text-ivory-50 mb-3" : "font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-ivory-50 tracking-tight mb-3"}>
              {lang === 'hi' ? surpriseData.previewHeadingHi : surpriseData.previewHeadingEn}
            </h2>

            <p className={lang === 'hi' ? "font-devanagari text-sm sm:text-base text-gold-200/90 max-w-xl mx-auto mb-8 leading-relaxed" : "font-body text-sm sm:text-base text-gold-200/90 max-w-xl mx-auto mb-8 leading-relaxed"}>
              {lang === 'hi' ? surpriseData.subpreviewHi : surpriseData.subpreviewEn}
            </p>

            {/* Glowing Golden Sealed Envelope Motif */}
            <div className="relative my-6 flex justify-center items-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="relative w-44 h-32 sm:w-52 sm:h-36 rounded-2xl bg-gradient-to-br from-amber-600/40 via-gold-500/30 to-maroon-800/80 border-2 border-gold-400/60 shadow-gold-glow flex items-center justify-center p-4"
              >
                {/* Envelope Flap Lines */}
                <svg className="absolute inset-0 w-full h-full text-gold-400/40" viewBox="0 0 100 80" fill="none">
                  <path d="M0 0 L50 45 L100 0" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M0 80 L38 35" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                  <path d="M100 80 L62 35" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                </svg>

                {/* Royal Wax Seal */}
                <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-rose-800 via-rose-600 to-amber-500 border-2 border-gold-300 shadow-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-gold-100 fill-current animate-pulse" />
                </div>
              </motion.div>
            </div>

            <OrnateDivider className="max-w-xs mx-auto my-6" />

            {/* Open Button */}
            <button
              onClick={handleOpenSurprise}
              className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base text-maroon-900 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow transition transform hover:-translate-y-1 active:translate-y-0"
            >
              <Gift className="w-5 h-5 mr-2 text-maroon-900 group-hover:rotate-12 transition-transform" />
              <span className={lang === 'hi' ? 'font-devanagari font-bold' : 'font-heading tracking-wider'}>
                {lang === 'hi' ? surpriseData.buttonHi : surpriseData.buttonEn}
              </span>
              <Sparkles className="w-5 h-5 ml-2 text-maroon-900" />
            </button>
          </motion.div>
        ) : (
          /* Opened Royal Golden Letter */
          <motion.div
            key="revealed"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative royal-card-glow rounded-3xl p-8 sm:p-12 text-center border-2 border-gold-400 shadow-gold-glow-lg overflow-hidden bg-gradient-to-b from-maroon-800/95 via-maroon-900/95 to-maroon-950/98"
          >
            <CornerOrnament position="top-left" className="absolute top-3 left-3 w-10 h-10 sm:w-14 sm:h-14" />
            <CornerOrnament position="top-right" className="absolute top-3 right-3 w-10 h-10 sm:w-14 sm:h-14" />
            <CornerOrnament position="bottom-left" className="absolute bottom-3 left-3 w-10 h-10 sm:w-14 sm:h-14" />
            <CornerOrnament position="bottom-right" className="absolute bottom-3 right-3 w-8 h-8 sm:w-14 sm:h-14" />

            {/* Top Diya Graphic */}
            <div className="flex justify-center -mt-2 mb-4">
              <DiyaGraphic isLit={true} size="md" />
            </div>

            {/* Heading */}
            <div className="inline-flex items-center space-x-2 text-gold-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">
              <MailOpen className="w-4 h-4" />
              <span className={lang === 'hi' ? 'font-devanagari' : ''}>
                {lang === 'hi' ? surpriseData.revealedHeadingHi : surpriseData.revealedHeadingEn}
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-gold-200 mb-6">
              {recipientName || 'Dear'} & Your Wonderful Family
            </h2>

            <OrnateDivider className="max-w-sm mx-auto mb-8" />

            {/* Revealed Message (Verbatim from prompt) */}
            <div className="space-y-4 max-w-2xl mx-auto">
              {messageParagraphs.map((para, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.15, duration: 0.5 }}
                  className={`leading-relaxed ${
                    idx === 0
                      ? (lang === 'hi' ? 'font-devanagari font-bold text-lg sm:text-xl text-gold-300 drop-shadow' : 'font-heading font-bold text-lg sm:text-xl text-gold-300 drop-shadow')
                      : idx === messageParagraphs.length - 1
                      ? (lang === 'hi' ? 'font-devanagari font-bold text-base sm:text-lg text-saffron-400 pt-2' : 'font-heading font-bold text-base sm:text-lg text-saffron-400 pt-2')
                      : lang === 'hi'
                      ? 'font-devanagari text-base sm:text-lg text-ivory-100 font-medium'
                      : 'font-body text-base sm:text-lg text-ivory-100 font-normal'
                  }`}
                >
                  "{para}"
                </motion.p>
              ))}
            </div>

            <OrnateDivider className="max-w-xs mx-auto my-8" />

            {/* Signature */}
            <div className="mb-6">
              <span className="font-calligraphy text-4xl sm:text-5xl text-gold-300 font-bold tracking-wider drop-shadow">
                {headings.signature}
              </span>
            </div>

            {/* Close / Replay Button */}
            <button
              onClick={handleClose}
              className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-maroon-800/80 hover:bg-maroon-700 border border-gold-500/30 text-xs text-gold-300 font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className={lang === 'hi' ? 'font-devanagari' : ''}>
                {lang === 'hi' ? 'पत्र समेटें' : 'Close Letter'}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
