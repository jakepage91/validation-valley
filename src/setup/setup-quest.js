import { QuestController } from "../controllers/quest-controller.js";

/**
 * @typedef {import('../core/game-context.js').IGameContext} IGameContext
 */

/**
 * Setup QuestController
 * @param {import('lit').LitElement} host
 * @param {IGameContext} context
 */
export function setupQuest(host, context) {
	if (!context) {
		console.error("setupQuest: context is undefined");
		return;
	}
	context.questController = new QuestController(host, {
		progressService: context.progressService,
		eventBus: /** @type {any} */ (context).eventBus,
	});
}
