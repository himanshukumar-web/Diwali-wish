import { generateCardSvg, CardSvgOptions } from '../../api/_shared/cardGenerator';

export { generateCardSvg };
export type { CardSvgOptions };

/**
 * Converts an SVG string into a high-resolution PNG Blob using an in-memory Canvas.
 * Default resolution: 1200x800 for pristine print and social sharing quality.
 */
export function svgToPngBlob(svgString: string, width = 1200, height = 800): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(blobURL);
            return reject(new Error('Canvas 2D rendering context not available in browser.'));
          }
          ctx.drawImage(img, 0, 0, width, height);
          URL.revokeObjectURL(blobURL);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert canvas to PNG blob.'));
            }
          }, 'image/png');
        } catch (canvasErr) {
          URL.revokeObjectURL(blobURL);
          reject(canvasErr);
        }
      };

      img.onerror = (e) => {
        URL.revokeObjectURL(blobURL);
        reject(new Error('Failed to load SVG into Image element for PNG conversion: ' + String(e)));
      };

      img.src = blobURL;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Programmatically triggers a download for a Blob file.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}
