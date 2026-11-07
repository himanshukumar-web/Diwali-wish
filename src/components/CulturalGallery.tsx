import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, X, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language, GalleryItem } from '../types';
import { galleryItems } from '../data/galleryData';
import { CornerOrnament, OrnateDivider, DiyaGraphic } from './DecorativeBorders';
import { royalAudio } from '../utils/audioSynth';

interface CulturalGalleryProps {
  lang: Language;
}

// Decorative Cultural Fallback component when an image fails or is loading
const GalleryImageWithFallback: React.FC<{
  item: GalleryItem;
  lang: Language;
  className?: string;
}> = ({ item, lang, className = '' }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full bg-gradient-to-br from-maroon-950 via-maroon-900 to-black overflow-hidden flex items-center justify-center ${className}`}>
      {/* Decorative Indian Pattern Fallback (always rendered underneath) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center select-none pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-400/30 flex items-center justify-center mb-2 shadow-inner">
          <DiyaGraphic isLit={true} size="sm" />
        </div>
        <span className="font-heading font-semibold text-xs text-gold-300 line-clamp-1">
          {lang === 'hi' ? item.titleHi : item.titleEn}
        </span>
        <span className="text-[10px] text-gold-400/60 uppercase tracking-widest mt-1">
          {lang === 'hi' ? item.tagHi : item.tagEn}
        </span>
      </div>

      {/* Main High-Resolution Photo */}
      {!hasError && (
        <img
          src={item.imageUrl}
          alt={lang === 'hi' ? item.titleHi : item.titleEn}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading="lazy"
          className={`relative z-10 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter brightness-95 group-hover:brightness-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Subtle Dark Vignette Overlay for Crisp Typography */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-maroon-950/90 via-maroon-950/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export const CulturalGallery: React.FC<CulturalGalleryProps> = ({ lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', labelHi: 'सम्पूर्ण दर्शन', labelEn: 'All Wonders' },
    { id: 'tradition', labelHi: 'पावन परंपराएँ', labelEn: 'Sacred Rituals' },
    { id: 'decor', labelHi: 'सजावट व आभा', labelEn: 'Lights & Decor' },
    { id: 'sweets', labelHi: 'उत्सव मिष्ठान्न', labelEn: 'Festive Sweets' },
    { id: 'palace', labelHi: 'शाही महल व वास्तु', labelEn: 'Royal Palaces' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  const handleOpenItem = (item: GalleryItem) => {
    royalAudio.playSparkleChime();
    setActiveItem(item);
  };

  const currentIndex = activeItem ? filteredItems.findIndex((it) => it.id === activeItem.id) : -1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setActiveItem(filteredItems[currentIndex - 1]);
      royalAudio.playSparkleChime();
    } else {
      setActiveItem(filteredItems[filteredItems.length - 1]);
      royalAudio.playSparkleChime();
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < filteredItems.length - 1) {
      setActiveItem(filteredItems[currentIndex + 1]);
      royalAudio.playSparkleChime();
    } else {
      setActiveItem(filteredItems[0]);
      royalAudio.playSparkleChime();
    }
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeItem) return;
      if (e.key === 'Escape') {
        setActiveItem(null);
      } else if (e.key === 'ArrowRight' && currentIndex !== -1) {
        const nextIdx = (currentIndex + 1) % filteredItems.length;
        setActiveItem(filteredItems[nextIdx]);
      } else if (e.key === 'ArrowLeft' && currentIndex !== -1) {
        const prevIdx = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        setActiveItem(filteredItems[prevIdx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItem, currentIndex, filteredItems]);

  return (
    <section id="gallery" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-semibold mb-3">
          <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
          <span className={lang === 'hi' ? 'font-devanagari' : ''}>
            {lang === 'hi' ? 'भारतीय संस्कृति व दीपावली धरोहर' : 'Sacred Heritage & Visual Splendor'}
          </span>
          <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
        </div>

        <h2 className={lang === 'hi' ? "font-devanagari font-bold text-3xl sm:text-4xl md:text-5xl text-ivory-100" : "font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-ivory-100 tracking-tight"}>
          {lang === 'hi' ? 'भारतीय सांस्कृतिक उत्सव गैलरी 🎨' : 'Indian Cultural Festive Gallery 🎨'}
        </h2>

        <p className="mt-3 text-sm sm:text-base text-gold-300/80 max-w-2xl mx-auto font-devanagari">
          {lang === 'hi'
            ? 'रंगोली, पीतल के दीप, गेंदे के फूल, काजू कतली और राजसी महलों की जगमगाहट से सजा भारतीय पर्व का हर रंग।'
            : 'Explore traditional rangoli, glowing brass lamps, marigold torans, artisanal sweets, and royal palatial architecture.'}
        </p>

        <OrnateDivider className="max-w-md mx-auto" />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-gold-600 to-gold-400 text-maroon-900 shadow-gold-glow font-bold'
                  : 'bg-maroon-800/80 hover:bg-maroon-700/80 text-ivory-200 border border-gold-500/30'
              }`}
            >
              <span className={lang === 'hi' ? 'font-devanagari font-semibold' : ''}>
                {lang === 'hi' ? cat.labelHi : cat.labelEn}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => handleOpenItem(item)}
            className="group relative cursor-pointer royal-card-glow rounded-2xl overflow-hidden border border-gold-500/35 hover:border-gold-400 shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Image Container with Safe Fallback */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-maroon-950">
              <GalleryImageWithFallback item={item} lang={lang} />

              {/* Tag Badge */}
              <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-maroon-900/90 text-gold-300 border border-gold-500/40 backdrop-blur-md">
                {lang === 'hi' ? item.tagHi : item.tagEn}
              </span>

              {/* Quick View Hover Pill */}
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-maroon-900/95 text-gold-300 text-xs font-semibold border border-gold-400 shadow-xl backdrop-blur-md">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'विस्तार से देखें' : 'View Detail'}</span>
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-gold-200 group-hover:text-gold-300 transition-colors line-clamp-1 mb-1">
                  {lang === 'hi' ? item.titleHi : item.titleEn}
                </h3>
                <p className="font-devanagari text-xs text-ivory-200/80 line-clamp-2 leading-relaxed">
                  {lang === 'hi' ? item.descriptionHi : item.descriptionEn}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-gold-500/20 flex items-center justify-between text-[10px] text-gold-400/80 font-medium">
                <span>{lang === 'hi' ? 'शाही उत्सव धरोहर' : 'Royal Diwali Exhibit'}</span>
                <Sparkles className="w-3 h-3 text-gold-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal with Arrows & Keyboard Nav */}
      <AnimatePresence>
        {activeItem && (
          <div
            onClick={() => setActiveItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-2xl w-full royal-card-glow rounded-3xl overflow-hidden border-2 border-gold-500/50 shadow-2xl p-6 sm:p-8"
            >
              <CornerOrnament position="top-left" className="absolute top-3 left-3 w-8 h-8" />
              <CornerOrnament position="top-right" className="absolute top-3 right-3 w-8 h-8" />

              {/* Close Button */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-maroon-800 text-gold-300 hover:text-white border border-gold-500/40 hover:bg-maroon-700 transition z-20"
                aria-label="Close detail modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/3 -translate-y-1/2 p-2 rounded-full bg-maroon-900/90 text-gold-300 hover:text-white border border-gold-400/50 hover:bg-maroon-800 transition z-20 shadow-lg"
                title="Previous Wonder"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/3 -translate-y-1/2 p-2 rounded-full bg-maroon-900/90 text-gold-300 hover:text-white border border-gold-400/50 hover:bg-maroon-800 transition z-20 shadow-lg"
                title="Next Wonder"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Modal Image */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-5 border border-gold-500/30 bg-maroon-950">
                <GalleryImageWithFallback item={activeItem} lang={lang} />
                <span className="absolute bottom-3 left-3 z-20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-maroon-900/90 text-gold-300 border border-gold-500/40">
                  {lang === 'hi' ? activeItem.tagHi : activeItem.tagEn}
                </span>
              </div>

              {/* Modal Details */}
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-gold-300 mb-2">
                {lang === 'hi' ? activeItem.titleHi : activeItem.titleEn}
              </h3>

              <p className="font-devanagari text-base sm:text-lg text-ivory-100 leading-relaxed mb-4">
                {lang === 'hi' ? activeItem.descriptionHi : activeItem.descriptionEn}
              </p>

              <OrnateDivider className="my-4" />

              <div className="flex items-center justify-between">
                <span className="text-xs text-gold-400/70 font-medium">
                  {currentIndex + 1} / {filteredItems.length}
                </span>
                <button
                  onClick={() => setActiveItem(null)}
                  className="px-6 py-2 rounded-full font-heading font-semibold text-xs text-maroon-900 bg-gradient-to-r from-gold-300 to-amber-400 hover:from-gold-200 hover:to-amber-300 shadow-md transition"
                >
                  {lang === 'hi' ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
