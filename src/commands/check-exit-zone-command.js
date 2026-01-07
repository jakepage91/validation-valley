/**
 * CheckExitZoneCommand
 *
 * Checks if the hero has reached the exit zone and triggers transition if applicable.
 */
export class CheckExitZoneCommand {
	/**
	 * @param {Object} params
	 * @param {import('../controllers/collision-controller.js').CollisionController} params.collisionController
	 * @param {number} params.x - Hero X
	 * @param {number} params.y - Hero Y
	 * @param {import('../content/quests/quest-types.js').Zone} [params.exitZone] - Current exit zone config
	 * @param {boolean} params.hasCollectedItem - Interaction state
	 */
	constructor({ collisionController, x, y, exitZone, hasCollectedItem }) {
		this.collisionController = collisionController;
		this.x = x;
		this.y = y;
		this.exitZone = exitZone;
		this.hasCollectedItem = hasCollectedItem;
		this.name = "CheckExitZone";
		this.metadata = { x, y, hasCollectedItem };
	}

	/**
	 * Execute the command
	 */
	execute() {
		if (this.exitZone) {
			this.collisionController.checkExitZone(
				this.x,
				this.y,
				this.exitZone,
				this.hasCollectedItem,
			);
		}
	}
}
