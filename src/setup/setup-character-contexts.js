import { CharacterContextController } from "../controllers/character-context-controller.js";

/**
 * @typedef {import('../core/game-context.js').IGameContext} IGameContext
 */

/**
 * Setup CharacterContextController
 * @param {import('lit').LitElement} host
 * @param {Object} dependencies
 * @param {import('../game/interfaces.js').IHeroStateService} dependencies.heroState
 * @param {import('../game/interfaces.js').IQuestStateService} dependencies.questState
 * @param {import('../services/interfaces.js').IQuestController} dependencies.questController
 * @param {import('../services/interfaces.js').IThemeService} dependencies.themeService
 * @returns {CharacterContextController}
 */
export function setupCharacterContexts(
	host,
	{ heroState, questState, questController, themeService },
) {
	return new CharacterContextController(
		/** @type {import('lit').ReactiveControllerHost} */ (host),
		{
			heroState,
			questState,
			questController,
			themeService,
		},
	);
}
