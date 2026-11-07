import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { diyasData } from '../data/wishesData';
import { DiyaGraphic, OrnateDivider, CornerOrnament } from './DecorativeBorders';
import { royalAudio } from '../utils/audioSynth';

interface InteractiveDiyasProps {
  lang: Language;
}

export const InteractiveDiyas: React.FC<InteractiveDiyasProps> = ({ lang }) => {
  // Set of lit diya IDs (1 to 9)
  const [litDiyas, setLitDiyas] = useState<Set<number>>(new Set());
  // Currently active blessing to show in focus
  const [activeBlessingId, setActiveBlessingId] = useState<number | null>(null);

  const lightDiya = (id: number) => {
    royalAudio.playTempleBell();
    setLitDiyas((prev) => {
      const next = new Set(prev);
      next.add(id);
      if (next.size === diyasData.length) {
        // Trigger celebratory golden confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FF9933', '#FFF3DC', '#FFD700', '#B89225'],
        });
      }
      return next;
    });
    setActiveBlessingId(id);
  };

  const handleLightAll = () => {
    royalAudio.playSparkleChime();
    diyasData.forEach((diya, index) => {
      setTimeout(() => {
        setLitDiyas((prev) => new Set(prev).add(diya.id));
        royalAudio.playTempleBell();
      }, index * 200);
    });

    setTimeout(() => {
      setActiveBlessingId(9);
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#FF9933', '#FFF3DC', '#FFD700', '#E67300'],
      });
    }, diyasData.length * 200 + 100);
  };

  const handleReset = () => {
    setLitDiyas(new Set());
    setActiveBlessingId(null);
  };

  const allLit = litDiyas.size === diyasData.length;
  const activeDiya = diyasData.find((d) => d.id === activeBlessingId);

  return (
    <section id="diyas" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Background Mandala Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-saffron-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-saffron-500/15 border border-saffron-400/30 text-saffron-300 text-xs sm:text-sm font-semibold mb-3">
          <Flame className="w-3.5 h-3.5 text-saffron-400 animate-pulse" />
          <span>{lang === 'hi' ? 'दीप प्रज्वलन व पावन आशीर्वाद' : 'Sacred Diya Lighting & Blessings'}</span>
          <Flame className="w-3.5 h-3.5 text-saffron-400 animate-pulse" />
        </div>

        <h2 className={lang === 'hi' ? "font-devanagari font-bold text-3xl sm:text-4xl md:text-5xl text-ivory-100 leading-normal" : "font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-ivory-100 tracking-tight"}>
          {lang === 'hi' ? 'आइए, खुशियों के कुछ दीप जलाएँ 🪔' : "Let's Illuminate the Lights of Joy 🪔"}
        </h2>

        <p className="mt-3 text-sm sm:text-base text-gold-300/80 max-w-2xl mx-auto font-devanagari">
          {lang === 'hi'
            ? 'प्रत्येक दीप पर स्पर्श करें और अपने परिवार के लिए विशेष शुभकामना व आशीष का आह्वान करें।'
            : 'Touch each diya to ignite its golden flame and unveil a divine blessing crafted for your family.'}
        </p>

        <OrnateDivider className="max-w-md mx-auto" />

        {/* Counter & Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          {/* Diyas Lit Counter */}
          <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-maroon-800/90 border border-gold-500/30 text-xs sm:text-sm">
            <span className="text-ivory-200">{lang === 'hi' ? 'प्रज्वलित दीप:' : 'Diyas Lit:'}</span>
            <span className="font-bold text-gold-400 text-base">{litDiyas.size} / 9</span>
            {allLit && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1 inline" />}
          </div>

          {/* Light All Diyas Button */}
          <button
            onClick={allLit ? handleReset : handleLightAll}
            className="flex items-center space-x-2 px-6 py-2 rounded-full font-semibold text-xs sm:text-sm text-maroon-900 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 text-maroon-800" />
            <span className={lang === 'hi' ? 'font-devanagari font-bold' : 'font-heading font-semibold'}>
              {allLit
                ? (lang === 'hi' ? 'पुनः दीप जलाएँ' : 'Reset Diyas')
                : (lang === 'hi' ? 'सभी दीप प्रज्वलित करें ✨' : 'Light All Diyas ✨')}
            </span>
          </button>
        </div>
      </motion.div>

      {/* 9 Diyas Decorative Grid Arrangement */}
      <div className="relative royal-card-glow rounded-3xl p-6 sm:p-10 border border-gold-500/30 shadow-2xl mb-8">
        <CornerOrnament position="top-left" className="absolute top-3 left-3 w-8 h-8 sm:w-12 sm:h-12" />
        <CornerOrnament position="top-right" className="absolute top-3 right-3 w-8 h-8 sm:w-12 sm:h-12" />
        <CornerOrnament position="bottom-left" className="absolute bottom-3 left-3 w-8 h-8 sm:w-12 sm:h-12" />
        <CornerOrnament position="bottom-right" className="absolute bottom-3 right-3 w-8 h-8 sm:w-12 sm:h-12" />

        <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-10 max-w-4xl mx-auto py-4">
          {diyasData.map((diya, index) => {
            const isLit = litDiyas.has(diya.id);
            const isSelected = activeBlessingId === diya.id;

            return (
              <motion.div
                key={diya.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <button
                  type="button"
                  onClick={() => lightDiya(diya.id)}
                  className={`group relative p-3 sm:p-4 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-gold-500/25 ring-2 ring-gold-400 shadow-gold-glow'
                      : isLit
                      ? 'bg-maroon-800/80 hover:bg-gold-500/15'
                      : 'bg-maroon-900/60 hover:bg-maroon-800/80 border border-dashed border-gold-500/30'
                  }`}
                  title={isLit ? 'View Blessing' : 'Click to Light'}
                  aria-label={`Diya ${diya.id}: ${diya.titleEn}`}
                >
                  {/* Diya SVG Graphic */}
                  <DiyaGraphic isLit={isLit} size="md" />

                  {/* Diya Label & Status */}
                  <div className="mt-2 text-center">
                    <span className="text-[11px] sm:text-xs font-semibold text-gold-300 block font-heading">
                      #{diya.id} {lang === 'hi' ? diya.titleHi : diya.titleEn}
                    </span>
                    <span
                      className={`text-[9px] sm:text-[10px] uppercase tracking-wider block font-medium ${
                        isLit ? 'text-saffron-400 font-bold' : 'text-ivory-200/50 group-hover:text-gold-300'
                      }`}
                    >
                      {isLit
                        ? (lang === 'hi' ? 'प्रज्वलित 🪔' : 'Illuminated 🪔')
                        : (lang === 'hi' ? 'स्पर्श करें ✨' : 'Click to Light ✨')}
                    </span>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Live Blessing Reveal Card */}
        <div className="mt-6 min-h-[110px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeDiya && (
              <motion.div
                key={activeDiya.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl bg-gradient-to-r from-maroon-800/90 via-maroon-700/90 to-maroon-800/90 border border-gold-400/50 rounded-2xl p-4 sm:p-6 text-center shadow-gold-glow"
              >
                <div className="flex items-center justify-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'hi' ? `आशीर्वाद #${activeDiya.id} • ${activeDiya.titleHi}` : `Blessing #${activeDiya.id} • ${activeDiya.titleEn}`}
                  </span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <p className="font-devanagari text-lg sm:text-2xl text-ivory-50 font-semibold drop-shadow leading-relaxed mb-1">
                  "{activeDiya.blessingHi}"
                </p>
                <p className="font-heading italic text-xs sm:text-sm text-gold-200/90">
                  "{activeDiya.blessingEn}"
                </p>
              </motion.div>
            )}

            {!activeDiya && !allLit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-ivory-200/70 text-xs sm:text-sm font-devanagari not-italic"
              >
                {lang === 'hi'
                  ? '👈 किसी भी दीप पर क्लिक करके उसका पावन संदेश पढ़ें...'
                  : '👈 Touch any diya to illuminate it and discover its blessings...'}
              </motion.div>
            )}

            {allLit && !activeBlessingId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-4 bg-gold-500/15 rounded-2xl border border-gold-400/40 text-gold-200"
              >
                <p className={lang === 'hi' ? "font-devanagari font-bold text-base sm:text-lg" : "font-heading font-bold text-base sm:text-lg"}>
                  {lang === 'hi'
                    ? '✨ सभी ९ दीप प्रज्वलित हो चुके हैं! आपके परिवार पर माँ लक्ष्मी की असीम कृपा बरसे।'
                    : '✨ All 9 Diyas Shine Brightly! May divine grace and prosperity bless your family forever.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

