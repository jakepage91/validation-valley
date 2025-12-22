import { html, LitElement } from "lit";
import { styles } from "./game-hud.css.js";

export class GameHud extends LitElement {
	static properties = {
		currentChapterNumber: { type: Number },
		totalChapters: { type: Number },
		levelTitle: { type: String },
		questTitle: { type: String },
	};

	constructor() {
		super();
		this.currentChapterNumber = 1;
		this.totalChapters = 1;
		this.levelTitle = "";
		this.questTitle = "";
	}

	static styles = styles;

	render() {
		return html`
      <div class="wa-stack">
	  	<h5>${this.levelTitle}</h5>
        <h6>${this.questTitle}</h6>
      </div>

      <h3 class="chapter-counter">
        ${this.currentChapterNumber}<span class="chapter-total">/${this.totalChapters}</span>
      </h3>
    `;
	}
}

customElements.define("game-hud", GameHud);
