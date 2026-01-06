/**
 * MoveHeroCommand
 *
 * Command to move the hero character.
 * Supports undo to restore previous position.
 */
export class MoveHeroCommand {
	/**
	 * @param {Object} params
	 * @param {import('../services/game-state-service.js').GameStateService} params.gameState
	 * @param {number} params.dx - Delta X (change in X position)
	 * @param {number} params.dy - Delta Y (change in Y position)
	 */
	constructor({ gameState, dx, dy }) {
		this.gameState = gameState;
		this.dx = dx;
		this.dy = dy;
		/** @type {{x: number, y: number} | null} */
		this.previousPos = null;
		this.name = "MoveHero";
		this.metadata = { dx, dy };
	}

	/**
	 * Check if command can execute
	 * @returns {boolean}
	 */
	canExecute() {
		const state = this.gameState.getState();
		// Can't move if paused or evolving
		return !state.isPaused && !state.isEvolving;
	}

	/**
	 * Execute the move
	 */
	execute() {
		const current = this.gameState.getState().heroPos;

		// Save previous position for undo
		this.previousPos = { x: current.x, y: current.y };

		// Execute move
		this.gameState.setHeroPosition(current.x + this.dx, current.y + this.dy);
	}

	/**
	 * Undo the move
	 */
	undo() {
		if (this.previousPos) {
			this.gameState.setHeroPosition(this.previousPos.x, this.previousPos.y);
		}
	}
}
