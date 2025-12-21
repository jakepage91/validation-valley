/**
 * Setup SessionManager integration with controllers
 * @param {import('../legacys-end-app.js').LegacysEndApp} app
 */
export function setupSessionManager(app) {
	// Initialize GameSessionManager with real values
	app.sessionManager.options.questController = app.questController;
	app.sessionManager.options.router = app.router;
	app.sessionManager.options.controllers = {
		keyboard: app.keyboard,
		interaction: app.interaction,
		collision: app.collision,
		zones: app.zones,
		voice: app.voice,
	};

	// Update internal references
	app.sessionManager.questController = app.questController;
	app.sessionManager.router = app.router;
	app.sessionManager.keyboard = app.keyboard;
	app.sessionManager.interaction = app.interaction;
	app.sessionManager.collision = app.collision;
	app.sessionManager.zones = app.zones;
}
