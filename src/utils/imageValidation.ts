/**
 * Image Validation and Perceptual Hashing Utilities for Community Report Submissions
 */

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  imageHash?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  stats?: {
    meanLuminance: number;
    stdDev: number;
  };
}

export interface TechnicalQualityResult {
  valid: boolean;
  error?: string;
  isBlank?: boolean;
  isCorrupt?: boolean;
  meanLuminance?: number;
  stdDev?: number;
}

// Allowed MIME types and file extensions
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];

// Minimum file size: 32 bytes (rejects 0-byte, empty, or corrupt files)
const MIN_FILE_SIZE_BYTES = 32;
// Maximum file size: 15 MB
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
// Minimum pixel resolution: 32 x 32 px
const MIN_DIMENSION = 32;

/**
 * Tier 1 Technical Image Quality Check (Hard Block)
 * Computes pixel luminance statistics, color variance, and alpha across the image.
 * Rejects all-black, all-white, flat-color, near-solid, blank, or corrupt images immediately.
 */
export async function checkImageTechnicalQuality(
  imageSource: File | HTMLImageElement | string
): Promise<TechnicalQualityResult> {
  return new Promise((resolve) => {
    let img: HTMLImageElement;
    let cleanup = () => {};

    if (imageSource instanceof HTMLImageElement) {
      img = imageSource;
    } else {
      img = new Image();
      img.crossOrigin = 'anonymous';

      if (imageSource instanceof File) {
        const objectUrl = URL.createObjectURL(imageSource);
        cleanup = () => URL.revokeObjectURL(objectUrl);
        img.src = objectUrl;
      } else {
        img.src = imageSource;
      }
    }

    const handleAnalyze = () => {
      cleanup();
      try {
        if (!img.naturalWidth || !img.naturalHeight) {
          resolve({
            valid: false,
            isCorrupt: true,
            error: 'This photo appears blank or unreadable. Please upload a real photo of the problem.',
          });
          return;
        }

        // Draw onto a 64x64 sample canvas (4,096 sample points)
        const sampleSize = 64;
        const canvas = document.createElement('canvas');
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          // If 2D context fails, allow fail-open
          resolve({ valid: true });
          return;
        }

        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imgData.data;

        if (!data || data.length === 0) {
          resolve({
            valid: false,
            isCorrupt: true,
            error: 'This photo appears blank or unreadable. Please upload a real photo of the problem.',
          });
          return;
        }

        const totalPixels = data.length / 4;
        let transparentPixels = 0;
        let sumLum = 0;
        let minLum = 255;
        let maxLum = 0;
        const luminances = new Float32Array(totalPixels);

        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        const rVals = new Float32Array(totalPixels);
        const gVals = new Float32Array(totalPixels);
        const bVals = new Float32Array(totalPixels);

        for (let i = 0, p = 0; i < data.length; i += 4, p++) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 15) {
            transparentPixels++;
          }

          // Standard ITU-R BT.601 luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          luminances[p] = lum;
          sumLum += lum;
          if (lum < minLum) minLum = lum;
          if (lum > maxLum) maxLum = lum;

          rVals[p] = r;
          gVals[p] = g;
          bVals[p] = b;
          sumR += r;
          sumG += g;
          sumB += b;
        }

        // Check for mostly transparent/blank PNG
        if (transparentPixels / totalPixels > 0.85) {
          resolve({
            valid: false,
            isBlank: true,
            error: 'This photo appears blank or unreadable. Please upload a real photo of the problem.',
          });
          return;
        }

        const meanLum = sumLum / totalPixels;
        const meanR = sumR / totalPixels;
        const meanG = sumG / totalPixels;
        const meanB = sumB / totalPixels;

        let varLum = 0;
        let varR = 0;
        let varG = 0;
        let varB = 0;

        for (let p = 0; p < totalPixels; p++) {
          varLum += (luminances[p] - meanLum) ** 2;
          varR += (rVals[p] - meanR) ** 2;
          varG += (gVals[p] - meanG) ** 2;
          varB += (bVals[p] - meanB) ** 2;
        }

        const stdDevLum = Math.sqrt(varLum / totalPixels);
        const stdDevR = Math.sqrt(varR / totalPixels);
        const stdDevG = Math.sqrt(varG / totalPixels);
        const stdDevB = Math.sqrt(varB / totalPixels);
        const avgColorStdDev = (stdDevR + stdDevG + stdDevB) / 3;
        const lumRange = maxLum - minLum;

        // Hard Block Conditions (Tier 1 Technical Image Quality Check):
        // 1. All-black or near-black: mean luminance < 18, max luminance < 32, or stdDev < 8 with mean < 28
        const isNearBlack =
          meanLum < 18 ||
          maxLum < 32 ||
          (meanLum < 28 && stdDevLum < 8);

        // 2. All-white or near-white: min luminance > 230, mean luminance > 235 with low variance, or mean > 240
        const isNearWhite =
          minLum > 230 ||
          (meanLum > 235 && stdDevLum < 8) ||
          (meanLum > 240 && minLum > 215);

        // 3. Solid color / flat single tone: very low variance across luminance and color channels
        const isFlatSolidColor =
          avgColorStdDev < 4.5 ||
          (stdDevLum < 5.5 && avgColorStdDev < 6.0) ||
          (lumRange < 15 && avgColorStdDev < 6.5);

        if (isNearBlack || isNearWhite || isFlatSolidColor) {
          resolve({
            valid: false,
            isBlank: true,
            meanLuminance: meanLum,
            stdDev: stdDevLum,
            error: 'This photo appears blank or unreadable. Please upload a real photo of the problem.',
          });
          return;
        }

        resolve({
          valid: true,
          meanLuminance: meanLum,
          stdDev: stdDevLum,
        });
      } catch (err) {
        cleanup();
        resolve({
          valid: false,
          isCorrupt: true,
          error: 'This photo appears blank or unreadable. Please upload a real photo of the problem.',
        });
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      handleAnalyze();
    } else {
      img.onload = handleAnalyze;
      img.onerror = () => {
        cleanup();
        resolve({
          valid: false,
          isCorrupt: true,
          error: 'This photo appears blank or unreadable. Please upload a real photo of the problem.',
        });
      };
    }
  });
}

/**
 * Validates an uploaded File against type, size, corruption, minimum resolution,
 * and Tier 1 technical quality (hard-blocking blank/black/white/corrupt/solid images).
 * Also computes perceptual hash for duplicate detection.
 */
export async function validateImageFile(file: File): Promise<ImageValidationResult> {
  // 1. File Type Validation
  const fileExt = '.' + (file.name.split('.').pop() || '').toLowerCase();
  const mimeAllowed = file.type ? ALLOWED_MIME_TYPES.has(file.type.toLowerCase()) : false;
  const extAllowed = ALLOWED_EXTENSIONS.includes(fileExt);

  if (!mimeAllowed && !extAllowed) {
    return {
      valid: false,
      error: 'Invalid file format. Only JPG, PNG, WebP, and HEIC photos are accepted.',
    };
  }

  // 2. File Size Validation
  if (file.size < MIN_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'This photo appears blank or unreadable. Please upload a real photo of the problem.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Photo is too large (maximum 15 MB). Please select a smaller photo or compress it.',
    };
  }

  // 3. Image Loading & Resolution Validation
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);

      if (img.naturalWidth < MIN_DIMENSION || img.naturalHeight < MIN_DIMENSION) {
        resolve({
          valid: false,
          error: 'This photo appears blank or unreadable. Please upload a real photo of the problem.',
        });
        return;
      }

      // Tier 1 Technical Image Quality Check (Hard Block)
      const techCheck = await checkImageTechnicalQuality(img);
      if (!techCheck.valid) {
        resolve({
          valid: false,
          error: techCheck.error || 'This photo appears blank or unreadable. Please upload a real photo of the problem.',
        });
        return;
      }

      // Compute perceptual hash for duplicate detection
      try {
        const hashResult = computePerceptualHashFromImage(img);
        resolve({
          valid: true,
          imageHash: hashResult.hash,
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeBytes: file.size,
          stats: {
            meanLuminance: techCheck.meanLuminance ?? 0,
            stdDev: techCheck.stdDev ?? 0,
          },
        });
      } catch (err) {
        resolve({
          valid: true,
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeBytes: file.size,
        });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        valid: false,
        error: 'This photo appears blank or unreadable. Please upload a real photo of the problem.',
      });
    };

    img.src = objectUrl;
  });
}


/**
 * Computes a perceptual hash from an image data URL or public URL.
 */
export async function computeImageHashFromUrl(url: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const res = computePerceptualHashFromImage(img);
        resolve(res.hash);
      } catch {
        resolve(simpleStringHash(url));
      }
    };

    img.onerror = () => {
      resolve(simpleStringHash(url));
    };

    img.src = url;
  });
}

/**
 * Computes a 64-bit difference hash (dHash) and checks if the image is essentially a flat single color.
 * Scales down to 9x8 grayscale canvas for difference comparisons.
 */
function computePerceptualHashFromImage(img: HTMLImageElement): { hash: string; isBlank: boolean } {
  const canvas = document.createElement('canvas');
  const width = 9;
  const height = 8;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return { hash: simpleStringHash(img.src), isBlank: false };
  }

  ctx.drawImage(img, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Convert to grayscale luminance
  const grays: number[] = [];
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    // Luminance formula
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    grays.push(gray);
    sum += gray;
  }

  // Calculate standard deviation to detect blank / single-color images
  const mean = sum / grays.length;
  let variance = 0;
  for (const g of grays) {
    variance += (g - mean) ** 2;
  }
  const stdDev = Math.sqrt(variance / grays.length);
  const isBlank = stdDev < 1.8; // Very little variance across pixels indicates a blank canvas

  // Compute 64-bit difference hash (compare each pixel with the pixel to its right)
  let hashBits = '';
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width - 1; x++) {
      const left = grays[y * width + x];
      const right = grays[y * width + (x + 1)];
      hashBits += left > right ? '1' : '0';
    }
  }

  // Convert binary string to hexadecimal
  let hex = '';
  for (let i = 0; i < hashBits.length; i += 4) {
    const chunk = hashBits.slice(i, i + 4);
    hex += parseInt(chunk, 2).toString(16);
  }

  return { hash: hex || '0000000000000000', isBlank };
}

/**
 * Calculates Hamming distance between two hex hashes.
 */
export function hammingDistance(hex1: string, hex2: string): number {
  if (!hex1 || !hex2 || hex1.length !== hex2.length) return 999;
  let dist = 0;
  for (let i = 0; i < hex1.length; i++) {
    const v1 = parseInt(hex1[i], 16);
    const v2 = parseInt(hex2[i], 16);
    let xor = v1 ^ v2;
    while (xor > 0) {
      if (xor & 1) dist++;
      xor >>= 1;
    }
  }
  return dist;
}

/**
 * Simple fallback string hash
 */
function simpleStringHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0').slice(0, 16);
}
