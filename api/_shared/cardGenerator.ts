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

/**
 * Intelligently wraps text into multiple lines for SVG rendering
 * to guarantee that long greetings or names never clip or overflow.
 */
function wrapSvgLines(text: string, maxCharsPerLine = 48, maxLines = 5): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      currentLine = candidate;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      if (lines.length >= maxLines - 1) {
        break;
      }
    }
  }
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }
  return lines;
}

export const THEME_PALETTES: Record<ThemeId, {
  name: string;
  primary: string;
  secondary: string;
  dark: string;
  accent: string;
  cardBoxFill: string;
  cardBoxStroke: string;
  goldStops: [string, string, string, string];
  glowColor: string;
}> = {
  maroon_gold: {
    name: 'Royal Maroon + Gold',
    primary: '#3B0D16',
    secondary: '#5C1523',
    dark: '#1A060A',
    accent: '#D4AF37',
    cardBoxFill: '#24080E',
    cardBoxStroke: '#D4AF37',
    goldStops: ['#FFFDF0', '#F5D77F', '#D4AF37', '#9E7A1C'],
    glowColor: 'rgba(212, 175, 55, 0.4)'
  },
  royal_purple: {
    name: 'Royal Purple + Gold',
    primary: '#2A0845',
    secondary: '#45106E',
    dark: '#130321',
    accent: '#FFD700',
    cardBoxFill: '#1A052C',
    cardBoxStroke: '#FFD700',
    goldStops: ['#FFFFF0', '#FFE57F', '#FFD700', '#B89B00'],
    glowColor: 'rgba(255, 215, 0, 0.45)'
  },
  saffron_cream: {
    name: 'Saffron + Cream',
    primary: '#4A1800',
    secondary: '#7A2C00',
    dark: '#1F0B00',
    accent: '#FF9933',
    cardBoxFill: '#2B0E00',
    cardBoxStroke: '#FF9933',
    goldStops: ['#FFF8E7', '#FFB366', '#FF9933', '#B85500'],
    glowColor: 'rgba(255, 153, 51, 0.45)'
  },
  emerald_green: {
    name: 'Emerald Green + Gold',
    primary: '#062618',
    secondary: '#0B422B',
    dark: '#02120B',
    accent: '#D4AF37',
    cardBoxFill: '#04170F',
    cardBoxStroke: '#D4AF37',
    goldStops: ['#F2FFF6', '#A8E6BE', '#D4AF37', '#877017'],
    glowColor: 'rgba(212, 175, 55, 0.4)'
  }
};

/**
 * Generates an ultra-premium SVG string for the personalized Diwali Greeting Card.
 * Fully supports Hindi (Devanagari) & English, all 4 royal palettes,
 * intelligent word-wrapping, multi-stage glowing diyas, and subtle indelible watermark protection.
 */
export function generateCardSvg(options: CardSvgOptions): string {
  const themeKey = options.theme && THEME_PALETTES[options.theme] ? options.theme : 'maroon_gold';
  const palette = THEME_PALETTES[themeKey];
  const lang = options.lang === 'en' ? 'en' : 'hi';
  const isWatermarked = Boolean(options.isWatermarked);

  const rName = (options.recipientName || options.recipient_name || '').trim() || (lang === 'hi' ? 'प्रिय' : 'Dear');
  const cName = (options.senderName || options.customer_name || '').trim() || 'Himanshu Kumar';

  const defaultMessage = lang === 'hi'
    ? 'यह पावन पर्व आपके जीवन में सुख, शांति, समृद्धि और सफलता लेकर आए!'
    : 'May this divine festival of lights illuminate your path with joy, good health, and boundless prosperity!';
  const rawMessage = (options.greetingMessage || options.greeting_message || '').trim() || defaultMessage;

  // Auto-wrap message into up to 4 lines
  const messageLines = wrapSvgLines(rawMessage, 46, 4);

  const mainHeading = lang === 'hi' ? '॥ शुभ दीपावली ॥' : '॥ HAPPY DIWALI ॥';
  const subtitle = lang === 'hi'
    ? 'रोशनी, प्रेम और अपनत्व का पावन पर्व'
    : 'A Royal Celebration of Lights, Joy &amp; Prosperity';

  const recipientLine = lang === 'hi'
    ? `प्रिय ${escapeXml(rName)} और आपके प्यारे परिवार को`
    : `Dedicated to Dear ${escapeXml(rName)} &amp; Your Wonderful Family`;

  const senderLine = lang === 'hi'
    ? `सस्नेह भेंट: ${escapeXml(cName)} ❤️`
    : `With Warmest Wishes: ${escapeXml(cName)} ❤️`;

  // Dynamic recipient font size based on length
  const recipientFontSize = recipientLine.length > 42 ? 24 : recipientLine.length > 30 ? 28 : 32;

  // Subtle, tasteful diagonal watermark (never obscures readability, yet permanently marks free previews)
  const watermarkSvg = isWatermarked
    ? `
  <!-- SUBTLE TASTEFUL DIAGONAL WATERMARK -->
  <g transform="rotate(-24 600 400)" opacity="0.18" pointer-events="none">
    <text x="600" y="340" text-anchor="middle" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="800" font-size="28" fill="#FFE57F" letter-spacing="4">
      ✦ FREE PREVIEW — Designed &amp; Developed by Himanshu Kumar ✦
    </text>
    <text x="600" y="440" text-anchor="middle" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="800" font-size="28" fill="#FFE57F" letter-spacing="4">
      ✦ FREE PREVIEW — Designed &amp; Developed by Himanshu Kumar ✦
    </text>
  </g>
  <!-- BOTTOM PREVIEW BADGE -->
  <g transform="translate(600, 762)" opacity="0.95">
    <rect x="-260" y="-14" width="520" height="28" rx="14" fill="#000000" opacity="0.75" stroke="${palette.accent}" stroke-width="1.2" />
    <text text-anchor="middle" y="4" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#F5D77F" letter-spacing="1">
      FREE PREVIEW — High-Resolution Clean Card Unlocked Upon Order
    </text>
  </g>
`
    : '';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800" style="background:${palette.dark};">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@600;700;800;900&amp;family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&amp;family=Inter:wght@400;600;700&amp;display=swap');
      .devanagari-title { font-family: 'Noto Serif Devanagari', 'Playfair Display', serif; }
      .royal-serif { font-family: 'Playfair Display', 'Noto Serif Devanagari', serif; }
      .modern-sans { font-family: 'Inter', sans-serif; }
    </style>

    <!-- Radial Card Backdrop Gradient -->
    <radialGradient id="cardBg" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="${palette.secondary}" />
      <stop offset="60%" stop-color="${palette.primary}" />
      <stop offset="100%" stop-color="${palette.dark}" />
    </radialGradient>

    <!-- Royal Antique Gold Linear Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.goldStops[0]}" />
      <stop offset="35%" stop-color="${palette.goldStops[1]}" />
      <stop offset="70%" stop-color="${palette.goldStops[2]}" />
      <stop offset="100%" stop-color="${palette.goldStops[3]}" />
    </linearGradient>

    <!-- Soft Golden Glow Filter for Heading -->
    <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Intense Diya Flame Glow Filter -->
    <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Subtle Jaali Background Pattern -->
    <pattern id="jaaliPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="${palette.accent}" stroke-width="0.8" opacity="0.08" />
      <circle cx="20" cy="20" r="3" fill="${palette.accent}" opacity="0.1" />
    </pattern>
  </defs>

  <!-- Base Card Background -->
  <rect width="1200" height="800" fill="url(#cardBg)" />

  <!-- Subtle Royal Jaali Texture Overlay -->
  <rect width="1200" height="800" fill="url(#jaaliPattern)" />

  <!-- Outer Palace Ornate Double Frame -->
  <rect x="24" y="24" width="1152" height="752" rx="28" fill="none" stroke="url(#goldGrad)" stroke-width="3" opacity="0.9" />
  <rect x="36" y="36" width="1128" height="728" rx="20" fill="none" stroke="${palette.accent}" stroke-width="1.2" stroke-dasharray="8 6" opacity="0.55" />

  <!-- Four Royal Corner Flourishes -->
  <!-- Top-Left -->
  <g transform="translate(48, 48)">
    <path d="M0 0 L32 0 Q16 16 0 32 Z" fill="url(#goldGrad)" opacity="0.8" />
    <circle cx="8" cy="8" r="4" fill="${palette.accent}" />
    <circle cx="22" cy="6" r="2.5" fill="${palette.accent}" />
    <circle cx="6" cy="22" r="2.5" fill="${palette.accent}" />
  </g>
  <!-- Top-Right -->
  <g transform="translate(1152, 48) scale(-1, 1)">
    <path d="M0 0 L32 0 Q16 16 0 32 Z" fill="url(#goldGrad)" opacity="0.8" />
    <circle cx="8" cy="8" r="4" fill="${palette.accent}" />
    <circle cx="22" cy="6" r="2.5" fill="${palette.accent}" />
    <circle cx="6" cy="22" r="2.5" fill="${palette.accent}" />
  </g>
  <!-- Bottom-Left -->
  <g transform="translate(48, 752) scale(1, -1)">
    <path d="M0 0 L32 0 Q16 16 0 32 Z" fill="url(#goldGrad)" opacity="0.8" />
    <circle cx="8" cy="8" r="4" fill="${palette.accent}" />
    <circle cx="22" cy="6" r="2.5" fill="${palette.accent}" />
    <circle cx="6" cy="22" r="2.5" fill="${palette.accent}" />
  </g>
  <!-- Bottom-Right -->
  <g transform="translate(1152, 752) scale(-1, -1)">
    <path d="M0 0 L32 0 Q16 16 0 32 Z" fill="url(#goldGrad)" opacity="0.8" />
    <circle cx="8" cy="8" r="4" fill="${palette.accent}" />
    <circle cx="22" cy="6" r="2.5" fill="${palette.accent}" />
    <circle cx="6" cy="22" r="2.5" fill="${palette.accent}" />
  </g>

  <!-- Hanging Golden Beaded Toran Rim at Top -->
  <g transform="translate(180, 40)" opacity="0.65">
    ${[0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840].map(x => `
      <line x1="${x}" y1="0" x2="${x}" y2="12" stroke="url(#goldGrad)" stroke-width="1.2" />
      <circle cx="${x}" cy="14" r="3" fill="${palette.accent}" />
    `).join('')}
  </g>

  <!-- Auspicious Top Sanskrit Capsule: "॥ श्री गणेशाय नमः ॥" -->
  <g transform="translate(600, 88)">
    <rect x="-175" y="-22" width="350" height="44" rx="22" fill="${palette.cardBoxFill}" stroke="url(#goldGrad)" stroke-width="1.6" opacity="0.95" />
    <circle cx="-145" cy="0" r="3.5" fill="${palette.accent}" />
    <circle cx="145" cy="0" r="3.5" fill="${palette.accent}" />
    <text text-anchor="middle" y="6" class="devanagari-title" font-weight="700" font-size="20" fill="#F5D77F" letter-spacing="1">
      ॥ श्री गणेशाय नमः ॥
    </text>
  </g>

  <!-- Grand Festive Main Title: "॥ शुभ दीपावली ॥" -->
  <text x="600" y="172" text-anchor="middle" class="devanagari-title" font-weight="900" font-size="62" fill="url(#goldGrad)" filter="url(#goldGlow)" letter-spacing="1.5">
    ${mainHeading}
  </text>

  <!-- Elegant Festive Subtitle -->
  <text x="600" y="218" text-anchor="middle" class="royal-serif" font-style="italic" font-weight="600" font-size="21" fill="#FFF3DC" opacity="0.92">
    ${subtitle}
  </text>

  <!-- Ornate Center Gold Divider with Lotus Accent -->
  <g transform="translate(600, 246)">
    <line x1="-240" y1="0" x2="-25" y2="0" stroke="url(#goldGrad)" stroke-width="1.8" />
    <line x1="25" y1="0" x2="240" y2="0" stroke="url(#goldGrad)" stroke-width="1.8" />
    <circle cx="0" cy="0" r="6" fill="${palette.accent}" />
    <circle cx="-12" cy="0" r="3" fill="${palette.accent}" opacity="0.8" />
    <circle cx="12" cy="0" r="3" fill="${palette.accent}" opacity="0.8" />
    <path d="M0 -8 C-6 -2 -6 2 0 6 C6 2 6 -2 0 -8 Z" fill="#FFAA33" />
  </g>

  <!-- Central Royal Jharokha Inscription Scroll Box -->
  <g transform="translate(600, 420)">
    <!-- Box Shadow & Fill -->
    <rect x="-440" y="-140" width="880" height="280" rx="24" fill="${palette.cardBoxFill}" stroke="url(#goldGrad)" stroke-width="2" opacity="0.96" />
    <rect x="-428" y="-128" width="856" height="256" rx="16" fill="none" stroke="${palette.accent}" stroke-width="1" stroke-dasharray="6 4" opacity="0.4" />

    <!-- Recipient Line (Auto-scaled) -->
    <text text-anchor="middle" y="-85" class="royal-serif" font-weight="700" font-size="${recipientFontSize}" fill="#F5D77F">
      ${recipientLine}
    </text>

    <!-- Small Golden Divider inside box -->
    <line x1="-120" y1="-62" x2="120" y2="-62" stroke="url(#goldGrad)" stroke-width="1.2" opacity="0.7" />

    <!-- Message Lines (Word-Wrapped, Clean Multi-Line Display) -->
    <text text-anchor="middle" y="-22" class="devanagari-title" font-weight="600" font-size="20" fill="#FFF8E7" opacity="0.96" line-height="1.5">
      ${messageLines.map((line, idx) => `
        <tspan x="0" dy="${idx === 0 ? 0 : 30}">${escapeXml(line)}</tspan>
      `).join('')}
    </text>

    <!-- Small Golden Divider below message -->
    <line x1="-90" y1="84" x2="90" y2="84" stroke="url(#goldGrad)" stroke-width="1.2" opacity="0.7" />

    <!-- Closing Signature -->
    <text text-anchor="middle" y="112" class="devanagari-title" font-weight="700" font-size="22" fill="#FFB800">
      ${senderLine}
    </text>
  </g>

  <!-- Left Sculpted Brass Diya with Multi-Stage Flame -->
  <g transform="translate(170, 600)">
    <!-- Outer Warm Aura -->
    <ellipse cx="0" cy="-45" rx="30" ry="45" fill="#FF8800" filter="url(#flameGlow)" opacity="0.8" />
    <!-- Vibrant Orange Mid Flame -->
    <path d="M0 -78 C-18 -45 -14 -15 0 0 C14 -15 18 -45 0 -78 Z" fill="#FFAA00" />
    <!-- White-Hot Inner Core -->
    <path d="M0 -55 C-8 -35 -6 -15 0 -2 C6 -15 8 -35 0 -55 Z" fill="#FFFDF0" />
    <!-- Dark Wick -->
    <line x1="0" y1="-2" x2="0" y2="8" stroke="#3B0D16" stroke-width="2.5" />
    <!-- Brass Diya Bowl -->
    <ellipse cx="0" cy="14" rx="60" ry="16" fill="#42141C" />
    <path d="M-60 14 C-60 48 -22 62 0 62 C22 62 60 48 60 14 Z" fill="url(#goldGrad)" stroke="#876813" stroke-width="2" />
    <ellipse cx="0" cy="12" rx="52" ry="10" fill="#5C2028" opacity="0.8" />
    <path d="M-28 62 L28 62 L36 72 L-36 72 Z" fill="url(#goldGrad)" stroke="#876813" stroke-width="1.5" />
    <!-- Golden Stardust Sparks -->
    <circle cx="-12" cy="-90" r="1.8" fill="#FFFDF0" opacity="0.9" />
    <circle cx="8" cy="-105" r="1.4" fill="#F5D77F" opacity="0.8" />
    <circle cx="-4" cy="-120" r="1" fill="#FFFDF0" opacity="0.7" />
  </g>

  <!-- Right Sculpted Brass Diya with Multi-Stage Flame -->
  <g transform="translate(1030, 600)">
    <!-- Outer Warm Aura -->
    <ellipse cx="0" cy="-45" rx="30" ry="45" fill="#FF8800" filter="url(#flameGlow)" opacity="0.8" />
    <!-- Vibrant Orange Mid Flame -->
    <path d="M0 -78 C-18 -45 -14 -15 0 0 C14 -15 18 -45 0 -78 Z" fill="#FFAA00" />
    <!-- White-Hot Inner Core -->
    <path d="M0 -55 C-8 -35 -6 -15 0 -2 C6 -15 8 -35 0 -55 Z" fill="#FFFDF0" />
    <!-- Dark Wick -->
    <line x1="0" y1="-2" x2="0" y2="8" stroke="#3B0D16" stroke-width="2.5" />
    <!-- Brass Diya Bowl -->
    <ellipse cx="0" cy="14" rx="60" ry="16" fill="#42141C" />
    <path d="M-60 14 C-60 48 -22 62 0 62 C22 62 60 48 60 14 Z" fill="url(#goldGrad)" stroke="#876813" stroke-width="2" />
    <ellipse cx="0" cy="12" rx="52" ry="10" fill="#5C2028" opacity="0.8" />
    <path d="M-28 62 L28 62 L36 72 L-36 72 Z" fill="url(#goldGrad)" stroke="#876813" stroke-width="1.5" />
    <!-- Golden Stardust Sparks -->
    <circle cx="12" cy="-90" r="1.8" fill="#FFFDF0" opacity="0.9" />
    <circle cx="-8" cy="-105" r="1.4" fill="#F5D77F" opacity="0.8" />
    <circle cx="4" cy="-120" r="1" fill="#FFFDF0" opacity="0.7" />
  </g>

  <!-- Dignified Footer Attribution for Paid Card -->
  ${!isWatermarked ? `
  <g transform="translate(600, 742)">
    <text text-anchor="middle" y="0" class="modern-sans" font-size="12" letter-spacing="3" fill="#D4AF37" opacity="0.85">
      MADE WITH ❤️ &amp; FESTIVE MAGIC
    </text>
    <text text-anchor="middle" y="22" class="modern-sans" font-weight="600" font-size="14" fill="#FFF3DC">
      Designed &amp; Developed by Himanshu Kumar
    </text>
  </g>
  ` : ''}

  ${watermarkSvg}
</svg>
`.trim();
}
