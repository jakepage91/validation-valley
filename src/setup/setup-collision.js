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
	).collision = new CollisionController(host, {
		onExitCollision: () => {
			// Trigger via command bus instead of direct host call
			import("../commands/advance-chapter-command.js").then((m) => {
				context.commandBus.execute(
					new m.AdvanceChapterCommand({
						gameState: context.gameState,
						questController: context.questController,
					}),
				);
			});
		},
	});
}
