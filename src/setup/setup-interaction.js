import { InteractionController } from "../controllers/interaction-controller.js";
import { InteractWithNpcUseCase } from "../use-cases/interact-with-npc.js";

/**
 * @typedef {import('lit').LitElement} InteractionHost
 * @typedef {import('../core/game-context.js').IGameContext} IGameContext
 */

/**
 * Setup InteractionController
 * @param {InteractionHost} host
 * @param {Object} dependencies
 * @param {import('../core/event-bus.js').EventBus} dependencies.eventBus
 * @param {import('../game/services/world-state-service.js').WorldStateService} dependencies.worldState
 * @param {import('../game/services/quest-state-service.js').QuestStateService} dependencies.questState
 * @param {import('../game/services/hero-state-service.js').HeroStateService} dependencies.heroState
 * @param {import('../controllers/quest-controller.js').QuestController} dependencies.questController
 * @param {import('../services/quest-loader-service.js').QuestLoaderService} [dependencies.questLoader]
 */
export function setupInteraction(
	host,
	{ eventBus, worldState, questState, heroState, questController, questLoader },
) {
	/** @type {InteractionHost & { interaction: InteractionController }} */ (
		host
	).interaction = new InteractionController(host, {
		eventBus,
		worldState,
		questState,
		getState: () => {
			const currentChapter = questController.currentChapter;
			return {
				level: currentChapter?.id || "",
				chapterData: /** @type {any} */ (currentChapter),
				heroPos: heroState.pos.get(),
				hotSwitchState: heroState.hotSwitchState.get(),
				hasCollectedItem: questState.hasCollectedItem.get(),
			};
		},
		getNpcPosition: () => questController.currentChapter?.npc?.position,
		interactWithNpcUseCase:
			questLoader?._interactWithNpcUseCase || new InteractWithNpcUseCase(),
	});
}
