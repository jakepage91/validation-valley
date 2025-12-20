/**
 * @typedef {import("lit").ReactiveController} ReactiveController
 * @typedef {import("lit").ReactiveControllerHost} ReactiveControllerHost
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
 * @property {function(): void} [onExitCollision] - Callback when hitting exit zone
 */

/**
 * CollisionController - Handles collision detection
 *
 * Handles:
 * - AABB (Axis-Aligned Bounding Box) collision detection
 * - Exit zone collision for level transitions
 *
 * @implements {ReactiveController}
 */
export class CollisionController {
	/**
	 * @param {ReactiveControllerHost} host
	 * @param {CollisionOptions} [options]
	 */
	constructor(host, options = {}) {
		this.host = host;
		/** @type {Required<CollisionOptions>} */
		this.options = {
			heroSize: 2.5, // Half-size of hero hitbox
			onExitCollision: () => { },
			...options,
		};

		host.addController(this);
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

		const heroHalfSize = this.options.heroSize;

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
			this.options.onExitCollision();
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
