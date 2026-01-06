import { GameZoneController } from "../controllers/game-zone-controller.js";

/**
 * @typedef {Object} ZonesAppHost
 * @property {string} chapterId
 * @property {boolean} hasCollectedItem
 * @property {string} hotSwitchState
 * @property {import('../services/game-state-service.js').GameStateService} gameState
 * @property {(id: string) => any} getChapterData
 * @property {() => void} applyTheme
 * @typedef {import('lit').LitElement & ZonesAppHost} ZonesApp
 */

/**
 * Setup GameZoneController
 * @param {import('lit').LitElement} host
 * @param {ZonesApp} app
 */
export function setupZones(host, app) {
	/** @type {import('lit').LitElement & { zones: GameZoneController }} */ (
		host
	).zones = new GameZoneController(host, {
		getChapterData: () => app.getChapterData(app.chapterId),
		hasCollectedItem: () => app.hasCollectedItem,
		onThemeChange: (theme) => {
			app.gameState.setThemeMode(theme);
			app.applyTheme();
		},
		onContextChange: (context) => {
			// Only update if changed to avoid loop/thrashing (though setState usually handles check)
			if (app.hotSwitchState !== context) {
				app.gameState.setHotSwitchState(context);
			}
		},
	});
}
