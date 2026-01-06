import { logger } from "../services/logger-service.js";

/**
 * Middleware Functions
 *
 * Middleware can inspect, modify, or cancel command execution.
 * They run before command execution and can return false to cancel.
 */

/**
 * Logging middleware
 * Logs all command executions for debugging
 *
 * @param {import('./i-command.js').ICommand} command
 * @returns {boolean} Always returns true (doesn't cancel)
 */
export function loggingMiddleware(command) {
	logger.debug(`[Command] Executing: ${command.name}`, command.metadata);
	return true;
}

/**
 * Analytics middleware
 * Emits events for analytics tracking
 * TODO: Add COMMAND_EXECUTED to GameEvents enum
 *
 * @param {import('./i-command.js').ICommand} command
 * @returns {boolean} Always returns true (doesn't cancel)
 */
export function analyticsMiddleware(command) {
	// Placeholder - will emit events once COMMAND_EXECUTED is added
	logger.debug(`[Analytics] Command executed: ${command.name}`);
	return true;
}

/**
 * Validation middleware
 * Ensures commands have required properties
 *
 * @param {import('./i-command.js').ICommand} command
 * @returns {boolean} False if validation fails
 */
export function validationMiddleware(command) {
	if (!command.name) {
		logger.error("[Command] Command must have a name");
		return false;
	}

	if (typeof command.execute !== "function") {
		logger.error("[Command] Command must have an execute method");
		return false;
	}

	return true;
}

/**
 * Performance middleware
 * Tracks command execution time
 *
 * @param {import('./i-command.js').ICommand} command
 * @returns {boolean} Always returns true (doesn't cancel)
 */
export function performanceMiddleware(command) {
	const startTime = performance.now();

	// Wrap execute to measure time
	const originalExecute = command.execute;
	command.execute = async function (...args) {
		const result = await originalExecute.apply(this, args);
		const duration = performance.now() - startTime;

		if (duration > 100) {
			logger.warn(
				`[Performance] Command ${command.name} took ${duration.toFixed(2)}ms`,
			);
		}

		return result;
	};

	return true;
}
