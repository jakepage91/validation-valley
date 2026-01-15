/**
 * Command to go to the previous slide in the level dialog.
 */
export class PrevDialogSlideCommand {
	/**
	 * @param {import('../components/quest-view/QuestView.js').QuestView} gameView
	 */
	constructor(gameView) {
		this.gameView = gameView;
		this.name = "PrevDialogSlideCommand";
	}

	execute() {
		if (this.gameView) {
			this.gameView.prevDialogSlide();
		}
	}
}
