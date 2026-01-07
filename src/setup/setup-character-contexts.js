import { CharacterContextController } from "../controllers/character-context-controller.js";

/**
 * @typedef {import('../core/game-context.js').IGameContext} IGameContext
 */

/**
 * Setup CharacterContextController
 * @param {import('lit').LitElement} host
 * @param {IGameContext} context
 */
export function setupCharacterContexts(host, context) {
	context.characterContexts = new CharacterContextController(
		/** @type {import('lit').ReactiveControllerHost} */ (host),
		{
			suitProvider: undefined, // Will be set in connectedCallback
			gearProvider: undefined,
			powerProvider: undefined,
			masteryProvider: undefined,
			getState: () => {
				const state = context.gameState.getState();
				const currentChapter = context.questController.currentChapter;
				return {
					level: currentChapter?.id || "",
					chapterData: /** @type {any} */ (currentChapter),
					themeMode: state.themeMode,
					hotSwitchState: /** @type {string|undefined} */ (
						state.hotSwitchState || undefined
					),
					hasCollectedItem: state.hasCollectedItem,
					userData: /** @type {any} */ (context).userData, // Still some loose ends
					activeService: context.serviceController?.getActiveService(),
				};
			},
		},
	);
}
