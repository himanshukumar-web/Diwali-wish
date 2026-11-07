import React, { useState, useEffect } from 'react';
import { Language, PlanId, ThemeId } from './types';
import { getPersonalGreetingParagraphs, getPersonalizedHeadings } from './data/wishesData';
import { THEMES, getThemeById } from './data/plansData';
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
import { PlansSection } from './components/PlansSection';
import { CustomizationSection } from './components/CustomizationSection';
import { PaymentModal } from './components/PaymentModal';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { CustomInquiryModal } from './components/CustomInquiryModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Toast } from './components/Toast';

export function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [lang, setLang] = useState<Language>('hi');
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Navigation View State: 'home' | 'plans' | 'order-success' | 'admin'
  const [currentView, setCurrentView] = useState<'home' | 'plans' | 'order-success' | 'admin'>('home');
  const [successOrderId, setSuccessOrderId] = useState<string>('');

  // Payment & Custom Inquiry Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<PlanId>('premium');
  const [isCustomInquiryOpen, setIsCustomInquiryOpen] = useState<boolean>(false);

  // Centralized Personalization State & Theme
  const [recipientName, setRecipientName] = useState<string>('Dear');
  const [senderName, setSenderName] = useState<string>('');
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>('maroon_gold');
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);

  // URL Routing & Query Parsing
  useEffect(() => {
    // 1. Language preference
    const savedLang = localStorage.getItem('diwali_lang') as Language;
    if (savedLang === 'hi' || savedLang === 'en') {
      setLang(savedLang);
    }

    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);

      // Check routes
      if (path === '/plans' || path.startsWith('/plans')) {
        setCurrentView('home');
        setHasEntered(true);
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, '', '/#customize');
        }
        setTimeout(() => {
          const el = document.getElementById('customize');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      } else if (window.location.hash === '#customize') {
        setCurrentView('home');
        setHasEntered(true);
        setTimeout(() => {
          const el = document.getElementById('customize');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      } else if (path === '/admin' || path.startsWith('/admin')) {
        setCurrentView('admin');
        setHasEntered(true);
      } else if (path.startsWith('/order/success/')) {
        const orderIdFromPath = path.replace('/order/success/', '').replace(/\/$/, '');
        if (orderIdFromPath) {
          setSuccessOrderId(orderIdFromPath);
          setCurrentView('order-success');
          setHasEntered(true);
        }
      }

      // Check query params: ?order=... or ?slug=...
      const orderParam = urlParams.get('order');
      const slugParam = urlParams.get('slug');

      if (orderParam && urlParams.get('success') === 'true') {
        setSuccessOrderId(orderParam);
        setCurrentView('order-success');
        setHasEntered(true);
      } else if (orderParam || slugParam) {
        // Fetch customized greeting details
        fetch(`/api/get-order?${orderParam ? `orderId=${encodeURIComponent(orderParam)}` : `slug=${encodeURIComponent(slugParam!)}`}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.order) {
              const o = data.order;
              if (o.recipientName) setRecipientName(o.recipientName);
              if (o.customerName) setSenderName(o.customerName);
              if (o.theme) setActiveThemeId(o.theme as ThemeId);
            }
          })
          .catch(() => {});
      }

      // Query param ?from=...
      const fromParam = urlParams.get('from');
      if (fromParam) {
        const cleanSender = decodeURIComponent(fromParam).trim();
        if (cleanSender) {
          setSenderName(cleanSender);
          setIsNameModalOpen(true);
        }
      }

      // 3. Saved recipient name in local storage
      const savedRecipient = localStorage.getItem('diwali_recipient');
      if (savedRecipient && savedRecipient.trim()) {
        setRecipientName(savedRecipient.trim());
      } else if (!window.location.search.includes('from=') && !orderParam && !slugParam) {
        // First time visitor: show prompt
        setIsNameModalOpen(true);
      }
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

  const handleSelectPlan = (planId: PlanId) => {
    setSelectedPlanForPayment(planId);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (orderId: string) => {
    setIsPaymentModalOpen(false);
    setSuccessOrderId(orderId);
    setCurrentView('order-success');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/order/success/${orderId}`);
    }
  };

  const scrollToCustomize = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setHasEntered(true);
      if (typeof window !== 'undefined') window.history.pushState({}, '', '/#customize');
      setTimeout(() => {
        const el = document.getElementById('customize');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      if (typeof window !== 'undefined') window.history.pushState({}, '', '#customize');
      const el = document.getElementById('customize');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    if (typeof window !== 'undefined') window.history.pushState({}, '', '/');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const currentTheme = getThemeById(activeThemeId);

  return (
    <div
      className="min-h-screen text-ivory-100 relative selection:bg-gold-500 selection:text-maroon-900 transition-colors duration-700"
      style={{ background: currentTheme.bgGradient }}
    >
      {/* Floating Golden Sparks, Marigold Petals & Interactive Fireworks */}
      <ParticleBackground interactive={true} />

      {/* Name Personalization Modal */}
      <NameModal
        isOpen={isNameModalOpen && currentView === 'home'}
        onClose={() => setIsNameModalOpen(false)}
        onSubmitName={handleNameSubmit}
        senderName={senderName}
        currentRecipientName={recipientName}
        lang={lang}
      />

      {/* Razorpay Checkout & Customer Info Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedPlanId={selectedPlanForPayment}
        lang={lang}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Custom Inquiry Modal (₹10–₹100) */}
      <CustomInquiryModal
        isOpen={isCustomInquiryOpen}
        onClose={() => setIsCustomInquiryOpen(false)}
        lang={lang}
      />

      {/* Cinematic Welcome Screen (only on Home view) */}
      {!hasEntered && currentView === 'home' && (
        <CinematicWelcome
          lang={lang}
          recipientName={recipientName}
          senderName={senderName}
          onEnter={handleEnterExperience}
        />
      )}

      {/* Main App Container */}
      {(hasEntered || currentView !== 'home') && (
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
            onOpenPlans={scrollToCustomize}
            onOpenAdmin={() => {
              setCurrentView('admin');
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin');
            }}
            onBackToHome={handleBackToHome}
            currentView={currentView}
          />

          {/* VIEW 1: Plans & Customization Page */}
          {currentView === 'plans' && (
            <PlansSection
              lang={lang}
              onSelectPlan={handleSelectPlan}
              onCustomInquiry={() => setIsCustomInquiryOpen(true)}
              onBackToHome={handleBackToHome}
            />
          )}

          {/* VIEW 2: Order Success Page */}
          {currentView === 'order-success' && (
            <OrderSuccessPage
              orderId={successOrderId}
              lang={lang}
              onBackToHome={handleBackToHome}
            />
          )}

          {/* VIEW 3: Admin Dashboard */}
          {currentView === 'admin' && (
            <AdminDashboard
              lang={lang}
              onBackToHome={handleBackToHome}
            />
          )}

          {/* VIEW 4: Default Homepage Diwali Experience */}
          {currentView === 'home' && (
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

              {/* Section 6: Indian Cultural Festive Gallery */}
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

              {/* Section 9: Complete Personalized Royal Diwali Customization & Plans */}
              <CustomizationSection
                id="customize"
                lang={lang}
                onPaymentSuccess={handlePaymentSuccess}
                onCustomInquiry={() => setIsCustomInquiryOpen(true)}
              />

              {/* Section 10: Final Closing Section & Sender Signature */}
              <FinalClosing
                lang={lang}
                recipientName={recipientName}
                senderName={senderName}
                onReplayWelcome={() => setHasEntered(false)}
              />
            </main>
          )}
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
