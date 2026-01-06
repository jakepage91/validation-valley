import { CollisionController } from "../controllers/collision-controller.js";

/**
 * Setup CollisionController
 * @param {any} host
 * @param {import('../legacys-end-app.js').LegacysEndApp} app
 */
export function setupCollision(host, app) {
	host.collision = new CollisionController(host, {
		onExitCollision: () => host.triggerLevelTransition(),
	});
}
