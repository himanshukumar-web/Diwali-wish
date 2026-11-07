import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Share2, Copy, Menu, X, Sparkles, Edit3 } from 'lucide-react';
import { Language } from '../types';
import { generateWhatsAppMessage } from '../data/wishesData';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onCopyWishes: () => void;
  recipientName: string;
  senderName: string;
  onEditName: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  isPlayingMusic,
  onToggleMusic,
  onCopyWishes,
  recipientName,
  senderName,
  onEditName,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Detect active section
      const sections = ['home', 'wishes', 'diyas', 'gallery', 'surprise', 'share', 'closing'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', labelHi: 'मुख्य द्वार', labelEn: 'Home' },
    { id: 'wishes', labelHi: 'शुभकामनाएँ', labelEn: 'Wishes' },
    { id: 'diyas', labelHi: 'दीप जलाएँ', labelEn: 'Light Diyas' },
    { id: 'gallery', labelHi: 'उत्सव गैलरी', labelEn: 'Gallery' },
    { id: 'surprise', labelHi: 'सरप्राइज 🎁', labelEn: 'Surprise 🎁' },
    { id: 'share', labelHi: 'शेयर करें ❤️', labelEn: 'Share ❤️' },
  ];

  const handleShareWhatsApp = () => {
    const effectiveSender = senderName || recipientName || 'Someone Special';
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?from=${encodeURIComponent(effectiveSender)}`
      : '';
    const message = generateWhatsAppMessage(effectiveSender, shareUrl);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-maroon-900/95 backdrop-blur-md border-b border-gold-500/30 py-2.5 shadow-2xl'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Recipient Dedicated Badge */}
        <div className="flex items-center space-x-2 text-left">
          <button
            onClick={() => scrollTo('home')}
            className="flex items-center space-x-2 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-600 to-amber-300 flex items-center justify-center p-0.5 shadow-gold-glow">
              <span className="text-maroon-900 font-bold text-base select-none">🪔</span>
            </div>
            <div>
              <span className="font-devanagari font-bold text-sm sm:text-base gold-text-gradient block group-hover:text-gold-200 transition">
                ॥ शुभ दीपावली ॥
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] text-ivory-200/90 tracking-wider block font-medium">
                  For {recipientName || 'Dear'} & Family
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditName();
                  }}
                  className="p-0.5 text-gold-400 hover:text-gold-200 transition"
                  title="Change Name"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all duration-200 ${
                activeSection === link.id
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-sm'
                  : 'text-ivory-100/80 hover:text-gold-300 hover:bg-maroon-700/40'
              }`}
            >
              <span className={lang === 'hi' ? 'font-devanagari' : ''}>
                {lang === 'hi' ? link.labelHi : link.labelEn}
              </span>
            </button>
          ))}
        </nav>

        {/* Action Controls: Language Toggle, Music Player, Share, Copy */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-maroon-800/80 rounded-full p-0.5 border border-gold-500/40 shadow-inner">
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                lang === 'hi'
                  ? 'bg-gradient-to-r from-gold-600 to-gold-400 text-maroon-900 shadow-md font-hindi'
                  : 'text-ivory-200 hover:text-gold-300'
              }`}
              title="हिन्दी में देखें"
            >
              हिन्दी
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                lang === 'en'
                  ? 'bg-gradient-to-r from-gold-600 to-gold-400 text-maroon-900 shadow-md'
                  : 'text-ivory-200 hover:text-gold-300'
              }`}
              title="Switch to English"
            >
              EN
            </button>
          </div>

          {/* Music Toggle */}
          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-full border transition-all duration-200 flex items-center space-x-1.5 ${
              isPlayingMusic
                ? 'bg-amber-600/20 border-gold-400 text-gold-300 shadow-gold-glow'
                : 'bg-maroon-800/80 border-gold-500/30 text-ivory-200/70 hover:text-gold-300'
            }`}
            title={isPlayingMusic ? (lang === 'hi' ? 'संगीत बंद करें' : 'Mute Music') : (lang === 'hi' ? 'संगीत शुरू करें' : 'Play Classical Flute Music')}
            aria-label="Toggle Background Music"
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="w-4 h-4 text-gold-400 animate-pulse" />
                <div className="hidden sm:flex items-end space-x-0.5 h-3">
                  <span className="w-0.5 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-0.5 h-3 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-0.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </>
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Copy Wishes Quick Button */}
          <button
            onClick={onCopyWishes}
            className="p-2 rounded-full bg-maroon-800/80 border border-gold-500/30 text-ivory-200 hover:text-gold-300 hover:border-gold-400 transition"
            title={lang === 'hi' ? 'शुभकामनाएँ कॉपी करें' : 'Copy Heartfelt Wishes'}
            aria-label="Copy Wishes"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* WhatsApp Share Button */}
          <button
            onClick={handleShareWhatsApp}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-700/80 to-emerald-600/90 hover:from-emerald-600 hover:to-emerald-500 text-ivory-50 text-xs font-medium rounded-full border border-emerald-400/40 shadow-sm transition"
            title="Share via WhatsApp"
            aria-label="Share on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-maroon-800 border border-gold-500/30 text-gold-300 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-maroon-900/98 border-b border-gold-500/40 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl animate-fade-in shadow-2xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeSection === link.id
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                  : 'text-ivory-100 hover:bg-maroon-800/60'
              }`}
            >
              <span className={lang === 'hi' ? 'font-devanagari' : ''}>
                {lang === 'hi' ? link.labelHi : link.labelEn}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-gold-400 opacity-60" />
            </button>
          ))}
          <div className="pt-3 border-t border-gold-500/20 flex items-center justify-between">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 mr-2 flex items-center justify-center space-x-2 py-2 bg-emerald-700 rounded-lg text-xs font-semibold text-white"
            >
              <Share2 className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </button>
            <button
              onClick={onCopyWishes}
              className="flex-1 ml-2 flex items-center justify-center space-x-2 py-2 bg-maroon-800 border border-gold-500/40 rounded-lg text-xs font-semibold text-gold-300"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Wishes</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
