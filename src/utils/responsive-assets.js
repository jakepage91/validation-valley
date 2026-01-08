/**
 * Responsive Assets Utility
 *
 * Maps legacy /assets/ paths to processed Vite assets with srcset support.
 */

// Load all assets as standard URLs
const standardAssets = import.meta.glob(
	"/src/assets/**/*.{png,jpg,jpeg,webp,svg}",
	{
		eager: true,
		import: "default",
	},
);

// Load all assets with srcset generation
const responsiveAssets = import.meta.glob(
	"/src/assets/**/*.{png,jpg,jpeg,webp}",
	{
		eager: true,
		query: {
			srcset: true,
			w: "200;400;800;1200;1600",
			format: "webp",
			quality: 80,
			as: "srcset",
		},
		import: "default",
	},
);

/**
 * Normalizes a path to match the glob keys (relative to project root)
 * @param {string} path - e.g., "/assets/hero.png"
 * @returns {string} - e.g., "/src/assets/hero.png"
 */
function normalizePath(path) {
	if (!path) return "";
	let cleanPath = path;
	if (cleanPath.startsWith(import.meta.env.BASE_URL)) {
		cleanPath = cleanPath.slice(import.meta.env.BASE_URL.length);
	}
	if (cleanPath.startsWith("/")) cleanPath = cleanPath.slice(1);
	// If it's an /assets/ path, map it to /src/assets/
	if (cleanPath.startsWith("assets/")) {
		return `/src/${cleanPath}`;
	}
	return cleanPath;
}

/**
 * Gets the processed URL for an asset.
 * @param {string} path - The original path (e.g., "/assets/hero.png")
 * @returns {string} - The bundled asset URL
 */
export function getResponsiveUrl(path) {
	const key = normalizePath(path);
	return /** @type {string} */ (standardAssets[key]) || path;
}

/**
 * Gets the srcset for an asset.
 * @param {string} path - The original path (e.g., "/assets/hero.png")
 * @returns {string|undefined} - The generated srcset string
 */
export function getSrcset(path) {
	const key = normalizePath(path);
	return /** @type {string} */ (responsiveAssets[key]) || undefined;
}
