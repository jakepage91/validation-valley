import { CollisionController } from "../controllers/collision-controller.js";

/**
 * @typedef {import('lit').LitElement} CollisionHost
 * @typedef {import('../core/game-context.js').IGameContext} IGameContext
 */

/**
 * Setup CollisionController
 * @param {CollisionHost} host
 * @param {IGameContext} context
 */
export function setupCollision(host, context) {
	/** @type {CollisionHost & { collision: CollisionController }} */ (
		host
	).collision = new CollisionController(host, context);
}
