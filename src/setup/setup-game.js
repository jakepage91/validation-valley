import { GameController } from "../controllers/game-controller.js";
import { GameService } from "../services/game-service.js";
import { logger } from "../services/logger-service.js";

/**
 * Setup GameController with GameService
 * @param {import('../legacys-end-app.js').LegacysEndApp} app
 */
/**
 * Setup GameService
 * @param {import('../legacys-end-app.js').LegacysEndApp} app
 */
export function setupGameService(app) {
	// Create GameService with all game operation callbacks
	app.gameService = new GameService({
		setLevel: (chapterId) => {
			const data = app.getChapterData(chapterId);
			if (data) {
				// Use manager for consistent state and navigation
				app.sessionManager.loadChapter(app.currentQuest?.id, chapterId);
			}
		},
		giveItem: () => {
			app.gameState.setCollectedItem(true);
			logger.info(`✨ Item collected!`);
		},
		teleport: (x, y) => {
			app.gameState.setHeroPosition(x, y);
			logger.info(`📍 Teleported to(${x}, ${y})`);
		},
		getState: () => ({
			level: app.chapterId,
			hasCollectedItem: app.hasCollectedItem,
			position: app.heroPos,
			themeMode: app.themeMode,
			hotSwitchState: app.hotSwitchState,
			userData: app.userData,
		}),
		setTheme: (mode) => {
			if (mode === "light" || mode === "dark") {
				app.gameState.setThemeMode(mode);
				app.applyTheme();
				logger.info(`🎨 Theme set to: ${mode} `);
			} else {
				logger.error(`❌ Invalid theme: ${mode}. Use 'light' or 'dark'`);
			}
		},
		// Quest commands
		startQuest: (questId) => {
			app.sessionManager.startQuest(questId);
		},
		completeQuest: () => {
			app.sessionManager.completeQuest();
		},
		completeChapter: () => {
			app.sessionManager.completeChapter();
		},
		returnToHub: () => {
			app.sessionManager.returnToHub();
		},
		listQuests: () => {
			const available = app.questController.getAvailableQuests();
			logger.info("📋 Available Quests:");
			available.forEach((q) => {
				const progress = app.questController.getQuestProgress(q.id);
				const completed = app.questController.isQuestCompleted(q.id);
				logger.info(`  ${completed ? "✅" : "⏳"} ${q.name} (${progress}%)`);
			});
			return available;
		},
		getProgress: () => {
			return app.progressService.getProgress();
		},
		resetProgress: () => {
			app.progressService.resetProgress();
			logger.info("🔄 Progress reset");
		},
	});
}

/**
 * @typedef {import('lit').LitElement & { gameService: import('../services/game-service.js').GameService }} GameApp
 */
/**
 * Setup GameController
 * @param {import('lit').LitElement} host
 * @param {GameApp} app
 */
export function setupGameController(host, app) {
	// Create GameController with GameService
	/** @type {import('lit').LitElement & { gameController: GameController }} */ (
		host
	).gameController = new GameController(host, {
		gameService: app.gameService,
	});
}
