import { InteractionController } from "../controllers/interaction-controller.js";
import { InteractWithNpcUseCase } from "../use-cases/interact-with-npc.js";

/**
 * @typedef {import('lit').LitElement} InteractionHost
 * @typedef {import('../core/game-context.js').IGameContext} IGameContext
 */

/**
 * Setup InteractionController
 * @param {InteractionHost} host
 * @param {IGameContext} context
 */
export function setupInteraction(host, context) {
	/** @type {InteractionHost & { interaction: InteractionController }} */ (
		host
	).interaction = new InteractionController(host, {
		eventBus: context.eventBus,
		worldState:
			/** @type {import('../game/services/world-state-service.js').WorldStateService} */ (
				context.worldState
			),
		questState:
			/** @type {import('../game/services/quest-state-service.js').QuestStateService} */ (
				context.questState
			),
		getState: () => {
			const currentChapter = context.questController.currentChapter;
			return {
				level: currentChapter?.id || "",
				chapterData: /** @type {any} */ (currentChapter),
				heroPos: context.heroState.pos.get(),
				hotSwitchState: context.heroState.hotSwitchState.get(),
				hasCollectedItem: context.questState.hasCollectedItem.get(),
			};
		},
		getNpcPosition: () => context.questController.currentChapter?.npc?.position,
		interactWithNpcUseCase:
			context.questLoader?._interactWithNpcUseCase ||
			new InteractWithNpcUseCase(),
	});
}
