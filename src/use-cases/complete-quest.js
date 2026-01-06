import { eventBus, GameEvents } from "../core/event-bus.js";
import { logger } from "../services/logger-service.js";

/**
 * CompleteQuestUseCase
 *
 * Business logic for completing the current quest.
 * Handles quest completion, progress updates, and event emission.
 */
export class CompleteQuestUseCase {
	/**
	 * @param {Object} dependencies
	 * @param {import('../controllers/quest-controller.js').QuestController} dependencies.questController
	 */
	constructor({ questController }) {
		this.questController = questController;
	}

	/**
	 * Execute the use case
	 * @returns {{success: boolean, questId?: string, error?: Error}}
	 */
	execute() {
		try {
			// Get current quest before completing
			const currentQuest = this.questController.currentQuest;

			if (!currentQuest) {
				logger.warn("No active quest to complete");
				return { success: false, error: new Error("No active quest") };
			}

			const questId = currentQuest.id;
			logger.info(`🎉 Completing quest: ${questId}`);

			// Complete the quest via controller
			this.questController.completeQuest();

			// Emit completion event
			eventBus.emit(GameEvents.QUEST_COMPLETE, {
				questId,
				quest: currentQuest,
			});

			return { success: true, questId };
		} catch (error) {
			logger.error("Failed to complete quest:", error);
			eventBus.emit(GameEvents.ERROR, {
				message: "Failed to complete quest",
				error,
			});
			return { success: false, error: /** @type {Error} */ (error) };
		}
	}
}
