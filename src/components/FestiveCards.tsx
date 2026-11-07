import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Sparkles, Heart, Compass, Flame, Smile, Gift } from 'lucide-react';
import { Language } from '../types';
import { festiveCardsData } from '../data/wishesData';
import { CornerOrnament, OrnateDivider } from './DecorativeBorders';
import { royalAudio } from '../utils/audioSynth';

interface FestiveCardsProps {
  lang: Language;
}

export const FestiveCards: React.FC<FestiveCardsProps> = ({ lang }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sun': return <Sun className="w-7 h-7 text-amber-300" />;
      case 'Sparkles': return <Sparkles className="w-7 h-7 text-gold-300" />;
      case 'Heart': return <Heart className="w-7 h-7 text-rose-400" />;
      case 'Compass': return <Compass className="w-7 h-7 text-orange-400" />;
      case 'Flame': return <Flame className="w-7 h-7 text-saffron-400" />;
      case 'Smile': return <Smile className="w-7 h-7 text-yellow-300" />;
      default: return <Gift className="w-7 h-7 text-gold-400" />;
    }
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Accent Glow */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>{lang === 'hi' ? 'षट्-मंगल कामनाएँ' : 'Six Sacred Blessings for Your Family'}</span>
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
        </div>

        <h2 className={lang === 'hi' ? "font-devanagari font-bold text-3xl sm:text-4xl md:text-5xl text-ivory-100" : "font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-ivory-100 tracking-tight"}>
          {lang === 'hi' ? 'जीवन के हर पहलू के लिए शुभ आशीष ✨' : 'Cherished Festive Blessings ✨'}
        </h2>

        <p className="mt-3 text-sm sm:text-base text-gold-300/80 max-w-2xl mx-auto font-devanagari">
          {lang === 'hi'
            ? 'सुख, समृद्धि, प्रेम, सफलता, शांति और सद्भाव से परिपूर्ण जीवन के लिए छह अनमोल मंगलकामनाएँ।'
            : 'Six handcrafted blessings radiating health, abundance, affection, triumph, tranquility, and harmony.'}
        </p>

        <OrnateDivider className="max-w-md mx-auto" />
      </motion.div>

      {/* Six Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {festiveCardsData.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            onMouseEnter={() => royalAudio.playSparkleChime()}
            className="group relative royal-card-glow rounded-3xl p-6 sm:p-8 border border-gold-500/35 hover:border-gold-400 transition-all duration-300 shadow-xl hover:shadow-gold-glow flex flex-col justify-between overflow-hidden"
          >
            {/* Corner Ornaments */}
            <CornerOrnament position="top-left" className="absolute top-2 left-2 w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity" />
            <CornerOrnament position="bottom-right" className="absolute bottom-2 right-2 w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity" />

            {/* Top Row: Category & Icon */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-gold-400 bg-maroon-800/80 px-3 py-1 rounded-full border border-gold-500/30">
                  {lang === 'hi' ? card.categoryHi : card.categoryEn}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500/20 to-maroon-700/50 border border-gold-400/40 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  {getIcon(card.iconName)}
                </div>
              </div>

              {/* Hindi Wish */}
              <p className="font-devanagari text-lg sm:text-xl text-ivory-50 font-semibold leading-relaxed mb-3 group-hover:text-gold-200 transition-colors">
                "{card.hindi}"
              </p>

              {/* English Wish */}
              <p className="font-heading italic text-xs sm:text-sm text-ivory-200/80 leading-normal">
                "{card.english}"
              </p>
            </div>

            {/* Bottom Accent Line */}
            <div className="mt-6 pt-4 border-t border-gold-500/20 flex items-center justify-between text-[11px] text-gold-400/70">
              <span>॥ शुभम भवतु ॥</span>
              <span className="font-heading font-semibold text-gold-300">#0{card.id}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

