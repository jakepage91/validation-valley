import { ContextConsumer } from "@lit/context";
import { questControllerContext } from "../contexts/quest-controller-context.js";
import { themeContext } from "../contexts/theme-context.js";
import { HotSwitchStates, ThemeModes } from "../core/constants.js";
import { heroStateContext } from "../game/contexts/hero-context.js";
import { questStateContext } from "../game/contexts/quest-context.js";

/**
 * @typedef {import("lit").ReactiveController} ReactiveController
 * @typedef {import("lit").ReactiveControllerHost} ReactiveControllerHost
 * @typedef {import("lit").ReactiveElement} ReactiveElement
 */

/**
 * @typedef {import('../game/interfaces.js').IHeroStateService} IHeroStateService
 * @typedef {import('../game/interfaces.js').IQuestStateService} IQuestStateService
 * @typedef {import('../services/interfaces.js').IQuestController} IQuestController
 * @typedef {import('../services/interfaces.js').IThemeService} IThemeService
 */

/**
 * @typedef {Object} CharacterContextOptions
 * @property {import('@lit/context').ContextProvider<any, any> | null} [characterProvider] - Combined provider if used
 */

/**
 * CharacterContextController - Manages character appearance contexts
 *
 * Handles:
 * - Suit/Skin images based on level and theme
 * - Gear images based on level
 * - Power images based on level
 *
 * @implements {ReactiveController}
 */
export class CharacterContextController {
	/** @type {IHeroStateService | null} */
	#heroState = null;
	/** @type {IQuestStateService | null} */
	#questState = null;
	/** @type {IQuestController | null} */
	#questController = null;
	/** @type {IThemeService | null} */
	#themeService = null;

	/**
	 * @param {ReactiveControllerHost} host
	 * @param {CharacterContextOptions} [options]
	 */
	constructor(host, options = {}) {
		/** @type {ReactiveControllerHost} */
		this.host = host;
		this.options = {
			characterProvider: null,
			...options,
		};

		const hostElement = /** @type {ReactiveElement} */ (
			/** @type {unknown} */ (this.host)
		);

		// Initialize Context Consumers
		new ContextConsumer(hostElement, {
			context: heroStateContext,
			subscribe: true,
			callback: (service) => {
				this.#heroState = /** @type {IHeroStateService} */ (service);
			},
		});

		new ContextConsumer(hostElement, {
			context: questStateContext,
			subscribe: true,
			callback: (service) => {
				this.#questState = /** @type {IQuestStateService} */ (service);
			},
		});

		new ContextConsumer(hostElement, {
			context: questControllerContext,
			subscribe: true,
			callback: (service) => {
				this.#questController = /** @type {IQuestController} */ (service);
			},
		});

		new ContextConsumer(hostElement, {
			context: themeContext,
			subscribe: true,
			callback: (service) => {
				this.#themeService = /** @type {IThemeService} */ (service);
			},
		});

		host.addController(this);
	}

	hostConnected() {}

	hostDisconnected() {}

	/**
	 * Called before the host updates
	 * Update all character contexts based on current game state
	 */
	hostUpdate() {
		if (!this.#heroState || !this.#questState || !this.#questController) return;

		const currentChapter = this.#questController.currentChapter;

		// Calculate derived values
		const level = currentChapter?.id ?? "";
		const chapterData = currentChapter;

		const isRewardCollected =
			this.#questState.isRewardCollected?.get() ?? false;
		const hasCollectedItem = this.#questState.hasCollectedItem?.get() ?? false;
		const hotSwitchState =
			this.#heroState.hotSwitchState?.get() ?? HotSwitchStates.LEGACY;

		const themeMode = this.#themeService?.themeMode?.get() ?? ThemeModes.LIGHT;

		const suit = {
			image: chapterData?.hero
				? isRewardCollected
					? chapterData.hero.reward
					: chapterData.hero.image
				: null,
		};

		const gear = {
			image:
				hasCollectedItem && chapterData?.reward?.image
					? chapterData.reward.image
					: null,
		};

		const power = {
			effect: hotSwitchState === HotSwitchStates.NEW ? "stable" : "glitch",
			intensity: themeMode === ThemeModes.DARK ? "high" : "low",
		};

		const mastery = {
			level: level,
		};

		// Update the single character provider
		if (this.options.characterProvider) {
			this.options.characterProvider.setValue({
				suit,
				gear,
				power,
				mastery,
			});
		}
	}
}
