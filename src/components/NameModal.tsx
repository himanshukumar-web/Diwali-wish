import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, User, X } from 'lucide-react';
import { Language } from '../types';
import { CornerOrnament, DiyaGraphic, OrnateDivider } from './DecorativeBorders';
import { royalAudio } from '../utils/audioSynth';

interface NameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitName: (name: string) => void;
  senderName: string;
  currentRecipientName: string;
  lang: Language;
}

export const NameModal: React.FC<NameModalProps> = ({
  isOpen,
  onClose,
  onSubmitName,
  senderName,
  currentRecipientName,
  lang,
}) => {
  const [inputName, setInputName] = useState(
    currentRecipientName && currentRecipientName !== 'Dear' ? currentRecipientName : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    royalAudio.playSparkleChime();
    const cleanName = inputName.trim();
    onSubmitName(cleanName || 'Dear');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-lg royal-card-glow rounded-3xl p-6 sm:p-10 border-2 border-gold-400/60 shadow-2xl overflow-hidden text-center"
          >
            {/* Corner Filigrees */}
            <CornerOrnament position="top-left" className="absolute top-2 left-2 w-8 h-8 opacity-80" />
            <CornerOrnament position="top-right" className="absolute top-2 right-2 w-8 h-8 opacity-80" />
            <CornerOrnament position="bottom-left" className="absolute bottom-2 left-2 w-8 h-8 opacity-80" />
            <CornerOrnament position="bottom-right" className="absolute bottom-2 right-2 w-8 h-8 opacity-80" />

            {/* Close / Skip button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-maroon-800/80 text-gold-300 hover:text-white border border-gold-500/30 transition"
              title="Close"
              aria-label="Close name modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Diya Header */}
            <div className="flex justify-center -mt-2 mb-3">
              <DiyaGraphic isLit={true} size="md" />
            </div>

            {/* Sender Badge if opened via shared link */}
            {senderName && (
              <div className="inline-flex items-center space-x-1.5 px-4 py-1 rounded-full bg-saffron-500/20 border border-saffron-400/40 text-saffron-300 text-xs font-semibold mb-3">
                <Heart className="w-3.5 h-3.5 fill-current text-rose-400 animate-pulse" />
                <span className="font-devanagari">
                  {lang === 'hi' ? `${senderName} की तरफ से सस्नेह संदेश` : `A Special Gift from ${senderName}`}
                </span>
              </div>
            )}

            {/* Modal Heading */}
            <h2 className={lang === 'hi' ? "font-devanagari font-bold text-2xl sm:text-3xl text-gold-200 leading-snug mb-2" : "font-heading font-bold text-2xl sm:text-3xl text-gold-200 leading-snug mb-2"}>
              {senderName
                ? (lang === 'hi'
                    ? `${senderName} की तरफ से आपके लिए एक खास दीपावली संदेश! ❤️`
                    : `A Special Diwali Greeting from ${senderName} for You! ❤️`)
                : (lang === 'hi'
                    ? "आपके लिए एक खास दीपावली संदेश 🪔"
                    : "A Special Diwali Greeting for You 🪔")}
            </h2>

            {/* Prompt Question */}
            <p className={lang === 'hi' ? "font-devanagari text-base sm:text-lg text-ivory-100 font-medium mb-5" : "font-body text-sm sm:text-base text-ivory-200 mb-5"}>
              {lang === 'hi' ? "आपका शुभ नाम क्या है?" : "What is your auspicious name?"}
            </p>

            <OrnateDivider className="max-w-xs mx-auto mb-6" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
              <div className="relative">
                {/* User Icon on left */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gold-600 z-10">
                  <User className="w-5 h-5 text-gold-600" />
                </div>
                {/* Input with White Background & High Contrast Maroon Text */}
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder={lang === 'hi' ? "अपना नाम यहाँ लिखें..." : "Enter your name..."}
                  maxLength={40}
                  autoFocus
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#3B0D16',
                    WebkitTextFillColor: '#3B0D16',
                    caretColor: '#D4AF37',
                    fontWeight: 600,
                    fontSize: '18px',
                  }}
                  className="name-input-field w-full pl-12 pr-4 py-3 rounded-full border-2 border-gold-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/50 text-center font-semibold shadow-md outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-full font-bold text-sm sm:text-base text-maroon-900 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Sparkles className="w-4 h-4 text-maroon-900" />
                  <span className={lang === 'hi' ? 'font-devanagari font-bold' : 'font-heading'}>
                    {lang === 'hi' ? "✨ मेरी शुभकामनाएँ देखें" : "✨ See My Wishes"}
                  </span>
                </button>
              </div>
            </form>

            <button
              onClick={onClose}
              className="mt-4 text-xs text-gold-400/80 hover:text-gold-200 transition underline underline-offset-4"
            >
              {lang === 'hi' ? "बिना नाम के आगे बढ़ें" : "Continue without entering name"}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
