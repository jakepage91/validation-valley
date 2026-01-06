import { eventBus, GameEvents } from "../core/event-bus.js";
import { logger } from "../services/logger-service.js";

/**
 * StartQuestUseCase
 *
 * Business logic for starting a new quest from the hub.
 * Coordinates between quest controller, state management, and navigation.
 */
export class StartQuestUseCase {
	/**
	 * @param {Object} dependencies
	 * @param {import('../controllers/quest-controller.js').QuestController} dependencies.questController
	 */
	constructor({ questController }) {
		this.questController = questController;
	}

	/**
	 * Execute the use case
	 * @param {string} questId - ID of the quest to start
	 * @returns {Promise<{success: boolean, quest: any, error?: Error}>}
	 */
	async execute(questId) {
		try {
			// Emit loading start event
			eventBus.emit(GameEvents.LOADING_START, { source: "startQuest" });

			// Start the quest through the controller
			await this.questController.startQuest(questId);
			const quest = this.questController.currentQuest;

			// Emit success events
			eventBus.emit(GameEvents.QUEST_START, { questId, quest });
			eventBus.emit(GameEvents.NAVIGATE_QUEST, { questId });

			return { success: true, quest };
		} catch (error) {
			logger.error("Failed to start quest:", error);

			// Emit error event
			eventBus.emit(GameEvents.ERROR, {
				message: "Failed to start quest",
				error,
				context: { questId },
			});

			return {
				success: false,
				quest: null,
				error: /** @type {Error} */ (error),
			};
		} finally {
			// Always emit loading end
			eventBus.emit(GameEvents.LOADING_END, { source: "startQuest" });
		}
	}
}
