import { DiyaItem, FestiveCardItem } from '../types';

export const creatorInfo = {
  name: "Himanshu Kumar",
  title: "Designed & Developed by Himanshu Kumar",
  tagline: "Made with ❤️ & Festive Magic",
  copyright: "© 2026 Himanshu Kumar. All Rights Reserved.",
};

export const defaultNames = {
  recipient: "Dear",
  family: "Your Wonderful Family",
};

export const getPersonalizedHeadings = (recipient: string, sender: string) => {
  const rName = recipient.trim() || defaultNames.recipient;
  const sName = sender.trim();

  return {
    heroGreetingHi: sName
      ? `${sName} की तरफ से प्रिय ${rName} और आपके परिवार को दीपावली की हार्दिक शुभकामनाएँ!`
      : `प्रिय ${rName} और आपके परिवार को दीपावली की हार्दिक शुभकामनाएँ!`,
    heroGreetingEn: sName
      ? `Warm Diwali Wishes from ${sName} to Dear ${rName} & Your Family!`
      : `Dear ${rName}, wishing you and your family a very Happy Diwali!`,
    heroPersonalNoteHi: `प्रिय ${rName}, यह दीपावली और भी खास है क्योंकि ये शुभकामनाएँ विशेष रूप से आपके और आपके प्यारे परिवार के लिए संजोई गई हैं।`,
    heroPersonalNoteEn: `${rName}, this Diwali is a little more special because these wishes are made especially for you and Your Wonderful Family.`,
    signature: sName ? `With Love, ${sName} ❤️` : `With Love ❤️`,
    senderBadgeHi: sName ? `${sName} की तरफ से सस्नेह भेंट` : `सस्नेह दीपावली भेंट`,
    senderBadgeEn: sName ? `Special Greeting from ${sName}` : `A Royal Diwali Gift`,
  };
};

export const openingData = {
  ganeshaMantra: "॥ श्री गणेशाय नमः ॥",
  shubhDiwali: "॥ शुभ दीपावली ॥",
  mainHeadingEn: "A Festival of Lights, Love & Togetherness",
  mainHeadingHi: "रोशनी, प्रेम और अपनत्व का पावन पर्व",
  quoteHi: "इस दीपावली की रोशनी आपके जीवन में अनगिनत खुशियाँ, सुख, शांति और समृद्धि लेकर आए।",
  quoteEn: "May every diya bring a new ray of hope, every prayer bring peace, and every moment create beautiful memories for your family.",
  buttonEn: "✨ Open Your Special Wishes",
  buttonHi: "✨ अपनी विशेष शुभकामनाएँ खोलें",
};

export const getPersonalGreetingParagraphs = (recipient: string, sender: string) => {
  const rName = recipient.trim() || defaultNames.recipient;
  const sName = sender.trim();

  const paragraphsHi = [
    `प्रिय ${rName} और आपके पूरे परिवार को दीपावली की हार्दिक शुभकामनाएँ!`,
    "इस पावन पर्व पर मेरी दिल से यही कामना है कि आपके घर का हर कोना खुशियों के उजाले से भर जाए।",
    "आपके परिवार में हमेशा प्रेम, अपनापन, हँसी और खुशहाली बनी रहे।",
    "माँ लक्ष्मी की कृपा से आपके जीवन में धन-धान्य और समृद्धि का आगमन हो तथा भगवान गणेश आपके हर कार्य को मंगलमय बनाएँ।",
    "आपके घर में कभी खुशियों की कमी न हो, रिश्तों में हमेशा मिठास बनी रहे और हर नया दिन आपके लिए नई उम्मीदें और खूबसूरत अवसर लेकर आए।",
    "ईश्वर से यही प्रार्थना है कि आप सभी हमेशा स्वस्थ, प्रसन्न और एक-दूसरे के साथ खुश रहें।",
    sName
      ? `${sName} की तरफ से आप सभी को और आपके पूरे परिवार को दीपावली की ढेर सारी शुभकामनाएँ!`
      : "आप सभी को और आपके पूरे परिवार को दीपावली की ढेर सारी शुभकामनाएँ!"
  ];

  const paragraphsEn = [
    `${rName}, wishing you and Your Wonderful Family a truly beautiful and blessed Diwali!`,
    "May this festival of lights fill your home with warmth, your hearts with happiness, and your lives with endless opportunities.",
    "May Goddess Lakshmi bless your family with prosperity, and Lord Ganesha guide you towards success, wisdom, and happiness.",
    "May your home always echo with laughter, your relationships grow stronger with every passing year, and your days be filled with peace, love, and countless blessings.",
    "May every diya illuminate a new dream, every prayer bring positivity, and every celebration create unforgettable memories.",
    "Wishing you and your entire family a lifetime of happiness, good health, peace, and prosperity.",
    sName
      ? `Happy Diwali to you and Your Wonderful Family from ${sName}!`
      : "Happy Diwali to Your Wonderful Family!"
  ];

  return { paragraphsHi, paragraphsEn };
};

export const diyasData: DiyaItem[] = [
  {
    id: 1,
    titleHi: "खुशियों का उजाला",
    titleEn: "Light of Happiness",
    blessingHi: "आपके जीवन में खुशियों का उजाला बना रहे।",
    blessingEn: "May the radiant light of happiness forever brighten your life."
  },
  {
    id: 2,
    titleHi: "पारिवारिक प्रेम",
    titleEn: "Family Affection",
    blessingHi: "आपके परिवार में हमेशा प्रेम बना रहे।",
    blessingEn: "May deep love, warmth, and unity always flourish in your family."
  },
  {
    id: 3,
    titleHi: "सपनों की सिद्धि",
    titleEn: "Fulfillment of Dreams",
    blessingHi: "हर सपना खूबसूरती से पूरा हो।",
    blessingEn: "May every cherished aspiration and dream come true with grace."
  },
  {
    id: 4,
    titleHi: "आरोग्य व स्वास्थ्य",
    titleEn: "Good Health & Vitality",
    blessingHi: "आपको सदैव अच्छा स्वास्थ्य मिले।",
    blessingEn: "May radiant health, strength, and vitality always bless you."
  },
  {
    id: 5,
    titleHi: "समृद्धि व वैभव",
    titleEn: "Endless Prosperity",
    blessingHi: "आपके घर में समृद्धि बनी रहे।",
    blessingEn: "May abundance, good fortune, and prosperity reside in your home."
  },
  {
    id: 6,
    titleHi: "नित्य नया उल्लास",
    titleEn: "Daily Fresh Joys",
    blessingHi: "हर दिन नई खुशियाँ लेकर आए।",
    blessingEn: "May each new dawn bring boundless joy and auspicious moments."
  },
  {
    id: 7,
    titleHi: "रिश्तों की मिठास",
    titleEn: "Sweet Relationships",
    blessingHi: "आपके रिश्तों में मिठास बनी रहे।",
    blessingEn: "May sweetness, tenderness, and harmony grace all your bonds."
  },
  {
    id: 8,
    titleHi: "सफलता का पथ",
    titleEn: "Path of Success",
    blessingHi: "आपका हर कदम सफलता की ओर बढ़े।",
    blessingEn: "May every step you take lead forward to glorious achievements."
  },
  {
    id: 9,
    titleHi: "दैवीय कृपा",
    titleEn: "Divine Grace",
    blessingHi: "ईश्वर की कृपा सदैव बनी रहे।",
    blessingEn: "May divine grace, protection, and eternal blessings stay with you always."
  }
];

export const festiveCardsData: FestiveCardItem[] = [
  {
    id: 1,
    categoryHi: "खुशियाँ • Happiness",
    categoryEn: "Happiness & Serenity",
    hindi: "हर सुबह नई खुशियाँ लाए और हर शाम सुकून से भरी हो।",
    english: "May every sunrise bring happiness and every evening bring peace.",
    iconName: "Sun",
    colorGradient: "from-amber-600/30 to-amber-900/40"
  },
  {
    id: 2,
    categoryHi: "समृद्धि • Prosperity",
    categoryEn: "Prosperity & Abundance",
    hindi: "माँ लक्ष्मी की कृपा से आपका घर हमेशा धन-धान्य से भरा रहे।",
    english: "May prosperity and abundance always find their way into your home.",
    iconName: "Sparkles",
    colorGradient: "from-yellow-600/30 to-yellow-950/40"
  },
  {
    id: 3,
    categoryHi: "परिवार • Family",
    categoryEn: "Family & Unity",
    hindi: "आपके परिवार का प्यार और साथ हमेशा यूँ ही बना रहे।",
    english: "May your family's love and togetherness remain beautiful forever.",
    iconName: "Heart",
    colorGradient: "from-red-600/30 to-rose-950/40"
  },
  {
    id: 4,
    categoryHi: "सफलता • Success",
    categoryEn: "Success & Triumph",
    hindi: "आपके हर सपने को नई उड़ान मिले।",
    english: "May every dream find its wings and every effort lead to success.",
    iconName: "Compass",
    colorGradient: "from-orange-600/30 to-amber-950/40"
  },
  {
    id: 5,
    categoryHi: "शांति • Peace",
    categoryEn: "Peace & Positivity",
    hindi: "आपके जीवन में सुख, शांति और सकारात्मकता बनी रहे।",
    english: "May your life always be surrounded by peace, positivity, and blessings.",
    iconName: "Flame",
    colorGradient: "from-amber-500/30 to-rose-950/40"
  },
  {
    id: 6,
    categoryHi: "अपनत्व • Togetherness",
    categoryEn: "Togetherness & Joy",
    hindi: "रिश्तों में मिठास और अपनों के साथ खुशियों की बहार रहे।",
    english: "May your home always be filled with love, laughter, and beautiful memories.",
    iconName: "Smile",
    colorGradient: "from-yellow-500/30 to-orange-950/40"
  }
];

export const surpriseData = {
  badgeHi: "हृदय से एक अनमोल भेंट",
  badgeEn: "A Sacred Gift from the Heart",
  previewHeadingHi: "आपके लिए एक छोटा-सा सरप्राइज ❤️",
  previewHeadingEn: "A Little Surprise For You ❤️",
  subpreviewHi: "इस शाही पत्र को खोलें और अपने परिवार के लिए स्नेह भरी दुआएँ प्राप्त करें।",
  subpreviewEn: "Unseal this golden royal envelope to reveal heartfelt prayers crafted for your family.",
  buttonHi: "✨ अपना सरप्राइज खोलें",
  buttonEn: "✨ Open Your Little Surprise",
  revealedHeadingHi: "अनमोल दुआओं का शाही पत्र 📜",
  revealedHeadingEn: "Sacred Wishes From The Heart 📜",
  messageHi: [
    "कुछ शुभकामनाएँ सिर्फ शब्द नहीं होतीं, उनमें दिल से निकली दुआएँ होती हैं।",
    "आपका परिवार हमेशा खुश रहे, मुस्कुराता रहे और जीवन में हर खूबसूरत खुशी का अनुभव करे।",
    "आप सभी की जिंदगी में प्यार, अपनापन और खुशियों की रोशनी कभी कम न हो।",
    "यही दिल से दुआ है!"
  ],
  messageEn: [
    "Some wishes are more than just words; they carry genuine prayers from the heart.",
    "May your family always stay happy, keep smiling, and experience all the beautiful moments life has to offer.",
    "May love, togetherness, and happiness always illuminate your lives.",
    "These wishes come straight from the heart."
  ]
};

export const getFinalClosingParagraphs = (recipient: string, sender: string) => {
  const rName = recipient.trim() || defaultNames.recipient;
  const sName = sender.trim();

  const paragraphsHi = [
    "दीपों की रोशनी आपके जीवन को हमेशा जगमगाती रहे।",
    "आपके घर में खुशियों का आगमन हो, रिश्तों में प्यार बना रहे और हर दिन नई उम्मीदों के साथ शुरू हो।",
    "ईश्वर आपके पूरे परिवार को सुख, शांति, अच्छा स्वास्थ्य और अपार खुशियाँ प्रदान करें।",
    "आप सभी का जीवन हमेशा रोशनी और मुस्कान से भरा रहे।",
    "दीपावली की हार्दिक शुभकामनाएँ!"
  ];

  const paragraphsEn = [
    "May the lights of Diwali continue to brighten every chapter of your life.",
    "May your home always be filled with warmth, your family surrounded by love, and your hearts blessed with endless happiness.",
    "May you always have reasons to celebrate, dreams to follow, and beautiful memories to cherish together.",
    sName
      ? `Wishing Dear ${rName} and Your Wonderful Family a joyful, peaceful, and prosperous Diwali from ${sName}!`
      : `Wishing Dear ${rName} and Your Wonderful Family a joyful, peaceful, and prosperous Diwali!`
  ];

  return { paragraphsHi, paragraphsEn };
};

export const generateWhatsAppMessage = (_sender: string, shareUrl: string) => {
  return `🪔 ॥ शुभ दीपावली ॥ ✨

आपको और आपके पूरे परिवार को दीपावली की हार्दिक शुभकामनाएँ! ❤️

May this beautiful festival of lights bring happiness, prosperity, peace, and endless blessings to you and your family.

✨ Share happiness, spread light, and keep smiling!

🎨 This special Diwali wishes website has been lovingly designed and developed by Himanshu Kumar.

🌐 Visit this beautiful Diwali experience:
${shareUrl}

With Love ❤️`;
};
