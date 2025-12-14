/**
 * LoggerService - Centralized logging with log levels
 */
export class LoggerService {
	constructor(options = {}) {
		this.level = options.level || "info"; // debug, info, warn, error
		this.levels = {
			debug: 0,
			info: 1,
			warn: 2,
			error: 3,
			silent: 4,
		};
		this.env = import.meta.env?.MODE || "development";
		// Default to strict logging in test/production unless overridden
		if (this.env === "test" && !options.force) {
			this.level = "warn";
		}
	}

	shouldLog(level) {
		return this.levels[level] >= this.levels[this.level];
	}

	debug(message, ...args) {
		if (this.shouldLog("debug")) {
			console.debug(`[DEBUG] ${message}`, ...args);
		}
	}

	info(message, ...args) {
		if (this.shouldLog("info")) {
			console.info(`[INFO] ${message}`, ...args);
		}
	}

	warn(message, ...args) {
		if (this.shouldLog("warn")) {
			console.warn(`[WARN] ${message}`, ...args);
		}
	}

	error(message, ...args) {
		if (this.shouldLog("error")) {
			console.error(`[ERROR] ${message}`, ...args);
		}
	}
}

export const logger = new LoggerService();
