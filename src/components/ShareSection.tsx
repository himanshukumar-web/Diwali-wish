import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, MessageCircle, Sparkles, Send, User } from 'lucide-react';
import { Language } from '../types';
import { generateWhatsAppMessage } from '../data/wishesData';
import { CornerOrnament, OrnateDivider, DiyaGraphic } from './DecorativeBorders';
import { royalAudio } from '../utils/audioSynth';

interface ShareSectionProps {
  lang: Language;
  currentUserName: string;
  onCopySuccess: () => void;
}

export const ShareSection: React.FC<ShareSectionProps> = ({
  lang,
  currentUserName,
  onCopySuccess,
}) => {
  const [senderNameInput, setSenderNameInput] = useState(
    currentUserName && currentUserName !== 'Dear' ? currentUserName : ''
  );
  const [copiedLink, setCopiedLink] = useState(false);

  // Derive the active sharing URL based on the current origin and sender name input
  const effectiveSender = senderNameInput.trim() || (currentUserName !== 'Dear' ? currentUserName : 'Someone Special');
  
  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?from=${encodeURIComponent(effectiveSender)}`;
  };

  const shareUrl = getShareUrl();

  const handleCopyLink = () => {
    royalAudio.playSparkleChime();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        onCopySuccess();
        setTimeout(() => setCopiedLink(false), 3000);
      });
    }
  };

  const handleWhatsAppShare = () => {
    royalAudio.playSparkleChime();
    const message = generateWhatsAppMessage(effectiveSender, shareUrl);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNativeShare = async () => {
    royalAudio.playSparkleChime();
    const message = generateWhatsAppMessage(effectiveSender, shareUrl);
    if (navigator.share) {
      try {
        await navigator.share({
          title: '॥ शुभ दीपावली ॥ Royal Diwali Greeting',
          text: message,
          url: shareUrl,
        });
      } catch {
        // Fallback to copy link if cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <section id="share" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative royal-card-glow rounded-3xl p-6 sm:p-10 md:p-12 border-2 border-gold-400/50 shadow-2xl overflow-hidden text-center"
      >
        <CornerOrnament position="top-left" className="absolute top-2 left-2 w-8 h-8 opacity-80" />
        <CornerOrnament position="top-right" className="absolute top-2 right-2 w-8 h-8 opacity-80" />
        <CornerOrnament position="bottom-left" className="absolute bottom-2 left-2 w-8 h-8 opacity-80" />
        <CornerOrnament position="bottom-right" className="absolute bottom-2 right-2 w-8 h-8 opacity-80" />

        {/* Center Diya */}
        <div className="flex justify-center -mt-2 mb-4">
          <DiyaGraphic isLit={true} size="md" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span className={lang === 'hi' ? 'font-devanagari' : ''}>
            {lang === 'hi' ? 'अपनी ओर से शुभकामनाएँ भेजें' : 'Share with Your Own Name'}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
        </div>

        {/* Heading & Subheading (verbatim from prompt) */}
        <h2 className={lang === 'hi' ? "font-devanagari font-bold text-3xl sm:text-4xl text-ivory-50 mb-2" : "font-heading font-bold text-3xl sm:text-4xl text-ivory-50 mb-2"}>
          {lang === 'hi' ? "खुशियाँ बाँटें, रोशनी फैलाएँ ❤️" : "Share Joy, Spread Light ❤️"}
        </h2>

        <p className={lang === 'hi' ? "font-devanagari text-base sm:text-lg text-gold-200/90 max-w-xl mx-auto mb-6" : "font-body text-sm sm:text-base text-gold-200/90 max-w-xl mx-auto mb-6"}>
          {lang === 'hi' ? "अपनों तक प्यार और दीपावली की शुभकामनाएँ पहुँचाएँ।" : "Send warmth and heartfelt Diwali wishes to your loved ones."}
        </p>

        <OrnateDivider className="max-w-xs mx-auto mb-6" />

        {/* Sender Name Configuration Box */}
        <div className="max-w-md mx-auto mb-6 p-4 rounded-2xl bg-maroon-950/70 border border-gold-500/30 text-left">
          <label className="block text-xs font-semibold text-gold-300 uppercase tracking-wider mb-2">
            <span className="flex items-center space-x-1.5">
              <User className="w-4 h-4 text-gold-400" />
              <span className={lang === 'hi' ? 'font-devanagari' : ''}>
                {lang === 'hi' ? 'आपका नाम (प्रेषक / Sender):' : 'Your Name (Sender):'}
              </span>
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-600 z-10">
              <User className="w-4 h-4 text-gold-600" />
            </div>
            <input
              type="text"
              value={senderNameInput}
              onChange={(e) => setSenderNameInput(e.target.value)}
              placeholder={lang === 'hi' ? 'अपना नाम यहाँ लिखें (उदा. राहुल)...' : 'Enter your name (e.g. Rahul)...'}
              maxLength={40}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#3B0D16',
                WebkitTextFillColor: '#3B0D16',
                caretColor: '#D4AF37',
                fontWeight: 600,
                fontSize: '16px',
              }}
              className="name-input-field w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gold-400 text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/40 font-semibold shadow-inner"
            />
          </div>
          <p className="text-[11px] text-gold-400/70 mt-1.5">
            {lang === 'hi'
              ? '✨ जो भी यह लिंक खोलेगा, उसे आपकी ओर से शुभकामना संदेश दिखेगा!'
              : '✨ Anyone who opens your link will see a greeting sent with love from you!'}
          </p>
        </div>

        {/* Generated URL Display with Quick Copy */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex items-center rounded-2xl bg-maroon-950/90 border border-gold-500/40 p-1.5 overflow-hidden">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent px-3 py-1.5 text-xs text-gold-200 flex-1 outline-none truncate select-all"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400/50 text-gold-300 text-xs font-semibold transition"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? (lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (lang === 'hi' ? 'लिंक कॉपी करें' : 'Copy Link')}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons: WhatsApp Share & Native Share */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-xs sm:text-sm shadow-lg transition transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span className={lang === 'hi' ? 'font-devanagari font-bold' : ''}>
              {lang === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share on WhatsApp'}
            </span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-maroon-800/90 hover:bg-maroon-700/90 border border-gold-400/60 text-gold-300 font-semibold text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className={lang === 'hi' ? 'font-devanagari font-bold' : ''}>
              {copiedLink
                ? (lang === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link Copied!')
                : (lang === 'hi' ? 'पर्सनलाइज़्ड लिंक कॉपी करें' : 'Copy Personalized Link')}
            </span>
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-maroon-900 font-bold text-xs sm:text-sm shadow-gold-glow transition transform hover:-translate-y-0.5"
            >
              <Share2 className="w-4 h-4" />
              <span className={lang === 'hi' ? 'font-devanagari' : ''}>
                {lang === 'hi' ? 'अन्य माध्यम से साझा करें' : 'Share via Device'}
              </span>
            </button>
          )}
        </div>
      </motion.div>
    </section>
  );
};

