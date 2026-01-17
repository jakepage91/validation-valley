import { GameZoneController } from "../controllers/game-zone-controller.js";
import { ProcessGameZoneInteractionUseCase } from "../use-cases/process-game-zone-interaction.js";

/**
 * @typedef {import('lit').LitElement} ZoneHost
 * @typedef {import('../core/game-context.js').IGameContext} IGameContext
 */

/**
 * Setup GameZoneController
 * @param {ZoneHost} host
 * @param {Object} dependencies
 * @param {import('../game/interfaces.js').IHeroStateService} dependencies.heroState
 * @param {import('../game/interfaces.js').IQuestStateService} dependencies.questState
 * @param {import('../controllers/quest-controller.js').QuestController} dependencies.questController
 * @param {import('../services/theme-service.js').ThemeService} dependencies.themeService
 */
export function setupZones(
	host,
	{ heroState, questState, questController, themeService },
) {
	/** @type {ZoneHost & { zones: GameZoneController }} */ (host).zones =
		new GameZoneController(
			host,
			{ heroState, questState, questController, themeService },
			{
				processGameZoneInteraction: new ProcessGameZoneInteractionUseCase(),
			},
		);
}
