/**
 * CheckZonesCommand
 *
 * Checks if the hero is in any special game zones (theme changes, context triggers).
 */
export class CheckZonesCommand {
	/**
	 * @param {Object} params
	 * @param {import('../controllers/game-zone-controller.js').GameZoneController} params.gameZoneController
	 * @param {number} params.x - Hero X position
	 * @param {number} params.y - Hero Y position
	 */
	constructor({ gameZoneController, x, y }) {
		this.gameZoneController = gameZoneController;
		this.x = x;
		this.y = y;
		this.name = "CheckZones";
		this.metadata = { x, y };
	}

	/**
	 * Execute the command
	 */
	execute() {
		this.gameZoneController.checkZones(this.x, this.y);
	}
}
