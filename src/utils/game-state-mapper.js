/**
 * Maps the application state to the view state required by GameView.
 * This decouples the internal application state structure from the view's props.
 */
/**
 * Maps the application state to the view state required by GameView.
 * This decouples the internal application state structure from the view's props.
 */
export const GameStateMapper = {
	/**
	 * Maps the current app state to a GameState object.
	 * @param {Object} app - The application instance (LegacysEndApp)
	 * @param {Object} config - The current chapter configuration
	 * @returns {Object} The mapped game state
	 */
	map(app, config) {
		const isCloseToTarget = app.interaction?.isCloseToNpc() || false;
		const isLastChapter = app.questController?.isLastChapter() || false;

		return {
			config: config,
			ui: {
				isPaused: app.isPaused || false,
				showDialog: app.showDialog,
				lockedMessage: app.interaction?.lockedMessage,
			},
			quest: {
				title: app.currentQuest?.name,
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
