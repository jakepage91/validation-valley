import { logger } from "./logger-service.js";

/**
 * Storage Interface (Implicit)
 * @typedef {Object} StorageAdapter
 * @property {function(string): unknown} getItem
 * @property {function(string, any): void} setItem
 * @property {function(string): void} removeItem
 * @property {function(): void} clear
 */

/**
 * LocalStorageAdapter
 * Concrete implementation of StorageAdapter using browser localStorage.
 * Handles JSON serialization/deserialization automatically.
 */
export class LocalStorageAdapter {
	/**
	 * Get item from storage.
	 * Parses JSON automatically.
	 * @param {string} key - The key to retrieve
	 * @returns {unknown} Parsed value or null if not found or error
	 */
	getItem(key) {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : null;
		} catch (e) {
			logger.error(`Error getting item ${key} from storage:`, e);
			return null;
		}
	}

	/**
	 * Set item in storage.
	 * Stringifies value to JSON automatically.
	 * @param {string} key - The key to set
	 * @param {unknown} value - The value to store
	 */
	setItem(key, value) {
		try {
			const serialized = JSON.stringify(value);
			localStorage.setItem(key, serialized);
		} catch (e) {
			logger.error(`Error setting item ${key} in storage:`, e);
		}
	}

	/**
	 * Remove item from storage.
	 * @param {string} key - The key to remove
	 */
	removeItem(key) {
		try {
			localStorage.removeItem(key);
		} catch (e) {
			logger.error(`Error removing item ${key} from storage:`, e);
		}
	}

	/**
	 * Clear all items from storage.
	 */
	clear() {
		try {
			localStorage.clear();
		} catch (e) {
			logger.error("Error clearing storage:", e);
		}
	}
}
