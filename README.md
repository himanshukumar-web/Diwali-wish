# 🪔 Royal Diwali Experience 2.0
### Interactive Royal Diwali Wishes & Personalized Sharing Platform

A handcrafted, royal traditional Indian interactive Diwali greeting website built with React, TypeScript, Tailwind CSS, and Framer Motion.

---

## ✨ What's New in 2.0

### 1. 🖼️ Verified Authentic Imagery & Fallbacks
- **Card 1 (पारंपरिक रंगोली कला)**: High-resolution traditional colorful Indian rangoli featuring geometric patterns, flower petals, and glowing brass diyas (`photo-1606293926075-69a00dbfde81`).
- **Card 2 (पीतल के दीप व अखंड ज्योति)**: Authentic handcrafted Indian brass diyas with realistic glowing flames and warm golden illumination (`photo-1544816155-12df9643f363`).
- **Zero Blank Area Fallback Protection**: Every card features an ornate golden Indian cultural vector fallback that ensures no card ever shows an empty black area even if an external network connection is slow or offline.

### 2. 👤 Personalized Diwali Wishes System
- **Name Entry Modal**: Welcome modal asking `"आपका शुभ नाम क्या है?"` / `"What is your name?"`.
- **Instant Dynamic Personalization**: Personalizes the entire site across headings, cards, blessings, and notes without page reload.
- **Edit Name Option**: Visitors can click the edit icon in the navbar or hero card to update their name anytime.

### 3. 💌 Personalized Sharing System (`?from=...`)
- **Viral Dynamic URL Sharing**: Visitors can generate a personalized sharing link preserving their name as the sender:
  ```
  https://yourwebsite.com/?from=Rahul
  ```
- **Sender & Recipient Distinction**: When Priya opens Rahul's link:
  - Greeting displays: `"Rahul की तरफ से आपके लिए एक खास दीपावली संदेश! ❤️"`
  - Asks Priya for her name.
  - Personalizes all wishes for Priya: `"प्रिय Priya और आपके पूरे परिवार को दीपावली की हार्दिक शुभकामनाएँ!"`
  - Final signature shows: `"With Love, Rahul ❤️"`
  - If Priya clicks share, the new link becomes `?from=Priya`.

### 4. 📲 Comprehensive Sharing Section
- **Heading**: `"खुशियाँ बाँटें, रोशनी फैलाएँ ❤️"`
- **Options**:
  - Direct WhatsApp sharing with full festive template and link.
  - One-click personalized link copy with royal toast.
  - Native device share dialog (`navigator.share`).

### 5. 👑 Creator Credit
- Permanent footer attribution:
  - `"Made with ❤️ & Festive Magic"`
  - `"Designed & Developed by Himanshu Kumar"`
  - `"© 2026 Himanshu Kumar. All Rights Reserved."`
  - Decorated with brass diya icons and golden typography, remaining completely separate from the sender's signature.

---

## 🚀 Quick Start

To run locally:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

To preview production build:
```bash
npm run preview
```
