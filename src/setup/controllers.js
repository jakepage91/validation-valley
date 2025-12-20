import { ROUTES } from "../constants/routes.js";
import { CharacterContextController } from "../controllers/character-context-controller.js";
import { CollisionController } from "../controllers/collision-controller.js";
import { DebugController } from "../controllers/debug-controller.js";
import { GameZoneController } from "../controllers/game-zone-controller.js";
import { InteractionController } from "../controllers/interaction-controller.js";
import { KeyboardController } from "../controllers/keyboard-controller.js";
import { QuestController } from "../controllers/quest-controller.js";
import { ServiceController } from "../controllers/service-controller.js";
import { VoiceController } from "../controllers/voice-controller.js";
import { logger } from "../services/logger-service.js";

/** @typedef {import('../legacys-end-app.js').LegacysEndApp} LegacysEndApp */

/**
 * Setup application controllers
 * @param {LegacysEndApp} app
 */
export function setupControllers(app) {
	// Initialize KeyboardController
	app.keyboard = new KeyboardController(app, {
		speed: 2.5,
		onMove: (dx, dy) => app.handleMove(dx, dy),
		onInteract: () => app.handleInteract(),
		onPause: () => app.togglePause(),
		isEnabled: () =>
			!app.isEvolving && !app.showDialog && !app.isPaused && !app.isInHub,
	});

	// Initialize DebugController
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

	// Initialize VoiceController
	app.voice = new VoiceController(app, {
		onMove: (dx, dy) => app.handleMove(dx, dy),
		onInteract: () => app.handleInteract(),
		onPause: () => app.togglePause(),
		onNextSlide: () => {
			const dialog = app.shadowRoot.querySelector("game-view")?.shadowRoot.querySelector("level-dialog");
			if (dialog) dialog.nextSlide();
		},
		onPrevSlide: () => {
			const dialog = app.shadowRoot.querySelector("game-view")?.shadowRoot.querySelector("level-dialog");
			if (dialog) dialog.prevSlide();
		},
		onGetDialogText: () => {
			const dialog = app.shadowRoot
				.querySelector("game-view")
				?.shadowRoot.querySelector("level-dialog");
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

	// De-coupled voice celebration
	app.sessionManager.subscribe((event) => {
		if (event.type === "transition-start") {
			app.voice.celebrateChapter();
		}
	});

	// Initialize GameZoneController
	app.zones = new GameZoneController(app, {
		getChapterData: () => app.getChapterData(app.chapterId),
		hasCollectedItem: () => app.hasCollectedItem,
		onThemeChange: (theme) => {
			app.gameState.setThemeMode(theme);
			app.applyTheme();
		},
		onContextChange: (context) => {
			// Only update if changed to avoid loop/thrashing (though setState usually handles check)
			if (app.hotSwitchState !== context) {
				app.gameState.setHotSwitchState(context);
			}
		},
	});

	// Initialize CollisionController
	app.collision = new CollisionController(app, {
		onExitCollision: () => app.triggerLevelTransition(),
	});

	// Initialize ServiceController
	app.serviceController = new ServiceController(app, {
		services: app.services,
		getActiveService: () => app.getActiveService(),
		onDataLoaded: (userData) => {
			app.userData = userData;
		},
		onError: (error) => {
			app.userError = error;
		},
	});

	// Initialize CharacterContextController
	app.characterContexts = new CharacterContextController(app, {
		suitProvider: null, // Will be set in connectedCallback
		gearProvider: null,
		powerProvider: null,
		masteryProvider: null,
		getState: () => ({
			level: app.chapterId,
			chapterData: app.getChapterData(app.chapterId),
			themeMode: app.themeMode,
			hotSwitchState: app.hotSwitchState,
			hasCollectedItem: app.hasCollectedItem,
			userData: app.userData,
			activeService: app.getActiveService(),
		}),
	});

	// Initialize InteractionController
	app.interaction = new InteractionController(app, {
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

	// Initialize GameSessionManager with real values
	app.sessionManager.options.questController = app.questController;
	app.sessionManager.options.router = app.router;
	app.sessionManager.options.controllers = {
		keyboard: app.keyboard,
		interaction: app.interaction,
		collision: app.collision,
		zones: app.zones,
		voice: app.voice,
	};
	// Update internal references
	app.sessionManager.questController = app.questController;
	app.sessionManager.router = app.router;
	app.sessionManager.keyboard = app.keyboard;
	app.sessionManager.interaction = app.interaction;
	app.sessionManager.collision = app.collision;
	app.sessionManager.zones = app.zones;
}
