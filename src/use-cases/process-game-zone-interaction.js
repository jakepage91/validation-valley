/**
 * ProcessGameZoneInteractionUseCase
 *
 * Checks if the hero is in specific zones and returns triggers.
 */
export class ProcessGameZoneInteractionUseCase {
	/**
	 * @typedef {Object} ZoneInteractionResult
	 * @property {'THEME_CHANGE' | 'CONTEXT_CHANGE' | 'NONE'} type
	 * @property {any} payload
	 */

	/**
	 * Execute the zone check
	 * @param {Object} params
	 * @param {number} params.x
	 * @param {number} params.y
	 * @param {import('../content/quests/quest-types.js').LevelConfig} [params.chapter]
	 * @param {boolean} params.hasCollectedItem
	 * @returns {ZoneInteractionResult[]}
	 */
	execute({ x, y, chapter, hasCollectedItem }) {
		if (!chapter || !chapter.zones) return [];

		/** @type {ZoneInteractionResult[]} */
		const results = [];

		chapter.zones.forEach((zone) => {
			// Skip if item required but not collected
			if (zone.requiresItem && !hasCollectedItem) return;

			if (
				x >= zone.x &&
				x <= zone.x + zone.width &&
				y >= zone.y &&
				y <= zone.y + zone.height
			) {
				results.push({
					type: /** @type {any} */ (zone.type),
					payload: zone.payload,
				});
			}
		});

		return results;
	}
}
