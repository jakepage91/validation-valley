import { InteractionController } from "../controllers/interaction-controller.js";

/**
 * Setup InteractionController
 * @param {any} host
 * @param {import('../legacys-end-app.js').LegacysEndApp} app
 */
export function setupInteraction(host, app) {
	host.interaction = new InteractionController(host, {
		onShowDialog: () => {
			app.showDialog = true;
		},
		onVictory: () => {
			app.gameState.setCollectedItem(true);
			if (app.questController.currentChapter) {
				app.progressService.updateChapterState(
					app.questController.currentChapter.id,
					{ collectedItem: true },
				);
			}
		},
		onLocked: (message) => {
			app.gameState.setLockedMessage(message);
		},
		getState: () => ({
			level: app.chapterId,
			chapterData: app.getChapterData(app.chapterId),
			heroPos: app.heroPos,
			hotSwitchState: app.hotSwitchState,
			hasCollectedItem: app.hasCollectedItem,
		}),
		getNpcPosition: () => app.getChapterData(app.chapterId)?.npc?.position,
	});
}
