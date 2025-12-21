import { QuestController } from "../controllers/quest-controller.js";

/**
 * Setup QuestController
 * @param {import('../legacys-end-app.js').LegacysEndApp} app
 */
export function setupQuest(app) {
	app.questController = new QuestController(app, {
		progressService: app.progressService,
		...app.sessionManager.getQuestControllerCallbacks(),
		// Overlay specific UI reactions that manager hasn't fully migrated yet
		onQuestStart: (quest) => {
			app.sessionManager.getQuestControllerCallbacks().onQuestStart(quest);
			app.showDialog = false;
		},
		onQuestComplete: (quest) => {
			app.sessionManager.getQuestControllerCallbacks().onQuestComplete(quest);
			app.showQuestCompleteDialog = true;
		},
	});
}
