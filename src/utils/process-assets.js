import { getResponsiveUrl, getSrcset } from "./responsive-assets.js";

/**
 * Extracts the asset path from a CSS url() string.
 * @param {string} urlString - The URL string e.g. "url('/assets/image.png')"
 * @returns {string|undefined} The extracted path
 */
export function extractAssetPath(urlString) {
	if (!urlString) return undefined;
	const match = urlString.match(/url\(['"]?(\/assets\/[^'")\s]+)['"]?\)/);
	return match ? match[1] : undefined;
}

/**
 * Process an image path to use correct asset path.
 *
 * @param {string} imagePath - The image path (e.g., "/assets/image.png")
 * @returns {string|undefined} The processed image path
 */
export function processImagePath(imagePath) {
	if (!imagePath) return undefined;
	return getResponsiveUrl(imagePath);
}

/**
 * Get the srcset for an image path.
 *
 * @param {string} imagePath - The image path
 * @returns {string|undefined} The generated srcset
 */
export function processImageSrcset(imagePath) {
	if (!imagePath) return undefined;
	return getSrcset(imagePath);
}
