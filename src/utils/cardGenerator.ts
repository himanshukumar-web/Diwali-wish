import { OrderRecord, ThemeId } from '../types';
import { THEMES } from '../data/plansData';

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateCardSvg(order: Partial<OrderRecord>): string {
  const theme = THEMES[(order.theme as ThemeId) || 'maroon_gold'] || THEMES.maroon_gold;
  const rName = order.recipient_name || 'Dear';
  const cName = order.customer_name || 'Someone Special';
  const message = order.greeting_message || 'May this Diwali bring happiness, peace, and endless prosperity to your home!';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <radialGradient id="cardBg" cx="50%" cy="20%" r="80%">
      <stop offset="0%" stop-color="${theme.primaryColor}" />
      <stop offset="60%" stop-color="#180B0B" />
      <stop offset="100%" stop-color="#080304" />
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF9E6" />
      <stop offset="30%" stop-color="#F5D77F" />
      <stop offset="70%" stop-color="#D4AF37" />
      <stop offset="100%" stop-color="#AA8214" />
    </linearGradient>
    <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="800" fill="url(#cardBg)" />

  <!-- Outer Ornate Frame -->
  <rect x="30" y="30" width="1140" height="740" rx="24" fill="none" stroke="url(#goldGrad)" stroke-width="3" opacity="0.8" />
  <rect x="44" y="44" width="1112" height="712" rx="16" fill="none" stroke="#D4AF37" stroke-width="1.2" stroke-dasharray="8 6" opacity="0.6" />

  <!-- Top Center Sanskrit Mantra -->
  <g transform="translate(600, 110)">
    <rect x="-180" y="-30" width="360" height="48" rx="24" fill="#3B0D16" stroke="#D4AF37" stroke-width="1.5" opacity="0.9" />
    <text text-anchor="middle" y="2" font-family="'Noto Serif Devanagari', 'Noto Sans Devanagari', serif" font-weight="700" font-size="22" fill="#F5D77F">॥ श्री गणेशाय नमः ॥</text>
  </g>

  <!-- Main Grand Devanagari Heading -->
  <text x="600" y="220" text-anchor="middle" font-family="'Noto Serif Devanagari', 'Noto Sans Devanagari', serif" font-weight="900" font-size="68" fill="url(#goldGrad)">
    ॥ शुभ दीपावली ॥
  </text>
  <text x="600" y="270" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-style="italic" font-weight="600" font-size="24" fill="#FFF3DC" opacity="0.9">
    A Festival of Lights, Love &amp; Togetherness
  </text>

  <!-- Divider with Gold Motif -->
  <line x1="350" y1="300" x2="850" y2="300" stroke="url(#goldGrad)" stroke-width="2" />
  <circle cx="600" cy="300" r="8" fill="#D4AF37" />

  <!-- Center Card Body for Recipient -->
  <g transform="translate(600, 420)">
    <rect x="-420" y="-80" width="840" height="210" rx="20" fill="#200B10" stroke="#D4AF37" stroke-width="1.5" opacity="0.85" />
    <text text-anchor="middle" y="-35" font-family="'Playfair Display', Georgia, serif" font-weight="700" font-size="34" fill="#F5D77F">
      Dear ${escapeXml(rName)} &amp; Your Wonderful Family
    </text>
    <text text-anchor="middle" y="15" font-family="'Noto Serif Devanagari', 'Inter', sans-serif" font-size="20" fill="#FFF3DC">
      ${escapeXml(message.slice(0, 140))}
    </text>
    <text text-anchor="middle" y="80" font-family="'Noto Serif Devanagari', 'Inter', sans-serif" font-weight="700" font-size="22" fill="#FFB800">
      With Love, ${escapeXml(cName)} ❤️
    </text>
  </g>

  <!-- Left Diya -->
  <g transform="translate(180, 520)">
    <ellipse cx="0" cy="-35" rx="22" ry="32" fill="#FFAA33" filter="url(#flameGlow)" opacity="0.85" />
    <ellipse cx="0" cy="-35" rx="12" ry="18" fill="#FFF8E7" />
    <ellipse cx="0" cy="5" rx="55" ry="14" fill="#42141C" />
    <path d="M-55 5 C-55 35 -20 48 0 48 C20 48 55 35 55 5 Z" fill="url(#goldGrad)" stroke="#947214" stroke-width="2" />
  </g>

  <!-- Right Diya -->
  <g transform="translate(1020, 520)">
    <ellipse cx="0" cy="-35" rx="22" ry="32" fill="#FFAA33" filter="url(#flameGlow)" opacity="0.85" />
    <ellipse cx="0" cy="-35" rx="12" ry="18" fill="#FFF8E7" />
    <ellipse cx="0" cy="5" rx="55" ry="14" fill="#42141C" />
    <path d="M-55 5 C-55 35 -20 48 0 48 C20 48 55 35 55 5 Z" fill="url(#goldGrad)" stroke="#947214" stroke-width="2" />
  </g>

  <!-- Footer Signature & Creator Credit -->
  <text x="600" y="695" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" letter-spacing="3" fill="#D4AF37" opacity="0.85">
    MADE WITH ❤️ &amp; FESTIVE MAGIC
  </text>
  <text x="600" y="725" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-weight="700" font-size="16" fill="#FFF3DC">
    Designed &amp; Developed by Himanshu Kumar
  </text>
  <text x="600" y="748" text-anchor="middle" font-family="'Inter', sans-serif" font-size="12" fill="#D4AF37" opacity="0.6">
    © 2026 Himanshu Kumar. All Rights Reserved.
  </text>
</svg>
`.trim();
}

