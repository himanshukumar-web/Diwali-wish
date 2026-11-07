import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ExternalLink,
  Download,
  Copy,
  Check,
  RefreshCw,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
  Send,
  AlertTriangle
} from 'lucide-react';
import { Language, ThemeId } from '../types';
import { THEMES, getPlanById } from '../data/plansData';
import { CornerOrnament, OrnateDivider } from './DecorativeBorders';
import { generateCardSvg, svgToPngBlob, downloadBlob } from '../utils/cardGenerator';

interface OrderSuccessPageProps {
  orderId: string;
  lang: Language;
  onBackToHome: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  orderId,
  lang,
  onBackToHome
}) => {
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let intervalId: any = null;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/get-order?orderId=${encodeURIComponent(orderId)}`);
        const data = await res.json();

        if (res.ok && data.success && data.order) {
          setOrder(data.order);
          setIsLoading(false);

          if (data.order.paymentVerified) {
            // Trigger celebratory royal confetti
            confetti({
              particleCount: 160,
              spread: 90,
              origin: { y: 0.5 },
              colors: ['#D4AF37', '#FF9933', '#FFF3DC', '#FFD700', '#B89225']
            });
            if (intervalId) clearInterval(intervalId);
          }
        } else {
          setError(data.error || 'Order not found');
          setIsLoading(false);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch order status');
        setIsLoading(false);
      }
    };

    fetchOrder();

    // Poll every 3 seconds if pending verification
    intervalId = setInterval(() => {
      if (!order || !order.paymentVerified) {
        fetchOrder();
      }
    }, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderId]);

  // Generate the clean, unwatermarked high-res SVG for this order
  const cardSvg = useMemo(() => {
    if (!order) return '';
    return generateCardSvg({
      id: order.id,
      customer_name: order.customerName,
      recipient_name: order.recipientName,
      greeting_message: order.greetingMessage,
      theme: order.theme,
      lang: lang,
      isWatermarked: false // Clean, watermark-free for paid customers
    });
  }, [order, lang]);

  const handleCopyLink = () => {
    if (order?.websiteUrl && navigator.clipboard) {
      navigator.clipboard.writeText(order.websiteUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  const handleDownloadCard = async () => {
    if (!order || !cardSvg) return;
    setIsDownloading(true);

    try {
      const pngBlob = await svgToPngBlob(cardSvg, 1080, 1350);
      const safeName = (order.recipientName || 'Himanshu')
        .trim()
        .replace(/[^\w\u0900-\u097F-]+/g, '_')
        .slice(0, 30) || 'Family';
      const filename = `Diwali-Greeting-${safeName}.png`;
      downloadBlob(pngBlob, filename);
    } catch (err) {
      console.error('Card download error:', err);
      // Fallback: download raw SVG if canvas conversion fails
      const safeName = (order.recipientName || 'Himanshu')
        .trim()
        .replace(/[^\w\u0900-\u097F-]+/g, '_')
        .slice(0, 30) || 'Family';
      const svgBlob = new Blob([cardSvg], { type: 'image/svg+xml;charset=utf-8' });
      downloadBlob(svgBlob, `Diwali-Greeting-${safeName}.svg`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!order) return;
    const shareUrl = order.websiteUrl || `${window.location.origin}/?order=${order.id}`;
    const text =
      `🪔 *॥ शुभ दीपावली ॥* ✨\n\n` +
      `प्रिय *${order.recipientName}* और आपके पूरे परिवार को दीपावली की हार्दिक शुभकामनाएँ! ❤️\n\n` +
      `"${order.greetingMessage}"\n\n` +
      `✨ *${order.customerName}* की तरफ से आपके लिए तैयार की गई विशेष राजसी दीपावली विशिंग वेबसाइट यहाँ देखें:\n` +
      `👉 ${shareUrl}\n\n` +
      `🎨 *Designed & Developed by Himanshu Kumar*\nWith Love ❤️`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center mb-4 animate-spin">
          <RefreshCw className="w-8 h-8 text-gold-400" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-gold-200">
          {lang === 'hi' ? 'भुगतान सत्यापन व वेबसाइट निर्माण जारी है...' : 'Verifying Payment & Generating Experience...'}
        </h2>
        <p className="text-xs text-gold-300/70 mt-2 font-devanagari">
          {lang === 'hi'
            ? 'कृपया प्रतीक्षा करें, आपकी व्यक्तिगत दीपावली वेबसाइट संजोई जा रही है।'
            : 'Please hold on, your personalized royal greeting is being crafted.'}
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
        <div className="p-6 rounded-3xl bg-maroon-950/80 border border-rose-500/50 shadow-2xl">
          <h2 className="font-heading font-bold text-2xl text-rose-300 mb-2">Order Notice</h2>
          <p className="text-xs text-ivory-100 mb-6">{error || 'Order could not be loaded.'}</p>
          <button
            onClick={onBackToHome}
            className="px-6 py-2.5 rounded-full bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-xs font-semibold"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const plan = getPlanById(order.planId);
  const theme = THEMES[order.theme as ThemeId] || THEMES.maroon_gold;
  const isPaid = order.paymentVerified || order.paymentStatus === 'paid';

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="royal-card-glow rounded-3xl p-6 sm:p-10 border-2 border-gold-400/60 shadow-2xl relative overflow-hidden"
      >
        <CornerOrnament position="top-left" className="absolute top-2 left-2 w-8 h-8 opacity-80" />
        <CornerOrnament position="top-right" className="absolute top-2 right-2 w-8 h-8 opacity-80" />

        {/* Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
        </div>

        {/* 3 Status Badges: Payment, Card Generation, WhatsApp Delivery */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {/* 1. Payment Status */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isPaid ? 'Payment Verified & Captured (Test Mode)' : 'Payment Processing'}</span>
          </div>

          {/* 2. Card Status */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs font-semibold">
            <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
            <span>High-Res Greeting Card Ready</span>
          </div>

          {/* 3. WhatsApp Delivery Status */}
          {order.whatsappDeliveryStatus === 'sent' ? (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Dispatched (ID: {order.whatsappMessageId?.slice(-8)})</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold">
              <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>WhatsApp API: Pending Server Setup (1-Click Share Ready)</span>
            </div>
          )}
        </div>

        <h1 className={lang === 'hi' ? 'font-devanagari font-bold text-3xl sm:text-4xl gold-text-gradient mb-2' : 'font-heading font-extrabold text-3xl sm:text-4xl gold-text-gradient mb-2'}>
          {lang === 'hi' ? 'बधाई हो! आपकी राजसी दीपावली भेंट तैयार है' : 'Congratulations! Your Royal Greeting is Ready'}
        </h1>

        <p className="text-xs sm:text-sm text-gold-200/90 max-w-xl mx-auto font-devanagari mb-6">
          {lang === 'hi'
            ? `प्रिय ${order.customerName}, आपके द्वारा ${order.recipientName} के लिए संजोई गई राजसी दीपावली वेबसाइट व कार्ड सफलतापूर्वक तैयार हो चुके हैं।`
            : `Dear ${order.customerName}, your personalized royal greeting for ${order.recipientName} is now live and ready to be shared.`}
        </p>

        {/* Order Summary Pill Box */}
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-maroon-950/80 border border-gold-500/30 text-left mb-6 space-y-2 text-xs">
          <div className="flex justify-between items-center text-gold-300/80">
            <span>Order Reference:</span>
            <span className="font-mono text-gold-200 font-semibold">{order.id}</span>
          </div>
          <div className="flex justify-between items-center text-gold-300/80">
            <span>Selected Plan:</span>
            <span className="font-semibold text-gold-200">{plan.nameEn} (₹{plan.priceInInr})</span>
          </div>
          <div className="flex justify-between items-center text-gold-300/80">
            <span>Theme:</span>
            <span className="font-semibold text-gold-200">{theme.nameEn}</span>
          </div>
          <div className="flex justify-between items-center text-gold-300/80">
            <span>Recipient:</span>
            <span className="font-semibold text-amber-300">{order.recipientName}</span>
          </div>
        </div>

        {/* LIVE INLINE CARD PREVIEW (Clean Paid Card, Zero Free-Watermark, 1080x1350) */}
        <div className="my-8 max-w-[460px] sm:max-w-[480px] mx-auto text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Your Clean High-Resolution Greeting Card</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">
              ✓ 1080 × 1350 • Clean
            </span>
          </div>

          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border-2 border-gold-400/60 shadow-2xl bg-black flex items-center justify-center [&>div]:w-full [&>div]:h-full [&>div>svg]:w-full [&>div>svg]:h-full [&>div>svg]:object-contain">
            <div
              dangerouslySetInnerHTML={{ __html: cardSvg }}
            />
          </div>
        </div>

        <OrnateDivider className="max-w-xs mx-auto mb-8" />

        {/* Action Buttons Grid */}
        <div className="space-y-4 max-w-lg mx-auto">
          {/* 1. Open Personalized Website */}
          {order.websiteUrl && (
            <a
              href={order.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-maroon-950 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{lang === 'hi' ? '✨ अपनी पर्सनलाइज़्ड वेबसाइट खोलें' : '✨ Open My Personalized Website'}</span>
            </a>
          )}

          {/* 2. Download Greeting Card PNG */}
          <button
            onClick={handleDownloadCard}
            disabled={isDownloading}
            className="w-full py-3 px-6 rounded-full font-semibold text-sm sm:text-base bg-maroon-900/90 hover:bg-gold-500/20 border-2 border-gold-400/60 text-gold-300 hover:text-gold-200 shadow-md flex items-center justify-center space-x-2 transition"
          >
            <Download className="w-4 h-4 text-gold-400" />
            <span>
              {isDownloading
                ? (lang === 'hi' ? 'कार्ड तैयार हो रहा है...' : 'Generating PNG Card...')
                : (lang === 'hi' ? 'डाउनलोड शुभकामना कार्ड (PNG)' : 'Download Greeting Card (PNG)')}
            </span>
          </button>

          {/* 3. Share Website on WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-3 px-6 rounded-full font-semibold text-sm sm:text-base bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 shadow-md flex items-center justify-center space-x-2 transition"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share Website on WhatsApp'}</span>
          </button>

          {/* Quick Copy Link Box */}
          {order.websiteUrl && (
            <div className="flex items-center rounded-2xl bg-black/60 border border-gold-500/40 p-1.5 mt-2">
              <input
                type="text"
                readOnly
                value={order.websiteUrl}
                className="bg-transparent px-3 py-1.5 text-xs text-gold-200 flex-1 outline-none truncate select-all"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-xs font-semibold transition"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Share Card Instructions */}
        <div className="mt-8 pt-6 border-t border-gold-500/30 text-left max-w-lg mx-auto text-xs text-gold-300/80 space-y-1.5">
          <p className="font-semibold text-gold-300 uppercase tracking-wider">
            {lang === 'hi' ? 'कार्ड शेयर करने के निर्देश (Sharing Tips):' : 'Card Sharing Instructions:'}
          </p>
          <p>• {lang === 'hi' ? '1. "Download Greeting Card" बटन पर क्लिक करके PNG इमेज अपने फोन या कंप्यूटर में सेव करें।' : '1. Click "Download Greeting Card" to save the high-res PNG image to your phone or desktop.'}</p>
          <p>• {lang === 'hi' ? '2. व्हाट्सएप या सोशल मीडिया पर इमेज भेजें और साथ में वेबसाइट का लिंक पेस्ट करें।' : '2. Attach the downloaded card image on WhatsApp along with your unique personalized website link.'}</p>
          <p>• {lang === 'hi' ? '3. प्राप्तकर्ता जब वेबसाइट खोलेंगे तो उन्हें आपका दिया हुआ संदेश और चुनी हुई थीम दिखाई देगी।' : '3. When the recipient opens the link, they will experience your personalized message and chosen royal theme.'}</p>
        </div>

        <div className="mt-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 text-xs text-gold-400 hover:text-gold-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'मुख्य पृष्ठ पर लौटें' : 'Back to Home'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
