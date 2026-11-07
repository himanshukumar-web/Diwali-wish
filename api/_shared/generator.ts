import { OrderRecord, ThemeId } from '../../src/types';
import { THEMES } from '../../src/data/plansData';
import { getDbClient } from './db';
import { generateCardSvg } from '../../src/utils/cardGenerator';

export { generateCardSvg };

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .slice(0, 20);
}

export function generateWebsiteSlug(order: OrderRecord): string {
  const cleanName = slugify(order.recipient_name) || 'wishes';
  const shortId = order.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toLowerCase();
  return `diwali-${cleanName}-${shortId}`;
}

export function generateWebsiteUrl(slug: string, orderId: string, origin?: string): string {
  const base = origin || process.env.PUBLIC_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://diwaliwish-xi.vercel.app';
  return `${base.replace(/\/$/, '')}/?order=${orderId}&slug=${slug}`;
}

export async function uploadCardToStorage(
  orderId: string,
  svgContent: string
): Promise<string | null> {
  const db = getDbClient();
  if (!db) return null;

  try {
    const filename = `${orderId}.svg`;
    const buffer = Buffer.from(svgContent, 'utf-8');

    const { error: uploadError } = await db.storage
      .from('diwali-cards')
      .upload(filename, buffer, {
        contentType: 'image/svg+xml',
        upsert: true
      });

    if (uploadError) {
      console.warn('Storage upload warning:', uploadError.message);
      return null;
    }

    const { data: publicUrlData } = db.storage
      .from('diwali-cards')
      .getPublicUrl(filename);

    return publicUrlData.publicUrl || filename;
  } catch (err: any) {
    console.warn('Storage upload exception:', err?.message);
    return null;
  }
}
