import { SignalWatcher } from "@lit-labs/signals";
import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import "@awesome.me/webawesome/dist/components/icon/icon.js";
import { levelDialogStyles } from "../../LevelDialog.styles.js";

/** @typedef {import('../../../../content/quests/quest-types.js').LevelConfig} LevelConfig */

/**
 * @element level-dialog-slide-solution
 */
export class LevelDialogSlideSolution extends SignalWatcher(LitElement) {
	/**
	 * @type {string | import('lit').TemplateResult}
	 * @public
	 */
	@property({ type: Object })
	accessor solutionDesc = "";

	/** @override */
	static styles = levelDialogStyles;

	/**
	 * @param {LevelConfig} config
	 * @returns {string}
	 */
	static getAccessibilityText(config) {
		return (config?.solutionDesc?.toString() || "").replace(/<[^>]*>/g, "");
	}

	/** @override */
	render() {
		return html`
			<div class="slide-content-centered">
				<div class="narrative-text">
					${this.solutionDesc}
				</div>
			</div>
		`;
	}
}
