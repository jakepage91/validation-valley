import { DebugController } from "../controllers/debug-controller.js";
import { logger } from "../services/logger-service.js";

/**
 * Setup DebugController
 * @param {import('../legacys-end-app.js').LegacysEndApp} app
 */
export function setupDebug(app) {
	app.debug = new DebugController(app, {
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
