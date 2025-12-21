import { KeyboardController } from "../controllers/keyboard-controller.js";

/**
 * Setup KeyboardController
 * @param {import('../legacys-end-app.js').LegacysEndApp} app
 */
export function setupKeyboard(app) {
	app.keyboard = new KeyboardController(app, {
		speed: 2.5,
		onMove: (dx, dy) => app.handleMove(dx, dy),
		onInteract: () => app.handleInteract(),
		onPause: () => app.togglePause(),
		isEnabled: () =>
			!app.isEvolving && !app.showDialog && !app.isPaused && !app.isInHub,
	});
}
