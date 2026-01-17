import "@awesome.me/webawesome/dist/components/card/card.js";
import "@awesome.me/webawesome/dist/components/details/details.js";
import { consume } from "@lit/context";
import { SignalWatcher } from "@lit-labs/signals";
import { html, LitElement } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { gameConfig } from "../../config/game-configuration.js";
import { aiContext } from "../../contexts/ai-context.js";
import { localizationContext } from "../../contexts/localization-context.js";
import { questControllerContext } from "../../contexts/quest-controller-context.js";
import { questLoaderContext } from "../../contexts/quest-loader-context.js";
import { sessionContext } from "../../contexts/session-context.js";
import { themeContext } from "../../contexts/theme-context.js";
import { voiceContext } from "../../contexts/voice-context.js";
import { KeyboardController } from "../../controllers/keyboard-controller.js";
import { GameEvents } from "../../core/event-bus.js";
import { heroStateContext } from "../../game/contexts/hero-context.js";
import { questStateContext } from "../../game/contexts/quest-context.js";
import { worldStateContext } from "../../game/contexts/world-context.js";
import { setupCharacterContexts } from "../../setup/setup-character-contexts.js";
import { setupCollision } from "../../setup/setup-collision.js";
import {
	setupGameController,
	setupGameService,
} from "../../setup/setup-game.js";
import { setupInteraction } from "../../setup/setup-interaction.js";
import { setupService } from "../../setup/setup-service.js";
import { setupVoice } from "../../setup/setup-voice.js";
import { setupZones } from "../../setup/setup-zones.js";
import {
	extractAssetPath,
	processImagePath,
	processImageSrcset,
} from "../../utils/process-assets.js";
import "../game-hud/game-hud.js";
import "../hero-profile/hero-profile.js";
import "../npc-element/npc-element.js";
import "../reward-element/reward-element.js";
import "../viewport-elements/game-controls/game-controls.js";
import "../viewport-elements/game-exit-zone/game-exit-zone.js";
import "../viewport-elements/game-zone-indicator/game-zone-indicator.js";
import { gameViewportStyles } from "./GameViewport.styles.js";

/**
 * @element game-viewport
 * @property {any} gameState - Configuration derived state
 * @property {import('../legacys-end-app/LegacysEndApp.js').LegacysEndApp} app - Reference to Main App for direct signal access
 */
export class GameViewport extends SignalWatcher(LitElement) {
	@consume({ context: heroStateContext, subscribe: true })
	accessor heroState = /** @type {any} */ (null);

	/** @type {import('../../game/interfaces.js').IQuestStateService} */
	@consume({ context: questStateContext, subscribe: true })
	accessor questState = /** @type {any} */ (null);

	/** @type {import('../../game/interfaces.js').IWorldStateService} */
	@consume({ context: worldStateContext, subscribe: true })
	accessor worldState = /** @type {any} */ (null);

	/** @type {import('../../controllers/quest-controller.js').QuestController} */
	@consume({ context: questControllerContext, subscribe: true })
	accessor questController = /** @type {any} */ (null);

	/** @type {import('../../services/quest-loader-service.js').QuestLoaderService} */
	@consume({ context: questLoaderContext, subscribe: true })
	accessor questLoader = /** @type {any} */ (null);

	/** @type {import('../../services/session-service.js').SessionService} */
	@consume({ context: sessionContext, subscribe: true })
	accessor sessionService = /** @type {any} */ (null);

	/** @type {import('../../services/localization-service.js').LocalizationService} */
	@consume({ context: localizationContext, subscribe: true })
	accessor localizationService = /** @type {any} */ (null);

	/** @type {import('../../services/theme-service.js').ThemeService} */
	@consume({ context: themeContext, subscribe: true })
	accessor themeService = /** @type {any} */ (null);

	/** @type {import('../../services/ai-service.js').AIService} */
	@consume({ context: aiContext, subscribe: true })
	accessor aiService = /** @type {any} */ (null);

	/** @type {import('../../services/voice-synthesis-service.js').VoiceSynthesisService} */
	@consume({ context: voiceContext, subscribe: true })
	accessor voiceSynthesisService = /** @type {any} */ (null);

	static properties = {
		isAnimatingReward: { state: true },
		rewardAnimState: { state: true },
		isRewardCollected: { state: true },
		isVoiceActive: { type: Boolean },
	};

	static styles = gameViewportStyles;

	constructor() {
		super();
		this.isAnimatingReward = false;
		this.rewardAnimState = "";
		this.isRewardCollected = false;
		this.isVoiceActive = false;

		// Controllers
		this._controllersInitialized = false;
		this._eventsSubscribed = false;
		this._autoMoveRequestId = null;

		/** @type {import('../../controllers/collision-controller.js').CollisionController | null} */
		this.collision = null;
		/** @type {import('../../controllers/game-zone-controller.js').GameZoneController | null} */
		this.zones = null;
		/** @type {import('../../controllers/interaction-controller.js').InteractionController | null} */
		this.interaction = null;
		/** @type {import('../../controllers/keyboard-controller.js').KeyboardController | null} */
		this.keyboard = null;
		/** @type {import('../../controllers/voice-controller.js').VoiceController | null} */
		this.voice = null;
		/** @type {import('../../controllers/game-controller.js').GameController | null} */
		this.gameController = null;

		this.#boundHandleMoveInput = this.#handleMoveInput.bind(this);
	}

	/** @type {(data: any) => void} */
	#boundHandleMoveInput;

	/**
	 * @param {import("lit").PropertyValues} changedProperties
	 */
	updated(changedProperties) {
		super.updated(changedProperties);

		// Initialize controllers once services are available via context
		const allServicesReady =
			this.questController &&
			this.heroState &&
			this.questState &&
			this.worldState &&
			this.themeService &&
			this.sessionService;

		if (allServicesReady && !this._controllersInitialized) {
			this.#setupControllers();
			this._controllersInitialized = true;
			this.#subscribeToEvents();
		}

		// Sync Hero Image from current chapter config
		const config = this.questController?.currentChapter;
		if (config && this.questState) {
			const isRewardCollected = this.questState.isRewardCollected.get();
			const heroImage =
				isRewardCollected && config.hero?.reward
					? config.hero.reward
					: config.hero?.image;
			this.heroState.setImageSrc(heroImage || "");
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#unsubscribeFromEvents();
		this.stopAutoMove();
	}

	/**
	 * Subscribe to event bus events
	 */
	#subscribeToEvents() {
		if (this.questController?.options?.eventBus && !this._eventsSubscribed) {
			this.questController.options.eventBus.on(
				GameEvents.HERO_MOVE_INPUT,
				this.#boundHandleMoveInput,
			);
			this._eventsSubscribed = true;
		}
	}

	/**
	 * Unsubscribe from event bus events
	 */
	#unsubscribeFromEvents() {
		if (this.questController?.options?.eventBus && this._eventsSubscribed) {
			this.questController.options.eventBus.off(
				GameEvents.HERO_MOVE_INPUT,
				this.#boundHandleMoveInput,
			);
			this._eventsSubscribed = false;
		}
	}

	/**
	 * Setup game controllers using the application context
	 */
	#setupControllers() {
		const context = this.#getGameContext();

		this.#setupGameMechanics(context);
		// Update context with newly created controllers
		context.interaction = this.interaction || undefined;
		/** @type {any} */ (context).collision = this.collision;
		/** @type {any} */ (context).zones = this.zones;

		this.#setupInputHandlers(context);
		this.#setupGameFlow(context);
		this.requestUpdate();
	}

	/**
	 * Setup fundamental game mechanics controllers
	 * @param {import('../../core/game-context.js').IGameContext} context
	 */
	#setupGameMechanics(context) {
		setupZones(/** @type {any} */ (this), /** @type {any} */ (context));
		setupCollision(/** @type {any} */ (this), /** @type {any} */ (context));
		setupService(/** @type {any} */ (this), /** @type {any} */ (context));
		setupCharacterContexts(
			/** @type {any} */ (this),
			/** @type {any} */ (context),
		);
		setupInteraction(/** @type {any} */ (this), /** @type {any} */ (context));
	}

	/**
	 * Setup input handling controllers
	 * @param {import('../../core/game-context.js').IGameContext} context
	 */
	#setupInputHandlers(context) {
		this.#setupKeyboard(context);
		setupVoice(/** @type {any} */ (this), /** @type {any} */ (context));
	}

	/**
	 * Setup high-level game flow controllers
	 * @param {import('../../core/game-context.js').IGameContext} context
	 */
	#setupGameFlow(context) {
		setupGameService(/** @type {any} */ (context));
		setupGameController(
			/** @type {any} */ (this),
			/** @type {any} */ (context),
		);
	}

	/**
	 * @returns {import('../../core/game-context.js').IGameContext}
	 */
	#getGameContext() {
		const context = {
			eventBus: this.questController?.options?.eventBus,
			logger: this.questController?.options?.logger,
			gameState: /** @type {any} */ (null), // This will be populated by setupGameService
			questController: this.questController,
			progressService: this.questController?.progressService,
			router: undefined, // Not directly available here, but part of IGameContext
			sessionService: this.sessionService,
			questLoader: this.questLoader,
			heroState: this.heroState,
			questState: this.questState,
			worldState: this.worldState,
			themeService: this.themeService,
			localizationService: this.localizationService,
			gameService: this,
			services: {
				questLoader: this.questLoader,
				sessionService: this.sessionService,
				questState: this.questState,
				heroState: this.heroState,
				questController: this.questController,
				themeService: this.themeService,
				localizationService: this.localizationService,
				aiService: this.aiService,
				voiceSynthesisService: this.voiceSynthesisService,
			},
			aiService: this.aiService,
			voiceSynthesisService: this.voiceSynthesisService,
		};
		return /** @type {import('../../core/game-context.js').IGameContext} */ (
			/** @type {any} */ (context)
		);
	}

	/**
	 * Setup keyboard controller
	 * @param {import('../../core/game-context.js').IGameContext} context
	 */
	#setupKeyboard(context) {
		this.keyboard = new KeyboardController(this, {
			...context,
			speed: 2.5,
		});
	}

	/**
	 * Handles hero movement
	 * @param {number} dx - Delta X movement
	 * @param {number} dy - Delta Y movement
	 * @param {boolean} [isAuto] - Whether this is auto-movement
	 */
	handleMove(dx, dy, isAuto = false) {
		if (!isAuto) {
			this.stopAutoMove();
		}

		// Direct state update (bypass CommandBus)
		const current = this.heroState.pos.get();
		const nextX = Math.max(0, Math.min(100, current.x + dx));
		const nextY = Math.max(0, Math.min(100, current.y + dy));

		this.heroState.setPos(nextX, nextY);
	}

	/**
	 * Handles interaction with game objects
	 */
	handleInteract() {
		const showDialog = this.worldState?.showDialog?.get();
		if (showDialog) return;

		if (this.interaction) {
			this.interaction.handleInteract();
		}
	}

	/**
	 * Moves hero to target position with smooth animation
	 * @param {number} targetX - Target X position
	 * @param {number} targetY - Target Y position
	 * @param {number} [step] - Movement step size
	 */
	moveTo(targetX, targetY, step = 0.4) {
		this.stopAutoMove();

		const move = () => {
			const heroPos = this.heroState.pos.get();
			const { x, y } = heroPos;

			const dx = targetX - x;
			const dy = targetY - y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < step) {
				this.heroState.setPos(targetX, targetY);
				this.stopAutoMove();
				return;
			}

			const moveX = (dx / distance) * step;
			const moveY = (dy / distance) * step;

			this.handleMove(moveX, moveY, true);
			this._autoMoveRequestId = requestAnimationFrame(move);
		};

		this._autoMoveRequestId = requestAnimationFrame(move);
	}

	/**
	 * Stops auto-movement animation
	 */
	stopAutoMove() {
		if (this._autoMoveRequestId) {
			cancelAnimationFrame(this._autoMoveRequestId);
			this._autoMoveRequestId = null;
		}
	}

	/**
	 * Triggers level transition to next chapter
	 */
	triggerLevelTransition() {
		this.stopAutoMove();
		this.questLoader?.advanceChapter();
	}

	/**
	 * Handles level completion
	 */
	handleLevelComplete() {
		if (this.gameController) {
			this.gameController.handleLevelCompleted();
		}
	}

	/**
	 * Toggles game pause state
	 */
	togglePause() {
		if (this.worldState) {
			this.worldState.setPaused(!this.worldState.isPaused.get());
		}
	}

	/**
	 * Advances to the next dialog slide
	 */
	nextDialogSlide() {
		// Dialog is not in GameViewport yet, need to manage this or event
		this.dispatchEvent(new CustomEvent("next-slide"));
	}

	/**
	 * Returns to the previous dialog slide
	 */
	prevDialogSlide() {
		this.dispatchEvent(new CustomEvent("prev-slide"));
	}

	/**
	 * Handles move input events
	 * @param {{dx: number, dy: number}} data - Movement delta
	 */
	#handleMoveInput(data) {
		const { dx, dy } = data;
		this.handleMove(dx, dy);
	}

	/**
	 * @param {import("lit").PropertyValues} changedProperties
	 */
	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);

		// Handle reward collection animation trigger via signal observation
		if (this.questState) {
			const hasCollectedItem = this.questState.hasCollectedItem.get();
			const prevHasCollectedItem = changedProperties.has("app")
				? false
				: this._lastHasCollectedItem;

			if (!prevHasCollectedItem && hasCollectedItem) {
				this.startRewardAnimation();
			} else if (!hasCollectedItem) {
				this.isRewardCollected = false;
			}
			this._lastHasCollectedItem = hasCollectedItem;
		}
	}

	startRewardAnimation() {
		this.isAnimatingReward = true;
		this.rewardAnimState = "start";

		// Step 1: Grow to center
		setTimeout(() => {
			this.rewardAnimState = "growing";
			this.requestUpdate();
		}, 50);

		// Step 2: Move to hero
		setTimeout(() => {
			this.rewardAnimState = "moving";
			this.requestUpdate();
		}, gameConfig.animation.rewardDuration / 2);

		// Step 3: End
		setTimeout(() => {
			this.isAnimatingReward = false;
			this.rewardAnimState = "";
			this.isRewardCollected = true;
			this.dispatchEvent(
				new CustomEvent("reward-collected", {
					bubbles: true,
					composed: true,
				}),
			);
			this.requestUpdate();
		}, gameConfig.animation.rewardDuration);
	}

	render() {
		if (!this.questState || !this.questController) return html``;

		/** @type {any} */
		const config = this.questController.currentChapter || {};
		let backgroundStyle = config.backgroundStyle || "";

		if (
			this.questState.isRewardCollected.get() &&
			config.backgroundStyleReward
		) {
			backgroundStyle = config.backgroundStyleReward;
		}

		const backgroundPath = extractAssetPath(backgroundStyle);

		return html`
			<game-hud></game-hud>

			<div class="game-area">
				${
					backgroundPath
						? html`
					<img 
						src="${ifDefined(processImagePath(backgroundPath))}"
						srcset="${ifDefined(processImageSrcset(backgroundPath))}"
						sizes="min(100vw, calc(100vh - 96px))"
						class="game-area-bg"
						alt="Background"
					/>
				`
						: ""
				}
				<game-controls 
					.isVoiceActive="${this.voice?.enabled || false}"
					@toggle-voice="${this.#handleToggleVoice}"
				></game-controls>
				
				<game-zone-indicator 
					.type="${"THEME_CHANGE"}"
					.zones="${config.zones || []}"
				></game-zone-indicator>

				<game-zone-indicator 
					.type="${"CONTEXT_CHANGE"}"
					.zones="${config.zones || []}"
				></game-zone-indicator>

				<game-exit-zone></game-exit-zone>

				${
					this.questState.lockedMessage.get()
						? html`<div class="locked-message">${this.questState.lockedMessage.get()}</div>`
						: ""
				}



				${this._renderNPC()}
				${this._renderReward()}
				${this._renderHero()}
			</div>
		`;
	}

	_renderNPC() {
		const config = this.questController.currentChapter;
		if (!config?.npc) return "";

		const isCloseToTarget = this.interaction?.isCloseToNpc() || false;

		return html`
			<npc-element
				.name="${config.npc.name}"
				.image="${config.npc.image}"
				.icon="${config.npc.icon || "user"}"
				.x="${config.npc.position.x}"
				.y="${config.npc.position.y}"
				.isClose="${isCloseToTarget}"
			></npc-element>
		`;
	}

	_renderReward() {
		const config = this.questController.currentChapter;
		if (!config?.reward) return "";

		const hasCollectedItem = this.questState.hasCollectedItem.get();

		if (!this.isAnimatingReward && hasCollectedItem) {
			return "";
		}

		// Calculations for animation or static position
		let x = config.reward.position.x;
		let y = config.reward.position.y;

		if (this.isAnimatingReward) {
			if (this.rewardAnimState === "growing") {
				x = 50;
				y = 50;
			} else if (this.rewardAnimState === "moving") {
				const heroPos = this.heroState.pos.get();
				x = heroPos.x;
				y = heroPos.y;
			}
		}

		return html`
			<reward-element
				.image="${config.reward.image || ""}"
				.x="${x}"
				.y="${y}"
				class=${classMap({ [this.rewardAnimState]: this.isAnimatingReward })}
			></reward-element>
		`;
	}

	#handleToggleVoice() {
		if (this.voice) {
			this.voice.toggle();
		} else {
			console.warn("Voice controller not initialized");
		}
	}

	_renderHero() {
		return html`
			<hero-profile></hero-profile>
		`;
	}
}
