import { GameZoneController } from "../controllers/game-zone-controller.js";

/**
 * Setup GameZoneController
 * @param {any} host
 * @param {import('../legacys-end-app.js').LegacysEndApp} app
 */
export function setupZones(host, app) {
	host.zones = new GameZoneController(host, {
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
