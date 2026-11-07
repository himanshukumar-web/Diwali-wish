import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { getPersonalGreetingParagraphs, getPersonalizedHeadings } from './data/wishesData';
import { royalAudio } from './utils/audioSynth';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './components/Navbar';
import { CinematicWelcome } from './components/CinematicWelcome';
import { HeroSection } from './components/HeroSection';
import { PersonalGreeting } from './components/PersonalGreeting';
import { InteractiveDiyas } from './components/InteractiveDiyas';
import { FestiveCards } from './components/FestiveCards';
import { CulturalGallery } from './components/CulturalGallery';
import { SurpriseSection } from './components/SurpriseSection';
import { ShareSection } from './components/ShareSection';
import { FinalClosing } from './components/FinalClosing';
import { NameModal } from './components/NameModal';
import { Toast } from './components/Toast';

export function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [lang, setLang] = useState<Language>('hi');
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Centralized Personalization State
  const [recipientName, setRecipientName] = useState<string>('Dear');
  const [senderName, setSenderName] = useState<string>('');
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);

  // Parse URL query parameter `?from=...` and saved recipient
  useEffect(() => {
    // 1. Language preference
    const savedLang = localStorage.getItem('diwali_lang') as Language;
    if (savedLang === 'hi' || savedLang === 'en') {
      setLang(savedLang);
    }

    // 2. Query param ?from=...
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const fromParam = urlParams.get('from');
        if (fromParam) {
          const cleanSender = decodeURIComponent(fromParam).trim();
          if (cleanSender) {
            setSenderName(cleanSender);
            // If opened via shared link, prompt modal for recipient name after entering
            setIsNameModalOpen(true);
          }
        }
      } catch {
        // Safe fallback
      }
    }

    // 3. Saved recipient name in local storage
    const savedRecipient = localStorage.getItem('diwali_recipient');
    if (savedRecipient && savedRecipient.trim()) {
      setRecipientName(savedRecipient.trim());
    } else if (!window.location.search.includes('from=')) {
      // First time visitor: show prompt
      setIsNameModalOpen(true);
    }
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('diwali_lang', newLang);
  };

  const handleEnterExperience = () => {
    setHasEntered(true);
    royalAudio.start();
    setIsPlayingMusic(true);
  };

  const handleToggleMusic = () => {
    const playing = royalAudio.toggle();
    setIsPlayingMusic(playing);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const handleNameSubmit = (enteredName: string) => {
    const safeName = enteredName.trim() || 'Dear';
    setRecipientName(safeName);
    localStorage.setItem('diwali_recipient', safeName);
    triggerToast(
      lang === 'hi'
        ? `✨ स्वागत है ${safeName}! शुभकामनाएँ आपके नाम से संजो दी गई हैं।`
        : `✨ Welcome ${safeName}! Greetings personalized for you.`
    );
  };

  const handleCopyWishes = () => {
    const { paragraphsHi, paragraphsEn } = getPersonalGreetingParagraphs(recipientName, senderName);
    const headings = getPersonalizedHeadings(recipientName, senderName);
    const wishesList = lang === 'hi' ? paragraphsHi : paragraphsEn;
    const fullText = `🪔 शुभ दीपावली to ${recipientName} & Your Wonderful Family!\n\n${wishesList.join('\n\n')}\n\n${headings.signature}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText).then(() => {
        setCopied(true);
        triggerToast(
          lang === 'hi'
            ? '✨ हार्दिक शुभकामनाएँ कॉपी हो गई हैं!'
            : '✨ Heartfelt Diwali wishes copied to clipboard!'
        );
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const scrollToDiyas = () => {
    const el = document.getElementById('diyas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-maroon-900 text-ivory-100 relative selection:bg-gold-500 selection:text-maroon-900">
      {/* Floating Golden Sparks, Marigold Petals & Interactive Fireworks */}
      <ParticleBackground interactive={true} />

      {/* Name Personalization Modal */}
      <NameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onSubmitName={handleNameSubmit}
        senderName={senderName}
        currentRecipientName={recipientName}
        lang={lang}
      />

      {/* Cinematic Welcome Screen */}
      {!hasEntered && (
        <CinematicWelcome
          lang={lang}
          recipientName={recipientName}
          senderName={senderName}
          onEnter={handleEnterExperience}
        />
      )}

      {/* Main Website Experience */}
      {hasEntered && (
        <div className="relative z-20 animate-fade-in">
          {/* Navigation Bar */}
          <Navbar
            lang={lang}
            onLanguageChange={handleLanguageChange}
            isPlayingMusic={isPlayingMusic}
            onToggleMusic={handleToggleMusic}
            onCopyWishes={handleCopyWishes}
            recipientName={recipientName}
            senderName={senderName}
            onEditName={() => setIsNameModalOpen(true)}
          />

          {/* Main Content Sections */}
          <main>
            {/* Hero / Auspicious Welcome */}
            <HeroSection
              lang={lang}
              recipientName={recipientName}
              senderName={senderName}
              onExploreDiyas={scrollToDiyas}
              onEditName={() => setIsNameModalOpen(true)}
            />

            {/* Section 3: Personalized Family Greeting */}
            <PersonalGreeting
              lang={lang}
              recipientName={recipientName}
              senderName={senderName}
              onCopyWishes={handleCopyWishes}
              copied={copied}
            />

            {/* Section 4: Interactive Diya Lighting Experience (9 Diyas) */}
            <InteractiveDiyas
              lang={lang}
            />

            {/* Section 5: Six Festive Wishes Cards */}
            <FestiveCards
              lang={lang}
            />

            {/* Section 6: Indian Cultural Festive Gallery (With High-Resolution Verified Images & Fallbacks) */}
            <CulturalGallery
              lang={lang}
            />

            {/* Section 7: Special Surprise Section */}
            <SurpriseSection
              lang={lang}
              recipientName={recipientName}
              senderName={senderName}
            />

            {/* Section 8: Dedicated Personalized Sharing Section */}
            <ShareSection
              lang={lang}
              currentUserName={recipientName}
              onCopySuccess={() =>
                triggerToast(
                  lang === 'hi'
                    ? '✨ पर्सनलाइज़्ड लिंक कॉपी हो गया! अब अपनों के साथ साझा करें।'
                    : '✨ Personalized link copied! Share with your loved ones.'
                )
              }
            />

            {/* Section 10: Final Closing Section, Sender Signature & Creator Credit */}
            <FinalClosing
              lang={lang}
              recipientName={recipientName}
              senderName={senderName}
              onReplayWelcome={() => setHasEntered(false)}
            />
          </main>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        show={showToast}
        message={toastMessage}
      />
    </div>
  );
}

export default App;
