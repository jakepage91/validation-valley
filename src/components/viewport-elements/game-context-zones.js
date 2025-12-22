import { html, LitElement } from "lit";
import { styles } from "./game-context-zones.css.js";

/**
 * @element game-context-zones
 * @summary Displays legacy and new context zones.
 * @property {Boolean} active - Whether context zones are active for this chapter.
 * @attribute active
 * @property {String} state - Current hot switch state ('legacy' | 'new').
 */
export class GameContextZones extends LitElement {
	static properties = {
		active: { type: Boolean },
		state: { type: String },
	};

	constructor() {
		super();
		this.active = false;
		this.state = "legacy";
	}

	render() {
		if (!this.active) return "";

		const isLegacyActive = this.state === "legacy";
		const isNewActive = this.state === "new";

		return html`
			<div class="ctx-zone ctx-legacy ${isLegacyActive ? "active" : "inactive"}">
				<h6 class="ctx-title" style="color: ${isLegacyActive ? "white" : "#991b1b"}">Legacy</h6>
				<small class="ctx-sub" style="color: #fca5a5">LegacyUserService</small>
			</div>
			<div class="ctx-zone ctx-new ${isNewActive ? "active" : "inactive"}">
				<h6 class="ctx-title" style="color: ${isNewActive ? "white" : "#1e40af"}">New API V2</h6>
				<small class="ctx-sub" style="color: #93c5fd">NewUserService</small>
			</div>
		`;
	}

	static styles = styles;
}

customElements.define("game-context-zones", GameContextZones);
