/**
 * @typedef {Object} LoggerOptions
 * @property {('debug'|'info'|'warn'|'error'|'silent')} [level='info'] - Initial log level
 * @property {boolean} [force=false] - If true, overrides environment default levels
 * @property {string} [env] - Override environment (default: import.meta.env.MODE)
 */

/**
 * LoggerService - Centralized logging with log levels.
 * Controls output verbosity based on configuration and environment.
 */
export class LoggerService {
	/**
	 * @param {LoggerOptions} [options] - Configuration options
	 */
	constructor(options = {}) {
		/** @type {string} Current active log level */
		this.level = options.level || "info"; // debug, info, warn, error

		/** @type {Object.<string, number>} key-value map for log level priorities */
		this.levels = {
			debug: 0,
			info: 1,
			warn: 2,
			error: 3,
			silent: 4,
		};

		this.env = options.env || import.meta.env?.MODE || "development";

		// Default to strict logging in test/production unless overridden
		if (this.env === "test" && !options.force) {
			this.level = "warn";
		}
	}

	/**
	 * Check if a message with the given level should be logged.
	 * @param {string} level - The level of the message to check
	 * @returns {boolean} True if the message should be logged
	 */
	shouldLog(level) {
		return this.levels[level] >= this.levels[this.level];
	}

	/**
	 * Log a debug message (lowest priority).
	 * @param {string} message - The message to log
	 * @param {...any} args - Additional arguments to log
	 */
	debug(message, ...args) {
		if (this.shouldLog("debug")) {
			console.debug(`[DEBUG] ${message}`, ...args);
		}
	}

	/**
	 * Log an info message.
	 * @param {string} message - The message to log
	 * @param {...any} args - Additional arguments to log
	 */
	info(message, ...args) {
		if (this.shouldLog("info")) {
			console.info(`[INFO] ${message}`, ...args);
		}
	}

	/**
	 * Log a warning message.
	 * @param {string} message - The message to log
	 * @param {...any} args - Additional arguments to log
	 */
	warn(message, ...args) {
		if (this.shouldLog("warn")) {
			console.warn(`[WARN] ${message}`, ...args);
		}
	}

	/**
	 * Log an error message (highest priority).
	 * @param {string} message - The message to log
	 * @param {...any} args - Additional arguments to log
	 */
	error(message, ...args) {
		if (this.shouldLog("error")) {
			console.error(`[ERROR] ${message}`, ...args);
		}
	}
}

export const logger = new LoggerService();
