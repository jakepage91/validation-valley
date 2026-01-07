import { Observable } from "../utils/observable.js";
import {
	HotSwitchStateValidator,
	PositionValidator,
	ThemeModeValidator,
} from "../utils/validators.js";

/** @typedef {import('./interfaces.js').IGameStateService} IGameStateService */

/**
 * @typedef {Object} HeroPosition
 * @property {number} x - X coordinate percentage (0-100)
 * @property {number} y - Y coordinate percentage (0-100)
 */

/**
 * @typedef {'light' | 'dark'} ThemeMode
 */

/**
 * @typedef {'legacy' | 'new' | 'mock' | null} HotSwitchState
 */

/**
 * @typedef {Object} GameState
 * @property {HeroPosition} heroPos - The x, y coordinates of the hero (0-100%)
 * @property {boolean} hasCollectedItem - Whether the chapter's objective item has been collected
 * @property {boolean} isRewardCollected - Whether the reward animation sequence has completed
 * @property {HotSwitchState} hotSwitchState - The active API context
 * @property {boolean} isPaused - Global pause state of the game
 * @property {boolean} isEvolving - Whether the level transition animation is playing
 * @property {boolean} showDialog - Whether the level dialog is open
 * @property {boolean} isQuestCompleted - Whether the quest completion dialog is shown
 * @property {string|null} lockedMessage - Message to display when trying to perform a locked action
 * @property {ThemeMode} themeMode - Current visual theme
 * @property {string} currentDialogText - The text of the currently active dialog slide
 */

/**
 * GameStateService - Manages ephemeral game state
 *
 * Tracks:
 * - Hero position
 * - Collected items (per session/chapter)
 * - Active context (hot switch state)
 * - UI state (paused, evolving, locked messages)
 * - Theme mode
 *
 * Implements IGameStateService interface (see interfaces.js)
 * @implements {IGameStateService}
 * @extends {Observable<GameState>}
 */
export class GameStateService extends Observable {
	constructor() {
		super();
		/**
		 * @type {GameState}
		 */
		this.state = {
			heroPos: { x: 50, y: 15 },
			hasCollectedItem: false,
			isRewardCollected: false,
			hotSwitchState: null,
			isPaused: false,
			isEvolving: false,
			showDialog: false,
			isQuestCompleted: false,
			lockedMessage: null,
			themeMode: "light",
			currentDialogText: "",
		};
	}

	/**
	 * Get a snapshot of the current state.
	 * Returns a shallow copy to prevent direct mutation.
	 * @returns {GameState} The current state object
	 */
	getState() {
		return { ...this.state };
	}

	/**
	 * Update the state and notify all subscribers.
	 * Performs a shallow merge of partialState into the current state.
	 * @param {Partial<GameState>} partialState - The subset of state properties to update
	 */
	setState(partialState) {
		const oldState = { ...this.state };
		this.state = { ...this.state, ...partialState };
		this.notify(this.state, oldState);
	}

	// --- Convenience Methods ---

	/**
	 * Update the hero's position on the game board.
	 * @param {number} x - X coordinate percentage (0-100)
	 * @param {number} y - Y coordinate percentage (0-100)
	 * @throws {Error} If position is invalid
	 */
	setHeroPosition(x, y) {
		const validation = PositionValidator.validate(x, y);
		if (!validation.isValid) {
			const errors = validation.errors.map((e) => e.message).join(", ");
			throw new Error(`Invalid hero position: ${errors}`);
		}
		this.setState({ heroPos: { x, y } });
	}

	/**
	 * Set whether the objective item for the current chapter has been collected.
	 * @param {boolean} collected - True if collected
	 */
	setCollectedItem(collected) {
		this.setState({ hasCollectedItem: collected });
	}

	/**
	 * Set the status of the reward collection animation sequence.
	 * @param {boolean} collected - True if the reward animation is finished
	 */
	setRewardCollected(collected) {
		this.setState({ isRewardCollected: collected });
	}

	/**
	 * Change the active Service Context (Demonstrated in Level 6).
	 * This simulates switching between different backend API implementations.
	 * @param {HotSwitchState} state - The context identifier
	 * @throws {Error} If state is invalid
	 */
	setHotSwitchState(state) {
		const validation = HotSwitchStateValidator.validate(state);
		if (!validation.isValid) {
			const errors = validation.errors.map((e) => e.message).join(", ");
			throw new Error(`Invalid hot switch state: ${errors}`);
		}
		this.setState({ hotSwitchState: state });
	}

	/**
	 * Pause or resume the game.
	 * @param {boolean} paused - True to pause
	 */
	setPaused(paused) {
		this.setState({ isPaused: paused });
	}

	/**
	 * Set the evolve state.
	 * @param {boolean} evolving
	 */
	setEvolving(evolving) {
		this.setState({ isEvolving: evolving });
	}

	/**
	 * Set show dialog state.
	 * @param {boolean} show
	 */
	setShowDialog(show) {
		this.setState({ showDialog: show });
	}

	/**
	 * Set quest completed state.
	 * @param {boolean} completed
	 */
	setQuestCompleted(completed) {
		this.setState({ isQuestCompleted: completed });
	}

	/**
	 * Set a feedback message to display when a user action is blocked.
	 * @param {string|null} message - The message to display, or null to clear
	 */
	setLockedMessage(message) {
		this.setState({ lockedMessage: message });
	}

	/**
	 * Set the visual theme mode.
	 * @param {ThemeMode} mode - Theme mode ('light' or 'dark')
	 * @throws {Error} If mode is invalid
	 */
	setThemeMode(mode) {
		const validation = ThemeModeValidator.validate(mode);
		if (!validation.isValid) {
			const errors = validation.errors.map((e) => e.message).join(", ");
			throw new Error(`Invalid theme mode: ${errors}`);
		}
		this.setState({ themeMode: mode });
	}

	/**
	 * Reset the ephemeral state for a new chapter.
	 * Clears collected items, messages, and evolution flags.
	 * Does NOT reset hero position or persistent progress.
	 */
	resetChapterState() {
		this.setState({
			hasCollectedItem: false,
			isRewardCollected: false,
			lockedMessage: null,
			isEvolving: false,
			currentDialogText: "",
		});
	}

	/**
	 * Set the text of the currently active dialog slide.
	 * @param {string} text - The dialog text
	 */
	setCurrentDialogText(text) {
		this.setState({ currentDialogText: text || "" });
	}
}
