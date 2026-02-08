import "@awesome.me/webawesome/dist/components/button/button.js";
import "@awesome.me/webawesome/dist/components/icon/icon.js";
import { consume } from "@lit/context";
import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { SignalWatcher } from "@lit-labs/signals";
import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import metalbearLogo from "../../assets/validation-clearing/metalbear.png";
import mirrordQrCode from "../../assets/validation-clearing/mirrord-qr.png";
import { questControllerContext } from "../../contexts/quest-controller-context.js";
import { sessionContext } from "../../contexts/session-context.js";
import { processImagePath } from "../../utils/process-assets.js";
import { victoryScreenStyles } from "./VictoryScreen.styles.js";

/**
 * @typedef {import("../../services/quest-registry-service.js").Quest} Quest
 * @typedef {import("../../content/quests/quest-types.js").RewardConfig} RewardConfig
 */

/**
 * @element victory-screen
 * @property {Quest} quest
 * @property {Function} onReturn
 * @extends {LitElement}
 */
export class VictoryScreen extends SignalWatcher(
	/** @type {new (...args: unknown[]) => import('lit').ReactiveElement} */ (
		LitElement
	),
) {
	/** @type {import('../../services/session-service.js').SessionService} */
	@consume({ context: sessionContext, subscribe: true })
	accessor sessionService =
		/** @type {import('../../services/session-service.js').SessionService} */ (
			/** @type {unknown} */ (null)
		);

	/** @type {import('../../services/interfaces.js').IQuestController} */
	@consume({ context: questControllerContext, subscribe: true })
	accessor questController =
		/** @type {import('../../services/interfaces.js').IQuestController} */ (
			/** @type {unknown} */ (null)
		);

	/** @override */
	static styles = victoryScreenStyles;

	/** @type {boolean} */
	@property({ type: Boolean })
	accessor showQrCode = false;

	constructor() {
		super();
		updateWhenLocaleChanges(this);
	}

	#toggleView() {
		this.showQrCode = !this.showQrCode;
	}

	/** @override */
	render() {
		const quest = this.sessionService?.currentQuest.get();
		if (!quest) {
			return html`<div>${msg("Error: No quest data for completion screen.")}</div>`;
		}

		// Collect all rewards from chapters
		/** @type {Array<RewardConfig>} */
		const collectedRewards = [];
		if (quest.chapterIds && quest.chapters) {
			quest.chapterIds.forEach((chapterId) => {
				const chapter = quest?.chapters?.[chapterId];
				if (chapter?.reward) {
					collectedRewards.push(chapter.reward);
				}
			});
		}

		return html`
			<div class="victory-screen">
				<img src="${metalbearLogo}" alt="MetalBear" class="metalbear-logo" />
				<h1 class="victory-title">${msg("Your Journey Complete")}</h1>

				<div class="carousel-container">
					<div class="carousel-track ${this.showQrCode ? "show-qr" : ""}">
						<!-- Rewards Panel -->
						<div class="carousel-panel rewards-panel">
							<p class="victory-text">
								${msg("Along the way, you gathered these insights:")}
							</p>
							<ul class="rewards-list" role="list">
								${collectedRewards.map(
									(reward, index) => html`
									<li class="reward-item" style="--index: ${index}">
										<img src="${ifDefined(processImagePath(reward.image))}" alt="${reward.name}" class="reward-img" />
										<span class="reward-name">${reward.name}</span>
									</li>
								`,
								)}
							</ul>
							<p class="victory-text" style="font-style: italic; opacity: 0.9;">
								${msg("AI accelerates generation. Validation remains the key.")}
							</p>
						</div>

						<!-- QR Code Panel -->
						<div class="carousel-panel qr-panel">
							<p class="victory-text">${msg("Try mirrord yourself")}</p>
							<img src="${mirrordQrCode}" alt="Scan to visit metalbear.com/mirrord" class="qr-code" />
							<p class="qr-label">metalbear.com/mirrord</p>
							<p class="github-ask">
								${msg("If you find it useful, we'd appreciate a")}
								<a href="https://github.com/metalbear-co/mirrord" target="_blank" rel="noopener">⭐ ${msg("on GitHub")}</a>
							</p>
						</div>
					</div>

					<!-- Arrow Button -->
					<button class="carousel-arrow ${this.showQrCode ? "flipped" : ""}" @click="${this.#toggleView}" aria-label="${this.showQrCode ? "Show rewards" : "Show QR code"}">
						<wa-icon name="chevron-right"></wa-icon>
					</button>
				</div>

				<wa-button class="ng-btn" @click="${() => this.questController?.returnToHub()}">
					<wa-icon slot="start" name="house"></wa-icon>
					${msg("RETURN TO HUB")}
				</wa-button>
			</div>
		`;
	}
}
