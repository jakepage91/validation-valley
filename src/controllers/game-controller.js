/**
 * @typedef {import("lit").ReactiveController} ReactiveController
 * @typedef {import("lit").ReactiveControllerHost} ReactiveControllerHost
 * @typedef {import("../services/game-service.js").GameService} GameService
 * @typedef {import("../core/game-context.js").IGameContext} IGameContext
 */

import { AdvanceChapterCommand } from "../commands/advance-chapter-command.js";
import { EVENTS } from "../constants/events.js";

/**
 * @typedef {Object} GameControllerOptions
 * @property {GameService} gameService - Game service instance to use for game commands
 * @property {boolean} [exposeToConsole=true] - Whether to expose game service to console as window.game
 */

/**
 * GameController - Lit Reactive Controller for game logic
 *
 * Handles:
 * - Debug mode
 * - Level completion logic (listening to events)
 *
 * @implements {ReactiveController}
 */
export class GameController {
	/**
	 * @param {ReactiveControllerHost} host
	 * @param {IGameContext} context
	 * @param {GameControllerOptions} options
	 */
	constructor(host, context, options) {
		this.host = host;
		this.context = context;
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

		// Listen for level completion
		this.context.eventBus.on(
			EVENTS.UI.LEVEL_COMPLETED,
			this.handleLevelCompleted,
		);
	}

	hostDisconnected() {
		this.context.eventBus.off(
			EVENTS.UI.LEVEL_COMPLETED,
			this.handleLevelCompleted,
		);
	}

	/**
	 * Handle level completion event
	 * Executes logic to advance chapter or complete quest
	 */
	handleLevelCompleted = () => {
		const { gameState, questController, commandBus } = this.context;

		// 1. Hide dialog if open (handled by UI state, but ensures clean slate)
		gameState.setShowDialog(false);

		// 2. Check if we should advance to next chapter
		// Logic: If there is a next chapter, and we have collected the reward (or logic implies it), advance.
		// In previous GameView logic:
		// if (isRewardCollected && hasNextChapter) -> triggerLevelTransition
		// else -> setCollectedItem(true)

		// We need to check state.
		const state = gameState.getState();
		const hasNext = questController?.hasNextChapter();

		if (state.isRewardCollected && hasNext) {
			console.log("📖 Advancing to next chapter");
			// Stop auto-move if any? (Handled by AdvanceChapterCommand presumably or logic)

			if (commandBus) {
				commandBus.execute(
					new AdvanceChapterCommand({
						gameState,
						questController,
					}),
				);
			}
		} else {
			// Just mark item as collected/level complete state
			console.log("✅ Level Goal Reached (Item Collected)");
			gameState.setCollectedItem(true);
		}
	};

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
