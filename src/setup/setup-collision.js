import { CollisionController } from "../controllers/collision-controller.js";

/**
 * Setup CollisionController
 * @param {import('../legacys-end-app.js').LegacysEndApp} app
 */
export function setupCollision(app) {
	app.collision = new CollisionController(app, {
		onExitCollision: () => app.triggerLevelTransition(),
	});
}
