import { VoiceController } from "../controllers/voice-controller.js";
import { logger } from "../services/logger-service.js";

/**
 * @typedef {import('../components/level-dialog.js').LevelDialog} LevelDialog
 */

/**
 * Setup VoiceController
 * @param {any} host
 * @param {import('../legacys-end-app.js').LegacysEndApp} app
 */
export function setupVoice(host, app) {
	host.voice = new VoiceController(host, {
		onMove: (dx, dy) => host.handleMove(dx, dy),
		onInteract: () => host.handleInteract(),
		onPause: () => host.togglePause(),
		onNextSlide: () => {
			const dialog = /** @type {LevelDialog} */ (
				host.shadowRoot.querySelector("level-dialog")
			);
			if (dialog) dialog.nextSlide();
		},
		onPrevSlide: () => {
			const dialog = /** @type {LevelDialog} */ (
				host.shadowRoot.querySelector("level-dialog")
			);
			if (dialog) dialog.prevSlide();
		},
		onGetDialogText: () => {
			const dialog = /** @type {LevelDialog} */ (
				host.shadowRoot.querySelector("level-dialog")
			);
			return dialog ? dialog.getCurrentSlideText() : "";
		},
		onGetContext: () => ({
			isDialogOpen: app.showDialog,
			isRewardCollected: app.hasCollectedItem,
		}),
		onMoveToNpc: () => {
			const state = host.interaction.options.getState();
			const npcPos = state.chapterData?.npc?.position;
			if (!npcPos) return;

			// Centralized move logic in GameView
			const dist = host.interaction.options.interactionDistance - 2;
			host.moveTo(npcPos.x - dist, npcPos.y);
		},
		onMoveToExit: () => {
			const chapterData = app.getChapterData(app.chapterId);
			const exitZone = chapterData?.exitZone;
			if (!exitZone) return;

			logger.info(`🚪 Moving to exit at (${exitZone.x}, ${exitZone.y})`);
			host.moveTo(exitZone.x, exitZone.y);
		},
		onDebugAction: (action, value) => {
			if (
				host.gameController.isEnabled &&
				app.gameService &&
				app.gameService[action]
			) {
				app.gameService[action](value);
			}
		},
		isEnabled: () => host.gameController?.isEnabled,
	});
}
