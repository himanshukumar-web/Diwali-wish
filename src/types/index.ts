export type Language = 'hi' | 'en';

export interface PersonalizationState {
  recipientName: string;
  senderName: string;
  creatorName: string;
}

export interface DiyaItem {
  id: number;
  blessingHi: string;
  blessingEn: string;
  titleHi: string;
  titleEn: string;
}

export interface FestiveCardItem {
  id: number;
  categoryHi: string;
  categoryEn: string;
  hindi: string;
  english: string;
  iconName: string;
  colorGradient: string;
}

export interface GalleryItem {
  id: string;
  titleHi: string;
  titleEn: string;
  category: 'tradition' | 'sweets' | 'decor' | 'palace';
  descriptionHi: string;
  descriptionEn: string;
  imageUrl: string;
  tagHi: string;
  tagEn: string;
}
