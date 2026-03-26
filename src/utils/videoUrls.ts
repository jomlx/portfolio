/**
 * @file Video URL management utility
 * Loads video URLs from environment variables for CDN delivery
 * Prevents large video files from being committed to the repository
 */

/**
 * Video URL configuration
 * All videos are served from CDN (Cloudinary or similar)
 * to avoid committing large files to the repository
 */
export const VIDEO_URLS = {
  cinematic: import.meta.env.VITE_VIDEO_CINEMATIC,
  maryJosette: import.meta.env.VITE_VIDEO_MARY_JOSETTE,
  plantaria: import.meta.env.VITE_VIDEO_PLANTARIA,
  sonavi: import.meta.env.VITE_VIDEO_SONAVI,
  schoolCinematic: import.meta.env.VITE_VIDEO_SCHOOL_CINEMATIC,
} as const;

/**
 * Validates if a video URL is configured
 * @param videoKey - Key from VIDEO_URLS object
 * @returns true if URL is properly configured
 */
export function isVideoUrlConfigured(
  videoKey: keyof typeof VIDEO_URLS,
): boolean {
  const url = VIDEO_URLS[videoKey];
  return url !== undefined && url.length > 0;
}

/**
 * Gets a video URL with fallback
 * @param videoKey - Key from VIDEO_URLS object
 * @param fallbackUrl - Optional fallback URL if not configured
 * @returns The video URL or fallback
 */
export function getVideoUrl(
  videoKey: keyof typeof VIDEO_URLS,
  fallbackUrl?: string,
): string {
  const url = VIDEO_URLS[videoKey];
  if (!url || url === "") {
    return fallbackUrl || "";
  }
  return url;
}
