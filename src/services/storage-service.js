/**
 * Storage Interface (Implicit)
 * @typedef {Object} StorageAdapter
 * @property {function(string): any} getItem
 * @property {function(string, any): void} setItem
 * @property {function(string): void} removeItem
 * @property {function(): void} clear
 */

/**
 * LocalStorageAdapter
 * Concrete implementation of StorageAdapter using browser localStorage.
 */
export class LocalStorageAdapter {
	/**
	 * Get item from storage
	 * @param {string} key
	 * @returns {any} Parsed value or null
	 */
	getItem(key) {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : null;
		} catch (e) {
			console.error(`Error getting item ${key} from storage:`, e);
			return null;
		}
	}

	/**
	 * Set item in storage
	 * @param {string} key
	 * @param {any} value
	 */
	setItem(key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (e) {
			console.error(`Error setting item ${key} in storage:`, e);
		}
	}

	/**
	 * Remove item from storage
	 * @param {string} key
	 */
	removeItem(key) {
		try {
			localStorage.removeItem(key);
		} catch (e) {
			console.error(`Error removing item ${key} from storage:`, e);
		}
	}

	/**
	 * Clear all items from storage
	 */
	clear() {
		try {
			localStorage.clear();
		} catch (e) {
			console.error("Error clearing storage:", e);
		}
	}
}
