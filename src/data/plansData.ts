import { PlanConfig, PlanId, ThemeConfig, ThemeId } from '../types';

export const PLANS: Record<PlanId, PlanConfig> = {
  basic: {
    id: 'basic',
    nameHi: 'बेसिक प्लान',
    nameEn: 'Basic Plan',
    taglineHi: 'सरल एवं सुंदर डिजिटल भेंट',
    taglineEn: 'Simple & Elegant Digital Blessing',
    priceInInr: 10,
    amountInPaise: 1000,
    featuresHi: [
      'व्यक्तिगत दीपावली विशिंग वेबसाइट लिंक (Unique URL)',
      'प्रेषक और प्राप्तकर्ता का नाम कस्टमाइजेशन',
      '4 राजसी भारतीय थीम में से चयन',
      'व्हाट्सएप वन-क्लिक शेयरिंग',
      'मोबाइल एवं डेस्कटॉप रेस्पॉन्सिव'
    ],
    featuresEn: [
      '1 Unique Personalized Diwali Greeting URL',
      'Sender & Recipient Name Customization',
      'Choice of 4 Royal Indian Festive Themes',
      'Instant WhatsApp One-Click Share Message',
      'Full Mobile & Desktop Responsive Layout'
    ]
  },
  premium: {
    id: 'premium',
    nameHi: 'प्रीमियम प्लान',
    nameEn: 'Premium Plan',
    taglineHi: 'सर्वाधिक लोकप्रिय — संपूर्ण उत्सव अनुभव',
    taglineEn: 'Most Popular — Complete Festive Celebration',
    priceInInr: 49,
    amountInPaise: 4900,
    isPopular: true,
    featuresHi: [
      'बेसिक प्लान की सभी सुविधाएँ शामिल',
      'डाउनलोड करने योग्य हाई-रेसोल्यूशन PNG ग्रीटिंग कार्ड',
      'मनपसंद व्यक्तिगत संदेश व शुभ आशीर्वाद',
      'इंटरएक्टिव 9 दीप प्रज्वलन व मंदिर की घंटी की ध्वनि',
      'सांस्कृतिक गैलरी व स्वर्णिम आतिशबाज़ी एनीमेशन'
    ],
    featuresEn: [
      'Everything in Basic Plan Included',
      'High-Resolution Downloadable PNG Greeting Card',
      'Custom Personal Blessing & Heartfelt Message',
      'Interactive 9 Diyas Lighting with Sacred Temple Bell Sound',
      'Indian Cultural Heritage Gallery & Golden Fireworks'
    ]
  },
  royal: {
    id: 'royal',
    nameHi: 'रॉयल कस्टम प्लान',
    nameEn: 'Royal Custom Plan',
    taglineHi: 'शाही धरोहर — विशेष परिवारों के लिए',
    taglineEn: 'Royal Heritage — Handcrafted Luxury for Families',
    priceInInr: 99,
    amountInPaise: 9900,
    featuresHi: [
      'प्रीमियम प्लान की सभी सुविधाएँ शामिल',
      'स्थायी डेडिकेटेड विशिंग URL (Permanent Archival)',
      'रॉयल बैकग्राउंड संगीत (शहनाई/सितार/तानपुरा सिंथ)',
      'विशेष सरप्राइज बॉक्स व गोल्डन वैक्स सील एनीमेशन',
      'प्राथमिकता कस्टमाइजेशन व हिमांशु द्वारा व्हाट्सएप सपोर्ट'
    ],
    featuresEn: [
      'Everything in Premium Plan Included',
      'Permanent Dedicated Archival Website URL',
      'Royal Ambient Audio Synth (Sitar/Tanpura/Bells)',
      'Surprise Envelope Box with Wax Seal Animation',
      'Priority Customization & Direct WhatsApp Support from Himanshu'
    ]
  }
};

export const THEMES: Record<ThemeId, ThemeConfig> = {
  maroon_gold: {
    id: 'maroon_gold',
    nameHi: 'शाही महरून व स्वर्ण (Royal Maroon & Gold)',
    nameEn: 'Royal Maroon & Gold',
    previewBg: 'bg-[#3B0D16]',
    primaryColor: '#3B0D16',
    accentColor: '#D4AF37',
    textColor: '#FFF3DC',
    bgGradient: 'radial-gradient(circle at 50% 0%, #641C26 0%, #3B0D16 45%, #180B0B 90%)'
  },
  royal_purple: {
    id: 'royal_purple',
    nameHi: 'राजसी जामुनी व स्वर्ण (Royal Purple & Gold)',
    nameEn: 'Royal Purple & Gold',
    previewBg: 'bg-[#2A0845]',
    primaryColor: '#2A0845',
    accentColor: '#FFD700',
    textColor: '#FFF8E7',
    bgGradient: 'radial-gradient(circle at 50% 0%, #4B1278 0%, #2A0845 50%, #120320 90%)'
  },
  saffron_cream: {
    id: 'saffron_cream',
    nameHi: 'केसरिया व मखमली क्रीम (Saffron & Cream)',
    nameEn: 'Saffron & Warm Cream',
    previewBg: 'bg-[#4A1800]',
    primaryColor: '#4A1800',
    accentColor: '#FF9933',
    textColor: '#FFF5E6',
    bgGradient: 'radial-gradient(circle at 50% 0%, #8A3300 0%, #4A1800 50%, #1C0A00 90%)'
  },
  emerald_green: {
    id: 'emerald_green',
    nameHi: 'पन्ना हरा व स्वर्ण (Emerald Green & Gold)',
    nameEn: 'Emerald Green & Gold',
    previewBg: 'bg-[#062618]',
    primaryColor: '#062618',
    accentColor: '#D4AF37',
    textColor: '#F0FFF4',
    bgGradient: 'radial-gradient(circle at 50% 0%, #0D472B 0%, #062618 50%, #02120B 90%)'
  }
};

export const getPlanById = (planId: string): PlanConfig => {
  if (planId in PLANS) {
    return PLANS[planId as PlanId];
  }
  return PLANS.basic;
};

export const getThemeById = (themeId: string): ThemeConfig => {
  if (themeId in THEMES) {
    return THEMES[themeId as ThemeId];
  }
  return THEMES.maroon_gold;
};

