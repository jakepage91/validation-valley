import { getAssetPath } from "./asset-path.js";

/**
 * Process a background style string to use correct asset paths.
 * Replaces /assets/ paths with the correct base URL.
 * 
 * @param {string} backgroundStyle - The background style string (e.g., "url('/assets/image.png') center / cover no-repeat")
 * @returns {string} The processed background style with correct paths
 */
export function processBackgroundStyle(backgroundStyle) {
	if (!backgroundStyle) return backgroundStyle;

	// Replace all /assets/ paths with the correct base URL
	const baseUrl = import.meta.env.BASE_URL;
	return backgroundStyle.replace(/url\(['"]?(\/assets\/[^'")\s]+)['"]?\)/g, (match, path) => {
		// If path already starts with the base URL, return as-is
		if (path.startsWith(baseUrl)) {
			return `url('${path}')`;
		}
		const cleanPath = path.startsWith('/') ? path.slice(1) : path;
		return `url('${baseUrl}${cleanPath}')`;
	});
}

/**
 * Process an image path to use correct asset path.
 * 
 * @param {string} imagePath - The image path (e.g., "/assets/image.png")
 * @returns {string} The processed image path
 */
export function processImagePath(imagePath) {
	if (!imagePath) return imagePath;
	return getAssetPath(imagePath);
}
