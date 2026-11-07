import { ThemeId } from './types';

export interface CardSvgOptions {
  id?: string;
  recipientName?: string;
  recipient_name?: string;
  senderName?: string;
  customer_name?: string;
  greetingMessage?: string;
  greeting_message?: string;
  theme?: ThemeId;
  lang?: 'hi' | 'en';
  isWatermarked?: boolean;
  [key: string]: any;
}

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const THEME_PALETTES: Record<ThemeId, {
  primary: string;
  secondary: string;
  dark: string;
  accent: string;
  cardBoxFill: string;
  goldStops: [string, string, string, string];
}> = {
  maroon_gold: {
    primary: '#3B0D16',
    secondary: '#641C26',
    dark: '#180B0B',
    accent: '#D4AF37',
    cardBoxFill: '#200B10',
    goldStops: ['#FFF9E6', '#F5D77F', '#D4AF37', '#AA8214']
  },
  royal_purple: {
    primary: '#2A0845',
    secondary: '#4B1278',
    dark: '#120320',
    accent: '#FFD700',
    cardBoxFill: '#1A052C',
    goldStops: ['#FFF9E6', '#FFE57F', '#FFD700', '#B89B00']
  },
  saffron_cream: {
    primary: '#4A1800',
    secondary: '#8A3300',
    dark: '#1C0A00',
    accent: '#FF9933',
    cardBoxFill: '#2B0F00',
    goldStops: ['#FFF3DC', '#FFB366', '#FF9933', '#CC6600']
  },
  emerald_green: {
    primary: '#062618',
    secondary: '#0D472B',
    dark: '#02120B',
    accent: '#D4AF37',
    cardBoxFill: '#04180F',
    goldStops: ['#F0FFF4', '#A3E6B9', '#D4AF37', '#8B7314']
  }
};

export function generateCardSvg(options: CardSvgOptions): string {
  const themeKey = options.theme && THEME_PALETTES[options.theme] ? options.theme : 'maroon_gold';
  const palette = THEME_PALETTES[themeKey];
  const lang = options.lang === 'en' ? 'en' : 'hi';
  const isWatermarked = Boolean(options.isWatermarked);

  const rName = (options.recipientName || options.recipient_name || '').trim() || (lang === 'hi' ? 'प्रिय' : 'Dear');
  const cName = (options.senderName || options.customer_name || '').trim() || 'Himanshu Kumar';
  const defaultMessage = lang === 'hi'
    ? 'यह पावन पर्व आपके जीवन में सुख, शांति, समृद्धि और सफलता लेकर आए!'
    : 'May this festival of lights illuminate your path with joy, good health, and success!';
  const message = (options.greetingMessage || options.greeting_message || '').trim() || defaultMessage;

  const subtitle = lang === 'hi'
    ? 'रोशनी, प्रेम और अपनत्व का पावन पर्व'
    : 'A Festival of Lights, Love &amp; Togetherness';

  const recipientLine = lang === 'hi'
    ? `प्रिय ${escapeXml(rName)} और आपके प्यारे परिवार को`
    : `Dear ${escapeXml(rName)} &amp; Your Wonderful Family`;

  const senderLine = lang === 'hi'
    ? `सस्नेह, ${escapeXml(cName)} ❤️`
    : `With Love, ${escapeXml(cName)} ❤️`;

  // Repeating diagonal watermark pattern for free previews
  const watermarkSvg = isWatermarked
    ? `
  <!-- INDELIBLE DIAGONAL WATERMARK (Baked into vector graphics) -->
  <g transform="rotate(-26 600 400)" opacity="0.28" pointer-events="none">
    ${[-400, -260, -120, 20, 160, 300, 440, 580, 720, 860, 1000].map(y => `
      <text x="-300" y="${y}" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="800" font-size="24" fill="#FFE57F" letter-spacing="4">
        ✦ Designed &amp; Developed by Himanshu Kumar ✦ FREE PREVIEW ✦ Designed &amp; Developed by Himanshu Kumar ✦
      </text>
    `).join('')}
  </g>

  <!-- Watermark Bottom Protected Attribution Banner -->
  <g transform="translate(600, 750)">
    <rect x="-560" y="-20" width="1120" height="40" rx="10" fill="#180B0B" stroke="#D4AF37" stroke-width="2" opacity="0.95" />
    <text text-anchor="middle" y="6" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="800" font-size="15" fill="#FFE57F" letter-spacing="1">
      ✦ FREE WATERMARKED PREVIEW • Designed &amp; Developed by Himanshu Kumar • Purchase Any Plan to Unlock Clean HD Download ✦
    </text>
  </g>
`
    : '';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <radialGradient id="cardBg" cx="50%" cy="20%" r="85%">
      <stop offset="0%" stop-color="${palette.secondary}" />
      <stop offset="45%" stop-color="${palette.primary}" />
      <stop offset="85%" stop-color="${palette.dark}" />
      <stop offset="100%" stop-color="#040102" />
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.goldStops[0]}" />
      <stop offset="35%" stop-color="${palette.goldStops[1]}" />
      <stop offset="70%" stop-color="${palette.goldStops[2]}" />
      <stop offset="100%" stop-color="${palette.goldStops[3]}" />
    </linearGradient>
    <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Card Background -->
  <rect width="1200" height="800" fill="url(#cardBg)" />

  <!-- Outer Royal Ornate Frame -->
  <rect x="26" y="26" width="1148" height="748" rx="26" fill="none" stroke="url(#goldGrad)" stroke-width="3.5" opacity="0.85" />
  <rect x="40" y="40" width="1120" height="720" rx="18" fill="none" stroke="${palette.accent}" stroke-width="1.4" stroke-dasharray="8 6" opacity="0.65" />

  <!-- Top Center Auspicious Sanskrit Mantra -->
  <g transform="translate(600, 95)">
    <rect x="-190" y="-26" width="380" height="48" rx="24" fill="${palette.primary}" stroke="url(#goldGrad)" stroke-width="1.8" opacity="0.95" />
    <text text-anchor="middle" y="6" font-family="'Noto Serif Devanagari', 'Noto Sans Devanagari', serif" font-weight="700" font-size="22" fill="#F5D77F">॥ श्री गणेशाय नमः ॥</text>
  </g>

  <!-- Grand Devanagari Main Heading -->
  <text x="600" y="200" text-anchor="middle" font-family="'Noto Serif Devanagari', 'Noto Sans Devanagari', serif" font-weight="900" font-size="68" fill="url(#goldGrad)">
    ॥ शुभ दीपावली ॥
  </text>
  <text x="600" y="250" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-style="italic" font-weight="600" font-size="22" fill="#FFF3DC" opacity="0.92">
    ${subtitle}
  </text>

  <!-- Ornate Golden Divider -->
  <line x1="360" y1="280" x2="840" y2="280" stroke="url(#goldGrad)" stroke-width="2" />
  <circle cx="600" cy="280" r="7" fill="${palette.accent}" />
  <circle cx="580" cy="280" r="3.5" fill="${palette.accent}" opacity="0.7" />
  <circle cx="620" cy="280" r="3.5" fill="${palette.accent}" opacity="0.7" />

  <!-- Central Greeting Card Box -->
  <g transform="translate(600, 410)">
    <rect x="-440" y="-85" width="880" height="220" rx="22" fill="${palette.cardBoxFill}" stroke="url(#goldGrad)" stroke-width="1.8" opacity="0.9" />
    
    <text text-anchor="middle" y="-35" font-family="'Playfair Display', 'Noto Serif Devanagari', Georgia, serif" font-weight="700" font-size="32" fill="#F5D77F">
      ${recipientLine}
    </text>
    
    <text text-anchor="middle" y="20" font-family="'Noto Serif Devanagari', 'Inter', sans-serif" font-size="20" fill="#FFF3DC" opacity="0.95">
      ${escapeXml(message.slice(0, 150))}
    </text>
    
    <text text-anchor="middle" y="85" font-family="'Noto Serif Devanagari', 'Inter', sans-serif" font-weight="700" font-size="23" fill="#FFB800">
      ${senderLine}
    </text>
  </g>

  <!-- Left Brass Diya -->
  <g transform="translate(170, 520)">
    <ellipse cx="0" cy="-35" rx="22" ry="32" fill="#FFAA33" filter="url(#flameGlow)" opacity="0.85" />
    <ellipse cx="0" cy="-35" rx="12" ry="18" fill="#FFF8E7" />
    <ellipse cx="0" cy="5" rx="55" ry="14" fill="#42141C" />
    <path d="M-55 5 C-55 35 -20 48 0 48 C20 48 55 35 55 5 Z" fill="url(#goldGrad)" stroke="#947214" stroke-width="2" />
  </g>

  <!-- Right Brass Diya -->
  <g transform="translate(1030, 520)">
    <ellipse cx="0" cy="-35" rx="22" ry="32" fill="#FFAA33" filter="url(#flameGlow)" opacity="0.85" />
    <ellipse cx="0" cy="-35" rx="12" ry="18" fill="#FFF8E7" />
    <ellipse cx="0" cy="5" rx="55" ry="14" fill="#42141C" />
    <path d="M-55 5 C-55 35 -20 48 0 48 C20 48 55 35 55 5 Z" fill="url(#goldGrad)" stroke="#947214" stroke-width="2" />
  </g>

  <!-- Footer Signature & Attribution -->
  ${!isWatermarked ? `
  <text x="600" y="695" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" letter-spacing="3" fill="#D4AF37" opacity="0.85">
    MADE WITH ❤️ &amp; FESTIVE MAGIC
  </text>
  <text x="600" y="725" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="600" font-size="16" fill="#FFF3DC">
    Designed &amp; Developed by Himanshu Kumar
  </text>
  ` : ''}

  ${watermarkSvg}
</svg>
`.trim();
}
