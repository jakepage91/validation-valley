import { html, LitElement } from "lit";
import "@awesome.me/webawesome/dist/components/tag/tag.js";
import { GAME_CONFIG } from "../../constants/game-config.js";
import { sharedStyles } from "../../styles/shared.js";

/**
 * @element game-exit-zone
 * @summary Displays the exit zone when available.
 * @property {Object} zoneConfig - The config object for the exit zone {x, y, width, height, label}.
 * @property {Boolean} active - Whether the exit zone is active (e.g. item collected).
 */
export class GameExitZone extends LitElement {
	static properties = {
		zoneConfig: { type: Object },
		active: { type: Boolean },
	};

	render() {
		if (!this.active || !this.zoneConfig) return "";

		const { x, y, width, height, label } = this.zoneConfig;
		// Determine layout based on position relative to legacy/new zones
		const isRight = x > GAME_CONFIG.VIEWPORT.ZONES.LEGACY.minX;
		const isLeft = x < GAME_CONFIG.VIEWPORT.ZONES.NEW.maxX;

		const justifyContent = isRight ? "flex-end" : isLeft ? "flex-start" : "center";
		const paddingRight = isRight ? "1rem" : "0";
		const paddingLeft = isLeft ? "1rem" : "0";

		return html`
			<div class="exit-zone" style="
				left: ${x}%; 
				top: ${y}%; 
				width: ${width}%; 
				height: ${height}%;
				justify-content: ${justifyContent};
				padding-right: ${paddingRight};
				padding-left: ${paddingLeft};
			">
				<wa-tag variant="neutral" class="exit-text">${label || "EXIT"}</wa-tag>
			</div>
		`;
	}

	static styles = [sharedStyles];
}

customElements.define("game-exit-zone", GameExitZone);
