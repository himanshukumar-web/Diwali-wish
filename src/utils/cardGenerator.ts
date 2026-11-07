import { ThemeId } from '../types';

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

export function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Normalizes recipient line, preventing duplicate words like "Dear Dear" or "प्रिय प्रिय".
 * Displays recipient name only once with elegant festive prefix and suffix.
 */
export function formatRecipientLine(rawName: string, lang: 'hi' | 'en'): string {
  const trimmed = (rawName || '').trim();

  if (lang === 'hi') {
    if (!trimmed || trimmed === 'प्रिय' || trimmed.toLowerCase() === 'dear') {
      return 'आपके और आपके प्यारे परिवार को';
    }
    const clean = trimmed.replace(/^(प्रिय|श्रीमान|श्रीमती|श्री)\s+/i, '').trim();
    const finalName = clean || trimmed;
    return `प्रिय ${escapeXml(finalName)} और आपके परिवार को`;
  } else {
    if (!trimmed || trimmed.toLowerCase() === 'dear') {
      return 'To You & Your Wonderful Family';
    }
    const clean = trimmed.replace(/^(dear|to dear|to)\s+/i, '').trim();
    const finalName = clean || trimmed;
    return `To Dear ${escapeXml(finalName)} & Your Family`;
  }
}

/**
 * Normalizes sender line, ensuring sender name appears only once with festive styling.
 */
export function formatSenderLine(rawName: string, lang: 'hi' | 'en'): string {
  const trimmed = (rawName || '').trim();
  const defaultSender = 'Himanshu Kumar';
  const nameToUse = trimmed || defaultSender;

  if (lang === 'hi') {
    const clean = nameToUse.replace(/^(सस्नेह|सादर|की तरफ से)[:,\s]*/i, '').trim();
    return `सस्नेह: ${escapeXml(clean || nameToUse)} ❤️`;
  } else {
    const clean = nameToUse.replace(/^(with love|with regards|from)[:,\s]*/i, '').trim();
    return `With Love: ${escapeXml(clean || nameToUse)} ❤️`;
  }
}

/**
 * Intelligently wraps text into multiple lines for portrait SVG rendering (1080x1350)
 * ensuring that long greetings never clip, stretch, or overflow.
 */
export function wrapSvgLines(text: string, maxCharsPerLine = 42, maxLines = 5): string[] {
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
 * Generates a royal portrait greeting card SVG (1080 x 1350, 4:5 aspect ratio).
 * Features balanced typography, beautiful brass diya away from text,
 * embedded Google Fonts, and clean unwatermarked paid card unlocking.
 */
export function generateCardSvg(options: CardSvgOptions): string {
  const themeKey = options.theme && THEME_PALETTES[options.theme] ? options.theme : 'maroon_gold';
  const palette = THEME_PALETTES[themeKey];
  const lang = options.lang === 'en' ? 'en' : 'hi';
  const isWatermarked = Boolean(options.isWatermarked);

  const rawRecipient = options.recipientName || options.recipient_name || '';
  const rawSender = options.senderName || options.customer_name || '';

  const recipientLine = formatRecipientLine(rawRecipient, lang);
  const senderLine = formatSenderLine(rawSender, lang);

  const defaultMessage = lang === 'hi'
    ? 'यह पावन पर्व आपके जीवन में सुख, शांति, समृद्धि और सफलता लेकर आए!'
    : 'May this divine festival of lights illuminate your path with joy, good health, and boundless prosperity!';
  const rawMessage = (options.greetingMessage || options.greeting_message || '').trim() || defaultMessage;

  // Auto-wrap message into up to 5 lines of ~42 characters
  const messageLines = wrapSvgLines(rawMessage, 42, 5);

  const mainHeading = lang === 'hi' ? '॥ शुभ दीपावली ॥' : '॥ HAPPY DIWALI ॥';
  const subtitle = lang === 'hi'
    ? 'रोशनी, प्रेम और अपनत्व का पावन पर्व'
    : 'A Festival of Lights, Joy &amp; Prosperity';

  // Dynamic recipient font size based on text length to prevent overflow
  const recipientFontSize = recipientLine.length > 44 ? 24 : recipientLine.length > 32 ? 27 : 30;

  // Subtle, tasteful diagonal watermark (never obscures greeting message, strictly for free previews)
  const watermarkSvg = isWatermarked
    ? `
  <!-- SUBTLE TASTEFUL DIAGONAL WATERMARK -->
  <g transform="rotate(-26 540 675)" opacity="0.13" pointer-events="none">
    <text x="540" y="580" text-anchor="middle" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="800" font-size="28" fill="#FFE57F" letter-spacing="4">
      ✦ FREE PREVIEW — Designed &amp; Developed by Himanshu Kumar ✦
    </text>
    <text x="540" y="740" text-anchor="middle" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="800" font-size="28" fill="#FFE57F" letter-spacing="4">
      ✦ FREE PREVIEW — Designed &amp; Developed by Himanshu Kumar ✦
    </text>
  </g>
  <!-- BOTTOM PREVIEW BADGE -->
  <g transform="translate(540, 1270)" opacity="0.95">
    <rect x="-270" y="-16" width="540" height="32" rx="16" fill="#000000" opacity="0.75" stroke="${palette.accent}" stroke-width="1.2" />
    <text text-anchor="middle" y="5" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#F5D77F" letter-spacing="1">
      FREE PREVIEW — High-Resolution Clean Card Unlocked Upon Order
    </text>
  </g>
`
    : '';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="1080" height="1350" style="background:${palette.dark};">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@600;700;800;900&amp;family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&amp;family=Inter:wght@400;600;700&amp;display=swap');
      .devanagari-title { font-family: 'Noto Serif Devanagari', 'Playfair Display', serif; }
      .royal-serif { font-family: 'Playfair Display', 'Noto Serif Devanagari', serif; }
      .modern-sans { font-family: 'Inter', sans-serif; }
    </style>

    <!-- Radial Card Backdrop Gradient -->
    <radialGradient id="cardBg" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="${palette.secondary}" />
      <stop offset="55%" stop-color="${palette.primary}" />
      <stop offset="100%" stop-color="${palette.dark}" />
    </radialGradient>

    <!-- Royal Antique Gold Linear Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.goldStops[0]}" />
      <stop offset="35%" stop-color="${palette.goldStops[1]}" />
      <stop offset="70%" stop-color="${palette.goldStops[2]}" />
      <stop offset="100%" stop-color="${palette.goldStops[3]}" />
    </linearGradient>

    <!-- Floor Glow for Diya -->
    <radialGradient id="diyaFloorGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9900" stop-opacity="0.5" />
      <stop offset="60%" stop-color="#FF6600" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#1A060A" stop-opacity="0" />
    </radialGradient>

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
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Subtle Jaali Background Pattern -->
    <pattern id="jaaliPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="${palette.accent}" stroke-width="0.8" opacity="0.07" />
      <circle cx="20" cy="20" r="2.5" fill="${palette.accent}" opacity="0.08" />
    </pattern>
  </defs>

  <!-- Base Card Background -->
  <rect width="1080" height="1350" fill="url(#cardBg)" />

  <!-- Subtle Royal Jaali Texture Overlay -->
  <rect width="1080" height="1350" fill="url(#jaaliPattern)" />

  <!-- Outer Palace Ornate Double Frame (Fixed 4:5 Proportion) -->
  <rect x="28" y="28" width="1024" height="1294" rx="28" fill="none" stroke="url(#goldGrad)" stroke-width="3" opacity="0.9" />
  <rect x="42" y="42" width="996" height="1266" rx="20" fill="none" stroke="${palette.accent}" stroke-width="1.2" stroke-dasharray="8 6" opacity="0.55" />

  <!-- Four Royal Corner Flourishes -->
  <!-- Top-Left -->
  <g transform="translate(54, 54)">
    <path d="M0 0 L32 0 Q16 16 0 32 Z" fill="url(#goldGrad)" opacity="0.8" />
    <circle cx="8" cy="8" r="4" fill="${palette.accent}" />
    <circle cx="22" cy="6" r="2.5" fill="${palette.accent}" />
    <circle cx="6" cy="22" r="2.5" fill="${palette.accent}" />
  </g>
  <!-- Top-Right -->
  <g transform="translate(1026, 54) scale(-1, 1)">
    <path d="M0 0 L32 0 Q16 16 0 32 Z" fill="url(#goldGrad)" opacity="0.8" />
    <circle cx="8" cy="8" r="4" fill="${palette.accent}" />
    <circle cx="22" cy="6" r="2.5" fill="${palette.accent}" />
    <circle cx="6" cy="22" r="2.5" fill="${palette.accent}" />
  </g>
  <!-- Bottom-Left -->
  <g transform="translate(54, 1296) scale(1, -1)">
    <path d="M0 0 L32 0 Q16 16 0 32 Z" fill="url(#goldGrad)" opacity="0.8" />
    <circle cx="8" cy="8" r="4" fill="${palette.accent}" />
    <circle cx="22" cy="6" r="2.5" fill="${palette.accent}" />
    <circle cx="6" cy="22" r="2.5" fill="${palette.accent}" />
  </g>
  <!-- Bottom-Right -->
  <g transform="translate(1026, 1296) scale(-1, -1)">
    <path d="M0 0 L32 0 Q16 16 0 32 Z" fill="url(#goldGrad)" opacity="0.8" />
    <circle cx="8" cy="8" r="4" fill="${palette.accent}" />
    <circle cx="22" cy="6" r="2.5" fill="${palette.accent}" />
    <circle cx="6" cy="22" r="2.5" fill="${palette.accent}" />
  </g>

  <!-- Hanging Golden Beaded Toran Rim at Top -->
  <g transform="translate(150, 44)" opacity="0.65">
    ${[0, 52, 104, 156, 208, 260, 312, 364, 416, 468, 520, 572, 624, 676, 728, 780].map(x => `
      <line x1="${x}" y1="0" x2="${x}" y2="12" stroke="url(#goldGrad)" stroke-width="1.2" />
      <circle cx="${x}" cy="14" r="3" fill="${palette.accent}" />
    `).join('')}
  </g>

  <!-- 1. Auspicious Top Sanskrit Capsule: "॥ श्री गणेशाय नमः ॥" -->
  <g transform="translate(540, 106)">
    <rect x="-175" y="-22" width="350" height="44" rx="22" fill="${palette.cardBoxFill}" stroke="url(#goldGrad)" stroke-width="1.6" opacity="0.95" />
    <circle cx="-145" cy="0" r="3.5" fill="${palette.accent}" />
    <circle cx="145" cy="0" r="3.5" fill="${palette.accent}" />
    <text text-anchor="middle" y="6" class="devanagari-title" font-weight="700" font-size="20" fill="#F5D77F" letter-spacing="1">
      ॥ श्री गणेशाय नमः ॥
    </text>
  </g>

  <!-- 2. Grand Festive Main Title: "॥ शुभ दीपावली ॥" -->
  <text x="540" y="196" text-anchor="middle" class="devanagari-title" font-weight="900" font-size="64" fill="url(#goldGrad)" filter="url(#goldGlow)" letter-spacing="1.5">
    ${mainHeading}
  </text>

  <!-- 3. Elegant Festive Subtitle -->
  <text x="540" y="246" text-anchor="middle" class="royal-serif" font-style="italic" font-weight="600" font-size="22" fill="#FFF3DC" opacity="0.92">
    ${subtitle}
  </text>

  <!-- 4. Ornate Center Gold Divider with Lotus Accent -->
  <g transform="translate(540, 280)">
    <line x1="-240" y1="0" x2="-25" y2="0" stroke="url(#goldGrad)" stroke-width="1.8" />
    <line x1="25" y1="0" x2="240" y2="0" stroke="url(#goldGrad)" stroke-width="1.8" />
    <circle cx="0" cy="0" r="6" fill="${palette.accent}" />
    <circle cx="-12" cy="0" r="3" fill="${palette.accent}" opacity="0.8" />
    <circle cx="12" cy="0" r="3" fill="${palette.accent}" opacity="0.8" />
    <path d="M0 -8 C-6 -2 -6 2 0 6 C6 2 6 -2 0 -8 Z" fill="#FFAA33" />
  </g>

  <!-- 5. Central Royal Inscription Scroll Box (Balanced Proportion) -->
  <g transform="translate(540, 560)">
    <!-- Box Shadow & Fill -->
    <rect x="-440" y="-230" width="880" height="460" rx="24" fill="${palette.cardBoxFill}" stroke="url(#goldGrad)" stroke-width="2" opacity="0.96" />
    <rect x="-426" y="-216" width="852" height="432" rx="16" fill="none" stroke="${palette.accent}" stroke-width="1" stroke-dasharray="6 4" opacity="0.4" />

    <!-- Recipient Line (Normalized Formatting) -->
    <text text-anchor="middle" y="-165" class="royal-serif" font-weight="700" font-size="${recipientFontSize}" fill="#F5D77F">
      ${recipientLine}
    </text>

    <!-- Divider Line below Recipient -->
    <line x1="-140" y1="-135" x2="140" y2="-135" stroke="url(#goldGrad)" stroke-width="1.2" opacity="0.7" />

    <!-- Word-Wrapped Greeting Message Lines -->
    <text text-anchor="middle" y="-80" class="devanagari-title" font-weight="600" font-size="21" fill="#FFF8E7" opacity="0.96" line-height="1.6">
      ${messageLines.map((line, idx) => `
        <tspan x="0" dy="${idx === 0 ? 0 : 36}">${escapeXml(line)}</tspan>
      `).join('')}
    </text>

    <!-- Divider Line below Greeting -->
    <line x1="-120" y1="135" x2="120" y2="135" stroke="url(#goldGrad)" stroke-width="1.2" opacity="0.7" />

    <!-- Sender Attribution (Displayed Only Once) -->
    <text text-anchor="middle" y="176" class="devanagari-title" font-weight="700" font-size="23" fill="#FFB800">
      ${senderLine}
    </text>
  </g>

  <!-- 6. Sculpted Brass Diya with Multi-Stage Living Flame (Gracefully Positioned Below Text) -->
  <g transform="translate(540, 960)">
    <!-- Floor Glow Pool -->
    <ellipse cx="0" cy="55" rx="200" ry="32" fill="url(#diyaFloorGlow)" />
    <!-- Outer Warm Aura -->
    <ellipse cx="0" cy="-45" rx="36" ry="50" fill="#FF8800" filter="url(#flameGlow)" opacity="0.8" />
    <!-- Vibrant Orange Mid Flame -->
    <path d="M0 -86 C-22 -48 -16 -16 0 0 C16 -16 22 -48 0 -86 Z" fill="#FFAA00" />
    <!-- White-Hot Inner Core -->
    <path d="M0 -60 C-10 -38 -8 -16 0 -2 C8 -16 10 -38 0 -60 Z" fill="#FFFDF0" />
    <!-- Dark Wick -->
    <line x1="0" y1="-2" x2="0" y2="10" stroke="#3B0D16" stroke-width="2.5" />
    <!-- Brass Diya Bowl -->
    <ellipse cx="0" cy="16" rx="75" ry="20" fill="#42141C" />
    <path d="M-75 16 C-75 58 -28 75 0 75 C28 75 75 58 75 16 Z" fill="url(#goldGrad)" stroke="#876813" stroke-width="2" />
    <ellipse cx="0" cy="14" rx="66" ry="12" fill="#5C2028" opacity="0.8" />
    <path d="M-36 75 L36 75 L46 88 L-46 88 Z" fill="url(#goldGrad)" stroke="#876813" stroke-width="1.5" />
    <!-- Golden Stardust Sparks -->
    <circle cx="-16" cy="-105" r="2" fill="#FFFDF0" opacity="0.9" />
    <circle cx="12" cy="-125" r="1.6" fill="#F5D77F" opacity="0.8" />
    <circle cx="-6" cy="-145" r="1.2" fill="#FFFDF0" opacity="0.7" />
  </g>

  <!-- Twin Miniature Flanking Brass Diyas (Adding Palace Symmetry) -->
  <!-- Left Flanking Diya -->
  <g transform="translate(180, 1080)">
    <ellipse cx="0" cy="-28" rx="20" ry="30" fill="#FF8800" filter="url(#flameGlow)" opacity="0.65" />
    <path d="M0 -52 C-12 -28 -10 -10 0 0 C10 -10 12 -28 0 -52 Z" fill="#FFAA00" />
    <path d="M0 -36 C-6 -22 -4 -10 0 -2 C4 -10 6 -22 0 -36 Z" fill="#FFFDF0" />
    <ellipse cx="0" cy="10" rx="42" ry="12" fill="#42141C" />
    <path d="M-42 10 C-42 34 -16 44 0 44 C16 44 42 34 42 10 Z" fill="url(#goldGrad)" stroke="#876813" stroke-width="1.5" />
  </g>
  <!-- Right Flanking Diya -->
  <g transform="translate(900, 1080)">
    <ellipse cx="0" cy="-28" rx="20" ry="30" fill="#FF8800" filter="url(#flameGlow)" opacity="0.65" />
    <path d="M0 -52 C-12 -28 -10 -10 0 0 C10 -10 12 -28 0 -52 Z" fill="#FFAA00" />
    <path d="M0 -36 C-6 -22 -4 -10 0 -2 C4 -10 6 -22 0 -36 Z" fill="#FFFDF0" />
    <ellipse cx="0" cy="10" rx="42" ry="12" fill="#42141C" />
    <path d="M-42 10 C-42 34 -16 44 0 44 C16 44 42 34 42 10 Z" fill="url(#goldGrad)" stroke="#876813" stroke-width="1.5" />
  </g>

  <!-- 7. Dignified Footer Attribution for Paid Card (Clean, Permanent Credit) -->
  ${!isWatermarked ? `
  <g transform="translate(540, 1260)">
    <text text-anchor="middle" y="0" class="modern-sans" font-size="13" letter-spacing="3" fill="#D4AF37" opacity="0.85">
      MADE WITH ❤️ &amp; FESTIVE MAGIC
    </text>
    <text text-anchor="middle" y="24" class="modern-sans" font-weight="600" font-size="15" fill="#FFF3DC">
      Designed &amp; Developed by Himanshu Kumar
    </text>
  </g>
  ` : ''}

  ${watermarkSvg}
</svg>
`.trim();
}

/**
 * Converts an SVG string into a high-resolution portrait PNG Blob (1080x1350)
 * using an in-memory HTML5 Canvas. Waits for fonts before rasterizing.
 */
export async function svgToPngBlob(
  svgString: string,
  width = 1080,
  height = 1350
): Promise<Blob> {
  // Ensure document fonts are loaded before rasterizing
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue if font readiness check throws
    }
  }

  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(blobURL);
            return reject(new Error('Canvas 2D context unavailable'));
          }
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((pngBlob) => {
            URL.revokeObjectURL(blobURL);
            if (pngBlob) {
              resolve(pngBlob);
            } else {
              reject(new Error('Failed to generate PNG blob from canvas'));
            }
          }, 'image/png');
        } catch (canvasErr) {
          URL.revokeObjectURL(blobURL);
          reject(canvasErr);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(blobURL);
        reject(new Error('Failed to load SVG into Image element for PNG conversion'));
      };

      img.src = blobURL;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Initiates an automatic browser download of a generated file blob.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const URL = window.URL || window.webkitURL || window;
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}
