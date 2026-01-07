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
		...context.sessionManager.getQuestControllerCallbacks(),
		// Overlay specific UI reactions that manager hasn't fully migrated yet
		onQuestStart: (quest) => {
			context.sessionManager.getQuestControllerCallbacks().onQuestStart(quest);
			context.gameState.setShowDialog(false);
		},
		onQuestComplete: (quest) => {
			context.sessionManager
				.getQuestControllerCallbacks()
				.onQuestComplete(quest);
			context.gameState.setQuestCompleted(true);
		},
	});
}
