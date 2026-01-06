import { CollisionController } from "../controllers/collision-controller.js";

/**
 * @typedef {import('lit').LitElement & { triggerLevelTransition: () => void }} CollisionHost
 */
/**
 * Setup CollisionController
 * @param {CollisionHost} host
 * @param {import('lit').LitElement} _app
 */
export function setupCollision(host, _app) {
	/** @type {CollisionHost & { collision: CollisionController }} */ (
		host
	).collision = new CollisionController(host, {
		onExitCollision: () => host.triggerLevelTransition(),
	});
}
