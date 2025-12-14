/**
 * ServiceContainer - Simple Dependency Injection Container
 */
export class ServiceContainer {
	constructor() {
		this.services = new Map();
	}

	/**
	 * Register a service instance
	 * @param {string|Symbol} key
	 * @param {Object} service
	 */
	register(key, service) {
		if (this.services.has(key)) {
			console.warn(`Service ${String(key)} already registered. Overwriting.`);
		}
		this.services.set(key, service);
	}

	/**
	 * Get a registered service
	 * @param {string|Symbol} key
	 * @returns {Object}
	 */
	get(key) {
		if (!this.services.has(key)) {
			throw new Error(`Service ${String(key)} not found`);
		}
		return this.services.get(key);
	}

	/**
	 * Clear all services (useful for testing)
	 */
	clear() {
		this.services.clear();
	}
}

// Global Singleton Instance
export const container = new ServiceContainer();
