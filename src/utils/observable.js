/**
 * Observable - Base class for reactive objects
 * Implements the Observer pattern
 * @template T
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
	 * @param {T} data - Data to pass to listeners
	 * @param {T} [oldData] - Optional previous state
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
