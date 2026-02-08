import { SignalWatcher } from "@lit-labs/signals";
import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import "@awesome.me/webawesome/dist/components/icon/icon.js";
import { levelDialogStyles } from "../../LevelDialog.styles.js";

/** @typedef {import('../../../../content/quests/quest-types.js').LevelConfig} LevelConfig */

/**
 * Generic content slide that renders any HTML template
 * @element level-dialog-slide-content
 */
export class LevelDialogSlideContent extends SignalWatcher(LitElement) {
	/**
	 * @type {string | import('lit').TemplateResult}
	 * @public
	 */
	@property({ type: Object })
	accessor content = "";

	/** @override */
	static styles = levelDialogStyles;

	/**
	 * @param {LevelConfig} config
	 * @param {number} index
	 * @returns {string}
	 */
	static getAccessibilityText(config, index) {
		const slide = config?.contentSlides?.[index];
		return (slide?.toString() || "").replace(/<[^>]*>/g, "");
	}

	/** @override */
	render() {
		return html`
			<div class="slide-content-centered">
				<div class="narrative-text">
					${this.content}
				</div>
			</div>
		`;
	}
}
