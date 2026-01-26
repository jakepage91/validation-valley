import { HeroStateService } from "../game/services/hero-state-service.js";
import { QuestStateService } from "../game/services/quest-state-service.js";
import { WorldStateService } from "../game/services/world-state-service.js";
import { LocalizationService } from "../services/localization-service.js";
import { logger } from "../services/logger-service.js";
import { preloader } from "../services/preloader-service.js";
import { ProgressService } from "../services/progress-service.js";
import { SessionService } from "../services/session-service.js";
import { LocalStorageAdapter } from "../services/storage-service.js";
import {
	LegacyUserApiClient,
	MockUserApiClient,
	NewUserApiClient,
} from "../services/user-api-client.js";
import { EvaluateChapterTransitionUseCase } from "../use-cases/evaluate-chapter-transition.js";
import { Router } from "../utils/router.js";

/**
 * @typedef {Object} ServicesContext
 * @property {import('../services/storage-service.js').LocalStorageAdapter} storageAdapter
 * @property {import('../services/progress-service.js').ProgressService} progressService
 * @property {import('../services/quest-registry-service.js').QuestRegistryService} registry
 * @property {Object} services
 * @property {import('../services/preloader-service.js').PreloaderService} preloader
 * @property {import('../use-cases/evaluate-chapter-transition.js').EvaluateChapterTransitionUseCase} evaluateChapterTransition
 * @property {import('../services/localization-service.js').LocalizationService} localizationService
 * @property {import('../services/theme-service.js').ThemeService} themeService
 * @property {import('../services/session-service.js').SessionService} sessionService
 * @property {import('../game/services/hero-state-service.js').HeroStateService} heroState
 * @property {import('../game/services/quest-state-service.js').QuestStateService} questState
 * @property {import('../game/services/world-state-service.js').WorldStateService} worldState
 */

/**
 * @typedef {Object} GameContext
 * @property {import('../services/logger-service.js').LoggerService} logger
 * @property {import('../services/storage-service.js').LocalStorageAdapter} storageAdapter
 * @property {import('../services/progress-service.js').ProgressService} progressService
 * @property {import('../utils/router.js').Router} router
 * @property {Object} services
 * @property {import('../services/preloader-service.js').PreloaderService} preloader
 * @property {import('../services/quest-registry-service.js').QuestRegistryService} registry
 * @property {import('../use-cases/evaluate-chapter-transition.js').EvaluateChapterTransitionUseCase} evaluateChapterTransition
 * @property {import('../services/localization-service.js').LocalizationService} localizationService
 * @property {import('../services/theme-service.js').ThemeService} themeService
 * @property {import('../services/session-service.js').SessionService} sessionService
 * @property {import('../game/services/hero-state-service.js').HeroStateService} heroState
 * @property {import('../game/services/quest-state-service.js').QuestStateService} questState
 * @property {import('../game/services/world-state-service.js').WorldStateService} worldState
 */

/**
 * GameBootstrapper
 *
 * Responsible for initializing the game core services.
 * Controllers and UI orchestration are handled by the main app component.
 */
export class GameBootstrapper {
	/**
	 * Bootstrap the game application
	 * @param {import('lit').ReactiveControllerHost} _host - The Lit component host
	 * @returns {Promise<GameContext>}
	 */
	async bootstrap(_host) {
		logger.info("GameBootstrapper: Starting initialization...");

		const context = await this.#setupServices();
		const router = new Router();

		logger.info("GameBootstrapper: Initialization complete.");

		return {
			...context,
			logger,
			router,
		};
	}

	/**
	 * @returns {Promise<ServicesContext>}
	 */
	async #setupServices() {
		const storageAdapter = new LocalStorageAdapter();
		const loggerService = logger;

		const themeService = new (
			await import("../services/theme-service.js")
		).ThemeService(loggerService, storageAdapter);

		const registry = new (
			await import("../services/quest-registry-service.js")
		).QuestRegistryService();

		const progressService = new ProgressService(
			storageAdapter,
			registry,
			loggerService,
		);

		const localizationService = new LocalizationService(
			loggerService,
			storageAdapter,
		);

		localizationService.onLocaleChange(() => {
			registry.invalidateQuestCache();
		});

		const services = {
			legacy: new LegacyUserApiClient(),
			mock: new MockUserApiClient(),
			new: new NewUserApiClient(),
		};

		const sessionService = new SessionService();
		const heroState = new HeroStateService();
		const questState = new QuestStateService();
		const worldState = new WorldStateService();

		return {
			storageAdapter,
			progressService,
			services,
			preloader,
			evaluateChapterTransition: new EvaluateChapterTransitionUseCase(),
			localizationService,
			themeService,
			sessionService,
			registry,
			heroState,
			questState,
			worldState,
		};
	}
}
