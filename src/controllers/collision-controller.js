/**
 * @typedef {import("lit").ReactiveController} ReactiveController
 * @typedef {import("lit").ReactiveControllerHost} ReactiveControllerHost
 * @typedef {import("../core/game-context.js").IGameContext} IGameContext
 */

/**
 * @typedef {Object} Box
 * @property {number} x - Center X coordinate
 * @property {number} y - Center Y coordinate
 * @property {number} width - Width of the box
 * @property {number} height - Height of the box
 */

/**
 * @typedef {Object} CollisionOptions
 * @property {number} [heroSize=2.5] - Half-size of hero hitbox
 */

/**
 * CollisionController - Handles collision detection and exit zones
 *
 * Checks:
 * - AABB collisions with obstacles (via checkCollision)
 * - Exit zone entry (via checkExitZone)
 *
 * ReactiveController pattern:
 * - Checks exit zone on host update via heroPos signal
 *
 * @implements {ReactiveController}
 */
export class CollisionController {
	/**
	 * @param {ReactiveControllerHost} host
	 * @param {Object} dependencies
	 * @param {import('../game/interfaces.js').IHeroStateService} dependencies.heroState
	 * @param {import('../game/interfaces.js').IQuestStateService} dependencies.questState
	 * @param {import('../controllers/quest-controller.js').QuestController} [dependencies.questController]
	 * @param {{ heroSize?: number }} [config]
	 */
	constructor(host, { heroState, questState, questController }, config = {}) {
		this.host = host;
		this.heroState = heroState;
		this.questState = questState;
		this.questController = questController;
		this.config = {
			heroSize: 2.5,
			...config,
		};
		host.addController(this);
	}

	hostConnected() {}

	hostDisconnected() {}

	hostUpdate() {
		const pos = this.heroState.pos.get();
		const hasCollectedItem = this.questState.hasCollectedItem.get();
		const currentChapter = this.questController?.currentChapter;
		if (currentChapter?.exitZone) {
			this.checkExitZone(
				pos.x,
				pos.y,
				currentChapter.exitZone,
				hasCollectedItem,
			);
		}
	}

	/**
	 * Check if hero collides with exit zone
	 * @param {number} x - Hero X position
	 * @param {number} y - Hero Y position
	 * @param {Box} exitZone - Exit zone definition
	 * @param {boolean} hasCollectedItem - Whether hero has collected the item
	 * @returns {boolean} True if collision occurred
	 */
	checkExitZone(x, y, exitZone, hasCollectedItem) {
		if (!hasCollectedItem || !exitZone) {
			return false;
		}

		const heroHalfSize = this.config.heroSize;

		// Hero bounding box
		const hLeft = x - heroHalfSize;
		const hRight = x + heroHalfSize;
		const hTop = y - heroHalfSize;
		const hBottom = y + heroHalfSize;

		// Exit zone bounding box
		const eLeft = exitZone.x - exitZone.width / 2;
		const eRight = exitZone.x + exitZone.width / 2;
		const eTop = exitZone.y - exitZone.height / 2;
		const eBottom = exitZone.y + exitZone.height / 2;

		// AABB collision detection
		const collided =
			hLeft < eRight && hRight > eLeft && hTop < eBottom && hBottom > eTop;

		if (collided) {
			/** @type {any} */ (this.host).gameController?.handleExitZoneReached();
		}

		return collided;
	}

	/**
	 * Generic AABB collision check
	 * @param {Box} box1
	 * @param {Box} box2
	 * @returns {boolean} True if boxes collide
	 */
	checkAABB(box1, box2) {
		const b1Left = box1.x - box1.width / 2;
		const b1Right = box1.x + box1.width / 2;
		const b1Top = box1.y - box1.height / 2;
		const b1Bottom = box1.y + box1.height / 2;

		const b2Left = box2.x - box2.width / 2;
		const b2Right = box2.x + box2.width / 2;
		const b2Top = box2.y - box2.height / 2;
		const b2Bottom = box2.y + box2.height / 2;

		return (
			b1Left < b2Right &&
			b1Right > b2Left &&
			b1Top < b2Bottom &&
			b1Bottom > b2Top
		);
	}
}
