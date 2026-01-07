/**
 * AdvanceChapterCommand
 *
 * Handles the transition to the next chapter.
 * Includes animation state management and quest completion logic.
 */
export class AdvanceChapterCommand {
	/**
	 * @param {Object} params
	 * @param {import('../services/game-state-service.js').GameStateService} params.gameState
	 * @param {import('../controllers/quest-controller.js').QuestController} params.questController
	 */
	constructor({ gameState, questController }) {
		this.gameState = gameState;
		this.questController = questController;
		this.name = "AdvanceChapter";
		this.metadata = {};
	}

	/**
	 * Execute the command
	 */
	async execute() {
		if (this.questController.isInQuest()) {
			this.gameState.setEvolving(true);

			// Simulate evolution animation duration
			await new Promise((resolve) => setTimeout(resolve, 500));

			this.questController.completeChapter();
			this.gameState.setEvolving(false);
		}
	}
}
