import { CollisionController } from "../controllers/collision-controller.js";

/**
 * @typedef {import('lit').LitElement} CollisionHost
 * @typedef {import('../core/game-context.js').IGameContext} IGameContext
 */

/**
 * Setup CollisionController
 * @param {CollisionHost} host
 * @param {Object} dependencies
 * @param {import('../game/services/hero-state-service.js').HeroStateService} dependencies.heroState
 * @param {import('../game/services/quest-state-service.js').QuestStateService} dependencies.questState
 * @param {import('../controllers/quest-controller.js').QuestController} [dependencies.questController]
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
