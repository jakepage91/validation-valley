/**
 * Theme Modes
 * @readonly
 * @enum {string}
 */
export const ThemeModes = {
	LIGHT: "light",
	DARK: "dark",
	SYSTEM: "system",
};

/**
 * @typedef {typeof ThemeModes[keyof typeof ThemeModes]} ThemeMode
 */

/**
 * Hot Switch States
 * @readonly
 * @enum {string}
 */
export const HotSwitchStates = {
	LEGACY: "legacy",
	NEW: "new",
	MOCK: "mock",
};

/**
 * @typedef {typeof HotSwitchStates[keyof typeof HotSwitchStates] | null} HotSwitchState
 */

/**
 * Storage Keys
 * Centralized keys for localStorage/sessionStorage.
 */
export const StorageKeys = {
	PROGRESS: "legacys-end-progress",
	SETTINGS: "legacys-end-settings",
	THEME: "legacys-end-theme",
	DEBUG: "legacys-end-debug",
};

/**
 * Game Constants
 * Global configuration constants.
 */
export const GameConstants = {
	DEFAULT_LOCALE: "en",
	DEFAULT_THEME: ThemeModes.SYSTEM,
	MIN_POS: 0,
	MAX_POS: 100,
};

/**
 * Zone Types
 * @readonly
 * @enum {string}
 */
export const ZoneTypes = {
	THEME_CHANGE: "THEME_CHANGE",
	CONTEXT_CHANGE: "CONTEXT_CHANGE",
	NONE: "NONE",
};

/**
 * @typedef {typeof ZoneTypes[keyof typeof ZoneTypes]} ZoneType
 */
