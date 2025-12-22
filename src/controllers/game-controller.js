/**
 * @typedef {import("lit").ReactiveController} ReactiveController
 * @typedef {import("lit").ReactiveControllerHost} ReactiveControllerHost
 * @typedef {import("../services/game-service.js").GameService} GameService
 */

/**
 * @typedef {Object} GameControllerOptions
 * @property {GameService} gameService - Game service instance to use for game commands
 * @property {boolean} [exposeToConsole=true] - Whether to expose game service to console as window.game
 */

/**
 * GameController - Lit Reactive Controller for game logic
 *
 * Handles debug mode when ?debug is present in URL
 * Uses injected GameService
 *
 * @implements {ReactiveController}
 */
export class GameController {
	/**
	 * @param {ReactiveControllerHost} host
	 * @param {GameControllerOptions} options
	 */
	constructor(host, options) {
		this.host = host;
		this.options = options;
		this.isEnabled = new URLSearchParams(window.location.search).has("debug");

		if (!options.gameService) {
			throw new Error("GameController requires a gameService option");
		}

		host.addController(this);
	}

	hostConnected() {
		if (this.isEnabled) {
			this.enableDebugMode();
		}
	}

	hostDisconnected() {
		// No cleanup needed
	}

	enableDebugMode() {
		console.log(`
🎮 DEBUG MODE ENABLED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type 'app.gameService.help()' for available commands
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		`);

		// Show initial state
		this.options.gameService.getState();
	}
}
