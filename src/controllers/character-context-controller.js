/**
 * CharacterContextController - Manages character appearance contexts
 *
 * Handles:
 * - Suit/Skin images based on level and theme
 * - Gear images based on level
 * - Power images based on level
 *
 * Usage:
 * ```js
 * this.characterContexts = new CharacterContextController(this, {
 *   suitProvider: this.suitProvider,
 *   gearProvider: this.gearProvider,
 *   powerProvider: this.powerProvider,
 *   masteryProvider: this.masteryProvider,
 *   getState: () => ({
 *     level: this.level,
 *     chapterData: this.getChapterData(this.level),
 *     themeMode: this.themeMode,
 *     hotSwitchState: this.hotSwitchState,
 *     hasCollectedItem: this.hasCollectedItem,
 *     userData: this.userData,
 *     activeService: this.getActiveService()
 *   })
 * });
 *
 * // Update contexts when state changes
 * this.characterContexts.update();
 * ```
 */


export class CharacterContextController {
	constructor(host, options = {}) {
		this.host = host;
		this.options = options;

		host.addController(this);
	}

	hostConnected() {
		// No setup needed
	}

	hostDisconnected() {
		// No cleanup needed
	}

	/**
	 * Update all character contexts based on current game state
	 */
	update() {
		const state = this.options.getState();

		// Calculate derived values
		const {
			level,
			chapterData,
			isRewardCollected,
			hasCollectedItem,
			hotSwitchState,
			themeMode,
		} = state;

		const suit = {
			image: chapterData?.hero
				? isRewardCollected
					? chapterData.hero.reward
					: chapterData.hero.image
				: null,
		};

		const gear = {
			image: hasCollectedItem && chapterData?.reward?.image
				? chapterData.reward.image
				: null,
		};

		const power = {
			effect: hotSwitchState === "new" ? "stable" : "glitch",
			intensity: themeMode === "dark" ? "high" : "low",
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
