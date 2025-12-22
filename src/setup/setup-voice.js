import { VoiceController } from "../controllers/voice-controller.js";
import { logger } from "../services/logger-service.js";

/**
 * @typedef {import('../components/level-dialog.js').LevelDialog} LevelDialog
 */

/**
 * Setup VoiceController
 * @param {import('../legacys-end-app.js').LegacysEndApp} app
 */
export function setupVoice(app) {
	app.voice = new VoiceController(app, {
		onMove: (dx, dy) => app.handleMove(dx, dy),
		onInteract: () => app.handleInteract(),
		onPause: () => app.togglePause(),
		onNextSlide: () => {
			const dialog = /** @type {LevelDialog} */ (
				app.shadowRoot
					.querySelector("game-view")
					?.shadowRoot.querySelector("level-dialog")
			);
			if (dialog) dialog.nextSlide();
		},
		onPrevSlide: () => {
			const dialog = /** @type {LevelDialog} */ (
				app.shadowRoot
					.querySelector("game-view")
					?.shadowRoot.querySelector("level-dialog")
			);
			if (dialog) dialog.prevSlide();
		},
		onGetDialogText: () => {
			const dialog = /** @type {LevelDialog} */ (
				app.shadowRoot
					.querySelector("game-view")
					?.shadowRoot.querySelector("level-dialog")
			);
			return dialog ? dialog.getCurrentSlideText() : "";
		},
		onGetContext: () => ({
			isDialogOpen: app.showDialog,
			isRewardCollected: app.hasCollectedItem,
		}),
		onMoveToNpc: () => {
			const state = app.interaction.options.getState();
			const npcPos = state.chapterData?.npc?.position;
			if (!npcPos) return;

			// Centralized move logic in sessionManager
			const dist = app.interaction.options.interactionDistance - 2;
			app.sessionManager.moveTo(npcPos.x - dist, npcPos.y);
		},
		onMoveToExit: () => {
			const chapterData = app.getChapterData(app.chapterId);
			const exitZone = chapterData?.exitZone;
			if (!exitZone) return;

			logger.info(`🚪 Moving to exit at (${exitZone.x}, ${exitZone.y})`);
			app.sessionManager.moveTo(exitZone.x, exitZone.y);
		},
		onDebugAction: (action, value) => {
			if (app.debug.isEnabled && window.game && window.game[action]) {
				window.game[action](value);
			}
		},
		isEnabled: () => app.debug?.isEnabled,
	});
}
