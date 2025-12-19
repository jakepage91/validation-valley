/**
 * Get the correct asset path for the current environment.
 * In development, returns the path as-is.
 * In production (GitHub Pages), prepends the base URL.
 * 
 * @param {string} path - The asset path (e.g., "/assets/image.png")
 * @returns {string} The correct asset path for the current environment
 */
export function getAssetPath(path) {
	// Remove leading slash if present
	const cleanPath = path.startsWith('/') ? path.slice(1) : path;

	// In production, prepend the base URL
	// import.meta.env.BASE_URL is set by Vite based on the `base` config
	return `${import.meta.env.BASE_URL}${cleanPath}`;
}
