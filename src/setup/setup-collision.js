import { CollisionController } from "../controllers/collision-controller.js";

/**
 * @typedef {import('lit').LitElement} CollisionHost
 * @typedef {import('../core/game-context.js').IGameContext} IGameContext
 */

/**
 * Setup CollisionController
 * @param {CollisionHost} host
 * @param {Object} dependencies
 * @param {import('../game/interfaces.js').IHeroStateService} dependencies.heroState
 * @param {import('../game/interfaces.js').IQuestStateService} dependencies.questState
 * @param {import('../services/interfaces.js').IQuestController} [dependencies.questController]
 */
export function setupCollision(
	host,
	{ heroState, questState, questController },
) {
	/** @type {CollisionHost & { collision: CollisionController }} */ (
		host
	).collision = new CollisionController(host, {
		heroState,
		questState,
		questController,
	});
}
