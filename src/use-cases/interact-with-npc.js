/**
 * InteractWithNpcUseCase
 *
 * Encapsulates the business rules for interacting with NPCs.
 * Handles victory condition checks and interaction availability.
 */
export class InteractWithNpcUseCase {
	/**
	 * @typedef {Object} InteractParams
	 * @property {boolean} isClose - Whether the hero is close to the NPC
	 * @property {import('../content/quests/quest-types.js').LevelConfig} [chapterData] - Current chapter configuration
	 * @property {Record<string, any>} gameState - Full game state for requirement checking
	 * @property {boolean} hasCollectedItem - Whether the item/reward has already been collected
	 */

	/**
	 * Execute the interaction logic
	 * @param {InteractParams} params
	 * @returns {{success: boolean, action: 'showDialog' | 'showLocked' | 'none', message?: string}}
	 */
	execute({ isClose, chapterData, gameState, hasCollectedItem }) {
		if (!isClose) {
			return { success: false, action: "none" };
		}

		// Check NPC specific requirements
		if (chapterData?.npc?.requirements) {
			for (const [key, requirement] of Object.entries(
				chapterData.npc.requirements,
			)) {
				const currentValue = gameState[key];
				const { value, message } = requirement;

				if (currentValue !== value) {
					return {
						success: false,
						action: "showLocked",
						message: message || `REQ: ${key} ${value}`,
					};
				}
			}
			return { success: true, action: "showDialog" };
		}

		// Regular interaction
		if (!hasCollectedItem) {
			return { success: true, action: "showDialog" };
		}

		return { success: false, action: "none" };
	}
}
