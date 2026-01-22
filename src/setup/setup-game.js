import { GameController } from "../controllers/game-controller.js";

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
 * @param {import('../game/interfaces.js').IHeroStateService} dependencies.heroState
 * @param {import('../game/interfaces.js').IQuestStateService} dependencies.questState
 * @param {import('../game/interfaces.js').IWorldStateService} dependencies.worldState
 * @param {import('../services/interfaces.js').IQuestController} dependencies.questController
 * @param {import('../services/interfaces.js').IQuestLoaderService} dependencies.questLoader
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
