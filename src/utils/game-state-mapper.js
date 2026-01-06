/**
 * Maps the application state to the view state required by GameView.
 * This decouples the internal application state structure from the view's props.
 */
/**
 * Maps the application state to the view state required by GameView.
 * This decouples the internal application state structure from the view's props.
 */
/**
 * @typedef {Object} UIState
 * @property {boolean} isPaused
 * @property {boolean} showDialog
 * @property {boolean} isQuestCompleted
 * @property {string} lockedMessage
 */

/**
 * @typedef {Object} QuestState
 * @property {import('../content/quests/quest-types.js').QuestData} data
 * @property {number} chapterNumber
 * @property {number} totalChapters
 * @property {boolean} isLastChapter
 * @property {string} levelId
 */

/**
 * @typedef {Object} HeroViewState
 * @property {import('../content/quests/quest-types.js').Vector2} pos
 * @property {boolean} isEvolving
 * @property {import('../services/game-state-service.js').HotSwitchState} hotSwitchState
 */

/**
 * @typedef {Object} LevelViewState
 * @property {boolean} hasCollectedItem
 * @property {boolean} isRewardCollected
 * @property {boolean} isCloseToTarget
 */

/**
 * @typedef {Object} GameState
 * @property {import('../content/quests/quest-types.js').LevelConfig} config
 * @property {UIState} ui
 * @property {QuestState} quest
 * @property {HeroViewState} hero
 * @property {LevelViewState} levelState
 */

/**
 * @typedef {Object} AppSource
 * @property {import('../controllers/interaction-controller.js').InteractionController} [interaction]
 * @property {import('../controllers/quest-controller.js').QuestController} questController
 * @property {import('../services/game-state-service.js').GameStateService} gameState
 * @property {boolean} isPaused
 * @property {boolean} showDialog
 * @property {boolean} showQuestCompleteDialog
 * @property {import('../content/quests/quest-types.js').QuestData} currentQuest
 * @property {string} chapterId
 * @property {import('../content/quests/quest-types.js').Vector2} heroPos
 * @property {boolean} isEvolving
 * @property {import('../services/game-state-service.js').HotSwitchState} hotSwitchState
 * @property {boolean} hasCollectedItem
 * @property {boolean} isRewardCollected
 */

export const GameStateMapper = {
	/**
	 * Maps the current app state to a GameState object.
	 * @param {AppSource} app - The application instance source
	 * @param {import('../content/quests/quest-types.js').LevelConfig} config - The current chapter configuration
	 * @returns {GameState} The mapped game state
	 */
	map(app, config) {
		const isCloseToTarget = app.interaction?.isCloseToNpc() || false;
		const isLastChapter = app.questController?.isLastChapter() || false;

		return {
			config: config,
			ui: {
				isPaused: app.isPaused || false,
				showDialog: app.showDialog,
				isQuestCompleted: app.showQuestCompleteDialog,
				lockedMessage: app.gameState.getState().lockedMessage || "",
			},
			quest: {
				data: app.currentQuest,
				chapterNumber: app.questController?.getCurrentChapterNumber() || 0,
				totalChapters: app.questController?.getTotalChapters() || 0,
				isLastChapter: isLastChapter,
				levelId: app.chapterId,
			},
			hero: {
				pos: app.heroPos || { x: 0, y: 0 },
				isEvolving: app.isEvolving || false,
				hotSwitchState: app.hotSwitchState,
			},
			levelState: {
				hasCollectedItem: app.hasCollectedItem || false,
				isRewardCollected: app.isRewardCollected || false,
				isCloseToTarget: isCloseToTarget,
			},
		};
	},
};
