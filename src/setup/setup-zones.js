import { GameZoneController } from "../controllers/game-zone-controller.js";

/**
 * @typedef {import('lit').LitElement} ZoneHost
 * @typedef {import('../core/game-context.js').IGameContext} IGameContext
 */

/**
 * Setup GameZoneController
 * @param {ZoneHost} host
 * @param {IGameContext} context
 */
export function setupZones(host, context) {
	/** @type {ZoneHost & { zones: GameZoneController }} */ (host).zones =
		new GameZoneController(host, {
			getChapterData: () => context.questController.currentChapter,
			hasCollectedItem: () => context.gameState.getState().hasCollectedItem,
			onThemeChange: (theme) => {
				context.gameState.setThemeMode(theme);
				context.eventBus.emit("theme-changed", { theme });
			},
			onContextChange: (newHotSwitchState) => {
				if (context.gameState.getState().hotSwitchState !== newHotSwitchState) {
					context.gameState.setHotSwitchState(newHotSwitchState);
				}
			},
		});
}
