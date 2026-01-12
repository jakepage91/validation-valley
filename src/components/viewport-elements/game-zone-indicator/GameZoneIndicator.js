import { html, LitElement } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { gameZoneIndicatorStyles } from "./GameZoneIndicator.styles.js";

/**
 * @typedef {import("../../../content/quests/quest-types.js").Zone} Zone
 */

/**
 * @element game-zone-indicator
 * @summary Displays generic zones (Theme, Context) based on configuration.
 * @property {Zone[]} zones - The list of zones to render.
 * @property {String} type - The type of zones to filter and render (e.g. 'THEME_CHANGE', 'CONTEXT_CHANGE').
 */
export class GameZoneIndicator extends LitElement {
	static styles = gameZoneIndicatorStyles;

	static properties = {
		zones: { type: Array },
		type: { type: String },
		currentState: { type: String },
	};

	constructor() {
		super();
		/** @type {Zone[]} */
		this.zones = [];
		this.type = "";
		this.currentState = "";
	}

	/**
	 * @param {Zone} zone
	 */
	getStyle(zone) {
		return {
			left: `${zone.x}%`,
			top: `${zone.y}%`,
			width: `${zone.width}%`,
			height: `${zone.height}%`,
		};
	}

	/**
	 * @param {Zone} zone
	 */
	renderThemeZone(zone) {
		const isDark = zone.payload === "dark";
		const label = isDark ? "Dark Theme" : "Light Theme";
		const className = isDark ? "zone-theme-dark" : "zone-theme-light";
		// Original Theme Zones were static opacity 0.1
		// But in new generic system, we highlight the ACTIVE one?
		// "The styles are not like they were before" implies we should match old behavior.
		// Old behavior: Simply show two zones, left (light) and right (dark).
		// Opacity was constant 0.1.
		// So I will remove dynamic opacity for Theme Zones to match original.
		// EXCEPT: original used `left: 0` and `right: 0` + `width: 50%`.
		// Generic system uses `x, y, width, height`.
		// If I use generic rect, it works.
		// Opacity: I will set inline `opacity: 0.1` on the container, OR rely on CSS .zone opacity?
		// CSS .zone has transition. Original .zone had `opacity: 0.1`.
		// But wait, if .zone has opacity 0.1, the label is hard to read?
		// Original likely had readable text?
		// "font-family: 'Press Start 2P'".
		// I'll stick to CSS definition.

		return html`
			<div class="zone ${className}" style="${styleMap(this.getStyle(zone))}">
				<small class="zone-theme-label">${label}</small>
			</div>
		`;
	}

	/**
	 * @param {Zone} zone
	 */
	renderContextZone(zone) {
		if (zone.payload === null) return "";

		const isLegacy = zone.payload === "legacy";
		const baseClass = isLegacy ? "zone-context-legacy" : "zone-context-new";
		const title = isLegacy ? "Legacy" : "New API V2";
		const sub = isLegacy ? "LegacyUserService" : "NewUserService";

		// Match original colors
		const legacyColorInactive = "#991b1b"; // Red 800
		const legacyTitleInactive = "#7f1d1d"; // Red 900
		const newColorInactive = "#1e40af"; // Blue 800
		const newTitleInactive = "#1e3a8a"; // Blue 900

		// Check active state
		const isActive = this.currentState
			? this.currentState === zone.payload
			: false;
		const stateClass = isActive ? "active" : "inactive";

		// Dynamic text colors
		const titleColor = isActive
			? "white"
			: isLegacy
				? legacyTitleInactive
				: newTitleInactive;
		// Note: Subtitle color was generic "#991b1b" or "#1e40af" hardcoded in original
		// Original: style="color: #991b1b" (Legacy), style="color: #1e40af" (New)
		// It did NOT change to white?
		// Checking Step 5468:
		// <small class="ctx-sub" style="color: #991b1b">LegacyUserService</small>
		// <small class="ctx-sub" style="color: #1e40af">NewUserService</small>
		// Yes, subtitle color was static. Only Title changed.
		const subColor = isLegacy ? legacyColorInactive : newColorInactive;

		return html`
			<div class="zone zone-context ${baseClass} ${stateClass}" style="${styleMap(this.getStyle(zone))}">
				<h6 class="ctx-title" style="color: ${titleColor}">${title}</h6>
				<small class="ctx-sub" style="color: ${subColor}">${sub}</small>
			</div>
		`;
	}

	render() {
		if (!this.zones || this.zones.length === 0) return "";

		const relevantZones = this.zones.filter((z) => z.type === this.type);

		return html`
			${relevantZones.map((zone) => {
				if (this.type === "THEME_CHANGE") return this.renderThemeZone(zone);
				if (this.type === "CONTEXT_CHANGE") return this.renderContextZone(zone);
				return "";
			})}
		`;
	}
}
