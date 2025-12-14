import { css, html, LitElement } from "lit";
import { classMap } from "lit/directives/class-map.js";
import "./hero-profile.js";
import "./npc-element.js";
import "./reward-element.js";
import "./game-hud.js";
import "@awesome.me/webawesome/dist/components/card/card.js";
import "@awesome.me/webawesome/dist/components/details/details.js";
import { GAME_CONFIG } from "../constants/game-config.js";
import { sharedStyles } from "../styles/shared.js";

/**
 * @element game-viewport
 * @property {Object} gameState
 */
export class GameViewport extends LitElement {
	static properties = {
		gameState: { type: Object },
		isAnimatingReward: { state: true },
		rewardAnimState: { state: true },
		isRewardCollected: { type: Boolean },
	};

	willUpdate(changedProperties) {
		if (changedProperties.has("gameState")) {
			// Check if hasCollectedItem changed from false to true
			const oldState = changedProperties.get("gameState");
			const wasCollected = oldState?.levelState?.hasCollectedItem;
			const isCollected = this.gameState?.levelState?.hasCollectedItem;

			if (!wasCollected && isCollected) {
				this.isAnimatingReward = true;
				this.rewardAnimState = "start";
				// ... animation logic ...
			} else if (!isCollected) {
				this.isRewardCollected = false;
			}
		}

		if (this.isAnimatingReward && this.rewardAnimState === "start") {
			// Step 1: Grow to center
			setTimeout(() => {
				this.rewardAnimState = "growing";
				this.requestUpdate();
			}, 50);

			// Step 2: Move to hero
			setTimeout(() => {
				this.rewardAnimState = "moving";
				this.requestUpdate();
			}, GAME_CONFIG.ANIMATION.REWARD_DELAY);

			// Step 3: End
			setTimeout(() => {
				this.isAnimatingReward = false;
				this.rewardAnimState = "";
				this.isRewardCollected = true; // New state to trigger visual changes
				console.log("✨ GameViewport dispatching reward-collected");
				this.dispatchEvent(
					new CustomEvent("reward-collected", {
						bubbles: true,
						composed: true,
					}),
				);
				this.requestUpdate();
			}, GAME_CONFIG.ANIMATION.REWARD_DURATION);
		}
	}

	render() {
		if (!this.gameState || !this.gameState.config) return html``;

		const { config, quest } = this.gameState;
		const backgroundStyle = config.backgroundStyle || "#374151";

		return html`
			<game-hud 
				.currentChapterNumber="${quest?.chapterNumber}" 
				.totalChapters="${quest?.totalChapters}"
				.levelTitle="${config.title}"
				.questTitle="${quest?.title}"
			></game-hud>

			<div class="game-area" style="background: ${backgroundStyle}">
				${this._renderControls()}
				${this._renderThemeZones()}
				${this._renderExitZone()}
				${this._renderContextZones()}
				${this._renderNPC()}
				${this._renderReward()}
				${this._renderHero()}
			</div>
		`;
	}

	_renderControls() {
		return html`
			<wa-details class="controls-details">
				<div slot="summary">CONTROLS</div>
				<p>ARROWS TO MOVE</p>
				<p>SPACE TO INTERACT</p>
				<p>ESC TO MENU</p>
			</wa-details>
		`;
	}

	_renderThemeZones() {
		const { config } = this.gameState;
		if (!config.hasThemeZones) return "";
		return html`
			<div class="zone zone-light">
				<small class="zone-label">Light Theme</small>
			</div>
			<div class="zone zone-dark">
				<small class="zone-label">Dark Theme</small>
			</div>
		`;
	}

	_renderExitZone() {
		const { config, levelState } = this.gameState;
		if (!levelState?.hasCollectedItem || !config.exitZone) return "";

		const { x, y, width, height, label } = config.exitZone;
		// Determine layout based on position relative to legacy/new zones
		const isRight = x > GAME_CONFIG.VIEWPORT.ZONES.LEGACY.minX; // Previously 80
		const isLeft = x < GAME_CONFIG.VIEWPORT.ZONES.NEW.maxX; // Using NEW.maxX as a left boundary threshold

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

	_renderContextZones() {
		const { config, hero } = this.gameState;
		if (!config?.hasHotSwitch) return "";

		const isLegacyActive = hero?.hotSwitchState === "legacy";
		const isNewActive = hero?.hotSwitchState === "new";

		// Use constants implies defining the zones here using them? 
		// The CSS defines the positions: .ctx-legacy { left: 50% }.
		// We should probably inject these styles dynamically if we want them configurable, 
		// OR just acknowledge they are in CSS and the controller uses the logic.
		// The controller (GameZoneController) logic matches these visual zones.
		// Here it's just rendering the DOM elements.
		// The Implementation Plan said: "Extract layout values (50, 40, etc.)"
		// The rendered DOM helpers don't hardcode them except in styles?
		// Ah, the CSS block at the bottom has them.

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

	_renderNPC() {
		const { config, levelState } = this.gameState;
		if (!config.npc) return "";

		return html`
			<npc-element
				.name="${config.npc.name}"
				.image="${config.npc.image}"
				.icon="${config.npc.icon}"
				.x="${config.npc.position.x}"
				.y="${config.npc.position.y}"
				.isClose="${levelState?.isCloseToTarget}"
				.action="${this.gameState.ui?.lockedMessage}"
				.hasCollectedItem="${levelState?.hasCollectedItem}"
			></npc-element>
		`;
	}

	_renderReward() {
		const { config, levelState, hero } = this.gameState;
		if (
			!this.isAnimatingReward &&
			(levelState?.hasCollectedItem || !config.reward)
		) {
			return "";
		}

		// Calculations for animation or static position
		let x = config.reward.position.x;
		let y = config.reward.position.y;

		if (this.isAnimatingReward) {
			if (this.rewardAnimState === "growing") {
				x = 50;
				y = 50;
			} else if (this.rewardAnimState === "moving") {
				x = hero?.pos?.x;
				y = hero?.pos?.y;
			}
		}

		return html`
			<reward-element
				.image="${config.reward.image}"
				.icon="${config.reward.icon}"
				.x="${x}"
				.y="${y}"
				class=${classMap({ [this.rewardAnimState]: this.isAnimatingReward })}
			></reward-element>
		`;
	}

	_renderHero() {
		const { config, hero } = this.gameState;
		const transition = hero?.isEvolving
			? "opacity 0.5s ease-out"
			: "left 0.075s linear, top 0.075s linear";

		// Use reward image if collected, otherwise normal hero image
		const imageSrc =
			this.isRewardCollected && config.hero?.reward
				? config.hero.reward
				: config.hero?.image;

		return html`
			<hero-profile 
				style="
					left: ${hero.pos.x}%; 
					top: ${hero.pos.y}%;
					opacity: ${hero.isEvolving ? 0 : 1};
					transition: ${transition};
				"
				.imageSrc="${imageSrc}"
				.hotSwitchState="${hero.hotSwitchState}"
			></hero-profile>
		`;
	}

	static styles = [
		...sharedStyles,
		css`
		.controls-details {
			position: absolute;
			bottom: var(--wa-space-m);
			right: var(--wa-space-m);
			z-index: 10;
			background-color: var(--wa-color-surface-default);
			border-radius: var(--wa-border-radius-m);
			box-shadow: var(--wa-shadow-medium);
			max-width: 200px;
		}

		.controls-details::part(content) {
			padding: var(--wa-space-s) var(--wa-space-m);
		}

		.controls-details::part(summary) {
			font-weight: bold;
			font-size: var(--wa-font-size-xs);
			padding: var(--wa-space-s) var(--wa-space-m);
			text-transform: uppercase;
		}

		/* Force content to expand upwards */
		.controls-details[open] {
			display: flex;
			flex-direction: column-reverse;
		}

		.game-area {
			position: relative;
			/* Force square by using the smaller dimension */
			width: min(100%, calc(100vh - 96px)); /* 96px approximate HUD height */
			height: min(100%, calc(100vh - 96px));
			aspect-ratio: 1/1;
			/* Center the square */
			margin: 0 auto;
			transition: background 1s ease-in-out;
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
		}

		/* Zone Overlays */
		.zone {
			position: absolute;
			top: 0; bottom: 0;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;
			padding-bottom: 1rem;
		}
		.zone-light { top: 25%; width: 100%; height: 75%; background-color: rgba(255,255,255,0.1); border-right: 2px dashed rgba(255,255,255,0.2); }
		.zone-dark { top: 0%; width: 100%; height: 25%;  background-color: rgba(0,0,0,0.3); }
		.zone-label { color: rgba(255,255,255,0.5); font-weight: bold; text-transform: uppercase; }

		.exit-zone {
			position: absolute;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 10;
			transform: translate(-50%, -50%);
		}

		.exit-text {
			position: relative;
			white-space: nowrap;
			animation: bounce 1s infinite;
		}

		/* Level 6 Zones */
		.ctx-zone {
			position: absolute; top: 43%; bottom: 0; width: 50%;
			display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: var(--wa-space-m);
			border-radius: var(--wa-border-radius-circle);
			border: var(--wa-border-width-s) solid var(--wa-color-neutral-border-normal);
			transition: all 0.5s;
		}
		.ctx-legacy { left: 50%; }
		.ctx-new { left: 0%; }
		
		.ctx-legacy.inactive {
			border: var(--wa-border-width-s) solid var(--wa-color-danger-border-normal);
			background-color: color-mix(in oklab, var(--wa-color-danger-fill-loud) 0%, transparent);
		}
		.ctx-legacy.active {
			border: var(--wa-border-width-l) solid var(--wa-color-danger-border-loud);
			background-color: color-mix(in oklab, var(--wa-color-danger-fill-loud) 10%, transparent);
		}
		
		.ctx-new.inactive {
			border: var(--wa-border-width-s) solid var(--wa-color-brand-border-normal);
			background-color: color-mix(in oklab, var(--wa-color-brand-fill-loud) 0%, transparent);
		}
		.ctx-new.active {
			border: var(--wa-border-width-l) solid var(--wa-color-brand-border-loud);
			background-color: color-mix(in oklab, var(--wa-color-brand-fill-loud) 10%, transparent);
		}

		.ctx-title { font-weight: bold; text-transform: uppercase; margin-bottom: var(--wa-space-xs); margin-top: 0; }


		/* Hero Container */
		hero-profile {
			position: absolute; z-index: 30;
			transform: translate(-50%, -50%);
			will-change: transform, left, top;
			width: 15%;
			aspect-ratio: 1/1;
			pointer-events: none;
		}

		reward-element {
			width: 5%;
			aspect-ratio: 1/1;
			z-index: 20;
			transition: all 0.8s ease-in-out;
		}

		reward-element.growing {
			transform: translate(-50%, -50%) scale(10);
			z-index: 100;
		}

		reward-element.moving {
			transform: translate(-50%, -50%) scale(0.1);
			opacity: 0;
		}

		@keyframes bounce {
			0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
			50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
		}
	`,
	];
}

customElements.define("game-viewport", GameViewport);
