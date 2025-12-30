import { html, LitElement } from "lit";
import { styles } from "./game-view.css.js";
import "./victory-screen.js";
import "../hero-profile.js";
import "../npc-element.js";
import "../reward-element.js";
import "../game-viewport.js";
import "../level-dialog.js";
import "../pause-menu.js";
import "@awesome.me/webawesome/dist/components/card/card.js";
import "@awesome.me/webawesome/dist/components/button/button.js";
import { KeyboardController } from "../../controllers/keyboard-controller.js";
import { setupCharacterContexts } from "../../setup/setup-character-contexts.js";
import { setupCollision } from "../../setup/setup-collision.js";
import { setupGame } from "../../setup/setup-game.js";
import { setupInteraction } from "../../setup/setup-interaction.js";
import { setupService } from "../../setup/setup-service.js";
import { setupVoice } from "../../setup/setup-voice.js";
import { setupZones } from "../../setup/setup-zones.js";

/**
 * @element game-view
 * @property {Object} gameState
 * @property {import('../../legacys-end-app.js').LegacysEndApp} app - Reference to main app for controller setup (temporary, will be removed)
 */
export class GameView extends LitElement {
	static properties = {
		gameState: { type: Object },
		app: { type: Object },
	};

	constructor() {
		super();
		this.gameState = {};
		this.app = null;
		this._controllersInitialized = false;
	}

	connectedCallback() {
		super.connectedCallback();
		// Initialize controllers when component is connected and app is available
		if (this.app && !this._controllersInitialized) {
			this.#setupControllers();
			this._controllersInitialized = true;
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		// Initialize controllers if app becomes available after initial render
		if (
			changedProperties.has("app") &&
			this.app &&
			!this._controllersInitialized
		) {
			this.#setupControllers();
			this._controllersInitialized = true;
		}
	}

	/**
	 * Setup game controllers
	 */
	#setupControllers() {
		// Initialize keyboard controller (now internal to GameView)
		this.#setupKeyboard();

		// Initialize remaining controllers (still using app)
		setupGame(this.app);
		setupVoice(this.app);

		// Initialize game mechanics controllers
		setupZones(this.app);
		setupCollision(this.app);
		setupService(this.app);

		// Initialize context and interaction
		setupCharacterContexts(this.app);
		setupInteraction(this.app);

		// After controllers are initialized, assign providers and load data
		if (this.app.serviceController) {
			this.app.serviceController.options.profileProvider =
				this.app.profileProvider;
			this.app.serviceController.loadUserData();
		}
		if (this.app.characterContexts) {
			this.app.characterContexts.options.suitProvider = this.app.suitProvider;
			this.app.characterContexts.options.gearProvider = this.app.gearProvider;
			this.app.characterContexts.options.powerProvider = this.app.powerProvider;
			this.app.characterContexts.options.masteryProvider =
				this.app.masteryProvider;
		}
	}

	/**
	 * Setup keyboard controller (internal to GameView)
	 */
	#setupKeyboard() {
		this.keyboard = new KeyboardController(this, {
			speed: 2.5,
			onMove: (dx, dy) => this.handleMove(dx, dy),
			onInteract: () => this.handleInteract(),
			onPause: () => this.togglePause(),
		});
	}

	/**
	 * Handle keyboard/voice movement input
	 */
	handleMove(dx, dy) {
		this.app.handleMove(dx, dy);
	}

	/**
	 * Handle interaction (talk to NPC, etc.)
	 */
	handleInteract() {
		this.app.handleInteract();
	}

	/**
	 * Toggle pause state
	 */
	togglePause() {
		// Toggle pause state directly in gameState
		const currentState = this.gameState?.ui?.isPaused ?? false;
		if (this.app?.gameState) {
			this.app.gameState.setPaused(!currentState);
		}
	}

	render() {
		const { config, ui, quest, hero } = this.gameState || {};

		if (!config) {
			return html`<div>Loading level data...</div>`;
		}

		// Replaced hardcoded levels with flags
		const _canToggleTheme = config.canToggleTheme;
		const _hasHotSwitch = config.hasHotSwitch;
		const _isFinalBoss = config.isFinalBoss;

		// Dialog Config Logic
		const dialogConfig = config;

		return html`

			<pause-menu
				.open="${ui?.isPaused}"
				@resume="${() => {
					this.app.gameState.setPaused(false);
					this.dispatchEvent(new CustomEvent("resume"));
				}}"
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
				ui?.isQuestCompleted
					? html`
					<victory-screen
						.quest="${quest?.data /* Need to ensure quest data is available */}" 
						.onReturn="${() => this.dispatchEvent(new CustomEvent("return-to-hub"))}"
					></victory-screen>
				`
					: html`
				<main>
					<game-viewport
						.gameState="${this.gameState}"
					></game-viewport>
				</main>
				`
			}

			${
				ui?.showDialog && !ui?.isQuestCompleted
					? html`
				<level-dialog
					.config="${dialogConfig}"
					.level="${quest?.levelId}"
					.hotSwitchState="${hero?.hotSwitchState}"
					@complete="${() => this.dispatchEvent(new CustomEvent("complete"))}"
					@close="${() => this.dispatchEvent(new CustomEvent("close-dialog"))}"
				></level-dialog>
			`
					: ""
			}
		`;
	}

	static styles = styles;
}

customElements.define("game-view", GameView);
