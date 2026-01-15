import { ContextConsumer } from "@lit/context";
import { SignalWatcher } from "@lit-labs/signals";
import { html, LitElement } from "lit";
import { questStateContext } from "../../game/contexts/quest-context.js";
import { gameHudStyles } from "./GameHud.styles.js";

/**
 * GameHud Component
 * Displays current level info and progress.
 *
 * @element game-hud
 * @property {number} currentChapterNumber - Current chapter number (1-index based)
 * @property {number} totalChapters - Total number of chapters
 * @property {string} levelTitle - Title of the level/chapter
 * @property {string} questTitle - Title of the quest
 * @attribute currentChapterNumber
 * @attribute totalChapters
 * @attribute levelTitle
 * @attribute questTitle
 */
export class GameHud extends SignalWatcher(LitElement) {
	/** @type {ContextConsumer<import('../../game/contexts/quest-context.js').questStateContext, GameHud>} */
	questStateConsumer = new ContextConsumer(this, {
		context: questStateContext,
		subscribe: true,
	});

	static properties = {
		/** @type {import('lit').PropertyDeclaration} */
		currentChapterNumber: { type: Number },
		/** @type {import('lit').PropertyDeclaration} */
		totalChapters: { type: Number },
		/** @type {import('lit').PropertyDeclaration} */
		levelTitle: { type: String },
		/** @type {import('lit').PropertyDeclaration} */
		questTitle: { type: String },
	};

	constructor() {
		super();
		/** @type {number|undefined} */
		this.currentChapterNumber = undefined;
		/** @type {number|undefined} */
		this.totalChapters = undefined;
		/** @type {string|undefined} */
		this.levelTitle = undefined;
		/** @type {string|undefined} */
		this.questTitle = undefined;
	}

	static styles = gameHudStyles;

	render() {
		const questState = this.questStateConsumer.value;

		const currentChapterNumber =
			this.currentChapterNumber ?? questState?.currentChapterNumber.get() ?? 1;
		const totalChapters =
			this.totalChapters ?? questState?.totalChapters.get() ?? 1;
		const levelTitle = this.levelTitle ?? questState?.levelTitle.get() ?? "";
		const questTitle = this.questTitle ?? questState?.questTitle.get() ?? "";

		return html`
      <div class="wa-stack">
	  	<h5>${levelTitle}</h5>
        <h6>${questTitle}</h6>
      </div>

      <h3 class="chapter-counter">
        ${currentChapterNumber}<span class="chapter-total">/${totalChapters}</span>
      </h3>
    `;
	}
}
