import "@awesome.me/webawesome/dist/components/button/button.js";
import "@awesome.me/webawesome/dist/components/card/card.js";
import { SignalWatcher } from "@lit-labs/signals";
import { html, LitElement } from "lit";
import { PauseGameCommand } from "../../commands/pause-game-command.js";
import "../game-viewport/game-viewport.js";
import "../level-dialog/level-dialog.js";
import "../pause-menu/pause-menu.js";
import "../victory-screen/victory-screen.js";
import { questViewStyles } from "./quest-view.css.js";

/**
 * @typedef {Object} GameState
 * @property {import('../../config/game-configuration.js').GameplayConfig} config
 * @property {Object} ui
 * @property {boolean} ui.isPaused
 * @property {boolean} ui.showDialog
 * @property {boolean} ui.isQuestCompleted
 * @property {string} ui.lockedMessage
 * @property {Object} quest
 * @property {import('../../services/quest-registry-service.js').Quest|null} quest.data
 * @property {number} quest.chapterNumber
 * @property {number} quest.totalChapters
 * @property {boolean} quest.isLastChapter
 * @property {string} [quest.levelId]
 * @property {Object} hero
 * @property {import('../../services/game-state-service.js').HeroPosition} hero.pos
 * @property {boolean} hero.isEvolving
 * @property {import('../../services/game-state-service.js').HotSwitchState} hero.hotSwitchState
 * @property {Object} levelState
 * @property {boolean} levelState.hasCollectedItem
 * @property {boolean} levelState.isRewardCollected
 * @property {boolean} levelState.isCloseToTarget
 */

/**
 * QuestView - Page wrapper for the game
 *
 * Responsible for:
 * - Orchestrating the high-level game page UI (Pause menu, Victory screen, Dialogs)
 * - Providing a boundary for the GameViewport (Engine)
 * - Managing page-level state transitions (Hub <-> Game)
 *
 * @element quest-view
 * @property {GameState} gameState - Current game state
 * @property {import('../legacys-end-app/LegacysEndApp.js').LegacysEndApp} app - Reference to Main App
 */
export class QuestView extends SignalWatcher(LitElement) {
	static properties = {
		gameState: { type: Object },
		app: { type: Object },
	};

	static styles = questViewStyles;

	constructor() {
		super();
		/** @type {GameState} */
		this.gameState = /** @type {GameState} */ ({});
		/** @type {any} */
		this.app = null;
	}

	/**
	 * Handles slide change events from level dialog
	 * @param {CustomEvent} e - Slide changed event
	 */
	#handleSlideChanged(e) {
		if (this.app?.gameState) {
			this.app.gameState.setCurrentDialogText(e.detail.text);
		}
	}

	/**
	 * Toggles game pause state
	 */
	togglePause() {
		if (this.app?.commandBus) {
			this.app.commandBus.execute(
				new PauseGameCommand({
					gameState: this.app.gameState,
				}),
			);
		}
	}

	render() {
		const { config, quest } = this.gameState || {};
		const stateService = this.app?.gameState;

		if (!config || !stateService || !stateService.isPaused) {
			return html`<div>Loading level data...</div>`;
		}

		// Pull current state from signals for rendering
		const isPaused = stateService.isPaused.get();
		const isQuestCompleted = stateService.isQuestCompleted.get();
		const showDialog = stateService.showDialog.get();

		return html`
			<pause-menu
				.open="${isPaused}"
				@resume="${() => this.app.gameState.setPaused(false)}"
				@restart="${() => {
					this.app.gameState.setPaused(false);
					this.dispatchEvent(new CustomEvent("restart"));
				}}"
				@quit="${() => {
					this.app.gameState.setPaused(false);
					this.dispatchEvent(new CustomEvent("quit"));
				}}"
			></pause-menu>

			${
				isQuestCompleted
					? html`
					<victory-screen
						.quest="${quest?.data}" 
						.onReturn="${() => this.dispatchEvent(new CustomEvent("return-to-hub"))}"
					></victory-screen>
				`
					: html`
				<main>
					<game-viewport
						.gameState="${this.gameState}"
						.app="${this.app}"
						@next-slide="${() => this.nextDialogSlide()}"
						@prev-slide="${() => this.prevDialogSlide()}"
					></game-viewport>
				</main>
			`
			}

			${
				showDialog && !isQuestCompleted
					? html`
				<level-dialog
					.config="${config}"
					.level="${quest?.levelId || ""}"
					@complete="${() => this.#handleLevelComplete()}"
					@close="${() => this.dispatchEvent(new CustomEvent("close-dialog"))}"
					@slide-changed="${(/** @type {any} */ e) => this.#handleSlideChanged(e)}"
				></level-dialog>
			`
					: ""
			}
		`;
	}

	nextDialogSlide() {
		const dialog =
			/** @type {import('../level-dialog/level-dialog.js').LevelDialog} */ (
				this.shadowRoot?.querySelector("level-dialog")
			);
		if (dialog) dialog.nextSlide();
	}

	prevDialogSlide() {
		const dialog =
			/** @type {import('../level-dialog/level-dialog.js').LevelDialog} */ (
				this.shadowRoot?.querySelector("level-dialog")
			);
		if (dialog) dialog.prevSlide();
	}

	#handleLevelComplete() {
		const viewport =
			/** @type {import('../game-viewport/GameViewport.js').GameViewport} */ (
				this.shadowRoot?.querySelector("game-viewport")
			);
		if (viewport) {
			viewport.handleLevelComplete();
		}
	}
}
