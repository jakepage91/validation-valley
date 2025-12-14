/**
 * Observable - Base class for reactive objects
 * Implements the Observer pattern
 */
export class Observable {
	constructor() {
		this.listeners = new Set();
	}

	/**
	 * Subscribe to changes
	 * @param {Function} listener
	 * @returns {Function} Unsubscribe function
	 */
	subscribe(listener) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	/**
	 * Notify all listeners of a change
	 * @param {any} data - Data to pass to listeners
	 * @param {any} [oldData] - Optional previous state
	 */
	notify(data, oldData) {
		this.listeners.forEach((listener) => {
			try {
				listener(data, oldData);
			} catch (e) {
				console.error("Error in listener:", e);
			}
		});
	}
}
