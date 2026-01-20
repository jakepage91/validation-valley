import { GameController } from "../controllers/game-controller.js";
import { logger } from "../services/logger-service.js";

/**
 * @typedef {import('../core/game-context.js').IGameContext} IGameContext
 */

/**
 * @typedef {import('lit').LitElement} GameHost
 */

/**
 * Setup GameController
 * @param {GameHost} host
 * @param {Object} dependencies
 * @param {import('../services/logger-service.js').LoggerService} dependencies.logger
 * @param {import('../game/services/hero-state-service.js').HeroStateService} dependencies.heroState
 * @param {import('../game/services/quest-state-service.js').QuestStateService} dependencies.questState
 * @param {import('../game/services/world-state-service.js').WorldStateService} dependencies.worldState
 * @param {import('../controllers/quest-controller.js').QuestController} dependencies.questController
 * @param {import('../services/quest-loader-service.js').QuestLoaderService} dependencies.questLoader
 */
export function setupGameController(
	host,
	{ logger, heroState, questState, worldState, questController, questLoader },
) {
	// Create GameController with services
	/** @type {GameHost & { gameController: GameController }} */ (
		host
	).gameController = new GameController(/** @type {any} */ (host), {
		logger,
		heroState,
		questState,
		worldState,
		questController,
		questLoader,
	});
}
