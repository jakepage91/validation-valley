import { CharacterContextController } from "../controllers/character-context-controller.js";

/**
 * Setup CharacterContextController
 * @param {import('../legacys-end-app.js').LegacysEndApp} app
 */
export function setupCharacterContexts(app) {
	app.characterContexts = new CharacterContextController(app, {
		suitProvider: undefined, // Will be set in connectedCallback
		gearProvider: undefined,
		powerProvider: undefined,
		masteryProvider: undefined,
		getState: () => ({
			level: app.chapterId || "", // Ensure string
			chapterData: app.getChapterData(app.chapterId || ""),
			themeMode: app.themeMode,
			hotSwitchState: /** @type {string|undefined} */ (
				app.hotSwitchState || undefined
			),
			hasCollectedItem: app.hasCollectedItem,
			userData: /** @type {import("../services/user-services.js").UserData} */ (
				app.userData
			),
			activeService: app.getActiveService(),
		}),
	});
}
