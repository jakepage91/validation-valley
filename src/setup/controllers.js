import { setupCharacterContexts } from "./setup-character-contexts.js";
import { setupCollision } from "./setup-collision.js";
import { setupGame } from "./setup-game.js";
import { setupInteraction } from "./setup-interaction.js";
import { setupKeyboard } from "./setup-keyboard.js";
import { setupQuest } from "./setup-quest.js";
import { setupService } from "./setup-service.js";
import { setupSessionManager } from "./setup-session-manager.js";
import { setupVoice } from "./setup-voice.js";
import { setupZones } from "./setup-zones.js";

/** @typedef {import('../legacys-end-app.js').LegacysEndApp} LegacysEndApp */

/**
 * Setup all application controllers
 *
 * Controllers are initialized in dependency order:
 * 1. Basic input controllers (keyboard, debug, voice)
 * 2. Game mechanics controllers (zones, collision, service)
 * 3. Context and interaction controllers
 * 4. Quest controller
 * 5. Session manager integration
 *
 * @param {LegacysEndApp} app
 */
export function setupControllers(app) {
	// Initialize basic input controllers
	setupKeyboard(app);
	setupGame(app);
	setupVoice(app);

	// Initialize game mechanics controllers
	setupZones(app);
	setupCollision(app);
	setupService(app);

	// Initialize context and interaction
	setupCharacterContexts(app);
	setupInteraction(app);

	// Initialize quest controller
	setupQuest(app);

	// Integrate with session manager
	setupSessionManager(app);
}
