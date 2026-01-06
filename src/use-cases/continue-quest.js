import { eventBus, GameEvents } from "../core/event-bus.js";
import { logger } from "../services/logger-service.js";

/**
 * ContinueQuestUseCase
 *
 * Business logic for continuing an in-progress quest.
 * Loads saved progress and resumes from the last checkpoint.
 */
export class ContinueQuestUseCase {
	/**
	 * @param {Object} dependencies
	 * @param {import('../controllers/quest-controller.js').QuestController} dependencies.questController
	 */
	constructor({ questController }) {
		this.questController = questController;
	}

	/**
	 * Execute the use case
	 * @param {string} questId - ID of the quest to continue
	 * @returns {Promise<{success: boolean, quest: any, error?: Error}>}
	 */
	async execute(questId) {
		try {
			// Emit loading start event
			eventBus.emit(GameEvents.LOADING_START, { source: "continueQuest" });

			// Continue the quest through the controller
			await this.questController.continueQuest(questId);
			const quest = this.questController.currentQuest;

			// Emit navigation event
			eventBus.emit(GameEvents.NAVIGATE_QUEST, { questId });

			return { success: true, quest };
		} catch (error) {
			logger.error("Failed to continue quest:", error);

			// Emit error event
			eventBus.emit(GameEvents.ERROR, {
				message: "Failed to continue quest",
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
			eventBus.emit(GameEvents.LOADING_END, { source: "continueQuest" });
		}
	}
}
