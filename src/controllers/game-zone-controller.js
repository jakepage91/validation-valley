/**
 * @typedef {import("lit").ReactiveControllerHost} ReactiveControllerHost
 * @typedef {import("lit").ReactiveController} ReactiveController
 * @typedef {import("../core/game-context.js").IGameContext} IGameContext
 */

/**
 * GameZoneController - Handles theme and context zone changes
 *
 * Logic:
 * - Defines zones (start, middle, end) based on Chapter ID
 * - Updates theme mode based on hero position
 * - Updates character context (hot switch) based on zones
 *
 * ReactiveController pattern:
 * - Checks zones on host update via heroPos signal
 *
 * @implements {ReactiveController}
 */
export class GameZoneController {
	/**
	 * @param {ReactiveControllerHost} host
	 * @param {Object} dependencies
	 * @param {import('../game/interfaces.js').IHeroStateService} dependencies.heroState
	 * @param {import('../game/interfaces.js').IQuestStateService} dependencies.questState
	 * @param {import('../services/interfaces.js').IQuestController} dependencies.questController
	 * @param {import('../services/interfaces.js').IThemeService} dependencies.themeService
	 * @param {{ processGameZoneInteraction: any }} useCases
	 */
	constructor(
		host,
		{ heroState, questState, questController, themeService },
		useCases,
	) {
		this.host = host;
		this.heroState = heroState;
		this.questState = questState;
		this.questController = questController;
		this.themeService = themeService;
		this.useCases = useCases;
		/** @type {{x: number, y: number, hasCollectedItem: boolean} | null} */
		this.lastPos = null;
		host.addController(this);
	}

	hostConnected() {}

	hostDisconnected() {}

	hostUpdate() {
		const pos = this.heroState.pos.get();
		const hasCollectedItem = this.questState.hasCollectedItem.get();

		// Prevent redundant checks if position hasn't changed
		if (
			this.lastPos &&
			this.lastPos.x === pos.x &&
			this.lastPos.y === pos.y &&
			this.lastPos.hasCollectedItem === hasCollectedItem
		) {
			return;
		}

		this.lastPos = { x: pos.x, y: pos.y, hasCollectedItem };
		this.checkZones(pos.x, pos.y, hasCollectedItem);
	}

	/**
	 * @param {{x: number, y: number, hasCollectedItem: boolean}} _data
	 */
	handleHeroMoved = (_data) => {
		this.hostUpdate();
	};

	/**
	 * Check if character is in a specific zone and trigger callbacks
	 * @param {number} x - Character X position (0-100)
	 * @param {number} y - Character Y position (0-100)
	 * @param {boolean} [hasCollectedItem]
	 */
	checkZones(x, y, hasCollectedItem = false) {
		const chapter = this.questController?.currentChapter;
		if (!chapter) return;

		const results = this.useCases.processGameZoneInteraction.execute({
			x,
			y,
			chapter,
			hasCollectedItem,
		});

		// Handle THEME_CHANGE (Last one wins if multiple)
		const themeChange = results.findLast(
			(/** @type {any} */ r) => r.type === "THEME_CHANGE",
		);
		if (themeChange && this.themeService) {
			this.themeService.setTheme(themeChange.payload);
		}

		// Handle CONTEXT_CHANGE (Last one wins if multiple)
		const contextChange = results.findLast(
			(/** @type {any} */ r) => r.type === "CONTEXT_CHANGE",
		);
		if (contextChange) {
			const currentContext = this.heroState.hotSwitchState.get();
			if (currentContext !== contextChange.payload) {
				this.heroState.setHotSwitchState(contextChange.payload);
			}
		}
	}
}
