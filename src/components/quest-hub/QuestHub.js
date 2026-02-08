import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { html, LitElement } from "lit";
import { questHubStyles } from "./QuestHub.styles.js";
import "@awesome.me/webawesome/dist/components/button/button.js";
import "@awesome.me/webawesome/dist/components/icon/icon.js";
import "../about-slides/about-slides.js";
import "../language-selector/language-selector.js";
import "./components/quest-card/quest-card.js";
import metalbearMascot from "../../assets/validation-clearing/metalbear.png";
import { UIEvents } from "../../core/events.js";

/**
 * QuestHub - Quest selection UI
 *
 * @typedef {import("../about-slides/AboutSlides.js").AboutSlides} AboutSlides
 * @typedef {import("../../content/quests/quest-types.js").Quest} Quest
 *
 * Displays available quests with:
 * - Quest cards for each available quest
 * - Coming soon section
 * - About dialog
 * - Fullscreen toggle
 * - Progress reset
 *
 * @element quest-hub
 * @property {Array<Quest>} quests - Available quests
 * @property {Array<Quest>} comingSoonQuests - Coming soon quests
 * @property {boolean} showFullDescription - Whether to show full description
 * @property {boolean} isFullscreen - Whether the app is in fullscreen mode
 * @fires quest-select - Fired when a quest is selected
 * @fires quest-continue - Fired when a quest is continued
 * @fires reset-progress - Fired when progress reset is requested
 */
export class QuestHub extends LitElement {
	/** @override */
	static styles = questHubStyles;

	/** @override */
	static properties = {
		quests: { type: Array },
		comingSoonQuests: { type: Array },
		showFullDescription: { type: Boolean },
		isFullscreen: { type: Boolean },
		localizationService: { attribute: false },
	};

	constructor() {
		super();
		updateWhenLocaleChanges(this);
		/** @type {Quest[]} */
		this.quests = [];
		/** @type {Quest[]} */
		this.comingSoonQuests = [];
		this.showFullDescription = false;
		this.isFullscreen = !!document.fullscreenElement;
		/** @type {import('../../services/localization-service.js').LocalizationService | null} */
		this.localizationService = null;
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();
		document.addEventListener(
			"fullscreenchange",
			this.handleFullscreenChange.bind(this),
		);
	}

	/** @override */
	disconnectedCallback() {
		super.disconnectedCallback();
		document.removeEventListener(
			"fullscreenchange",
			this.handleFullscreenChange.bind(this),
		);
	}

	/**
	 * Handles fullscreen change events
	 */
	handleFullscreenChange() {
		this.isFullscreen = !!document.fullscreenElement;
	}

	/** @override */
	render() {
		return html`
			<div class="hub-container">
				<header class="hub-header">
					<nav class="hub-navbar">
						<div class="navbar-actions">
						<wa-button variant="brand" @click="${this.#dispatchOpenAbout}">
						<wa-icon slot="start" name="user"></wa-icon>
						${msg("About")}
						</wa-button>
						<wa-button @click="${this.#toggleFullscreen}">
						<wa-icon slot="start" name="${this.isFullscreen ? "compress" : "expand"}"></wa-icon>
						${this.isFullscreen ? msg("Exit Fullscreen") : msg("Fullscreen")}
						</wa-button>
						<language-selector
							.localizationService="${this.localizationService}"
						></language-selector>
						</div>
					</nav>

					<div class="header-content">
						<h1 class="hub-title">${msg("VALIDATION VALLEY")}</h1>
						<p class="hub-subtitle">${msg("Where the Legacy Dev Loop Ends")}</p>

						<div class="hub-description">
							<p>${msg("VALIDATION VALLEY is your journey through the bottlenecks of modern software development. Discover how AI has shifted where constraints exist—and learn why validation is the new frontier.")}</p>
						</div>
					</div>
				</header>

				<section class="quests-header">
					<h2 class="section-title">${msg("Choose your next adventure...")}</h2>
					<div class="mascot-container">
						<img src="${metalbearMascot}" alt="MetalBear mascot" class="mascot-image" />
					</div>
				</section>

				<section class="quests-section">
					<div class="wa-grid">
						${this.quests.map(
							(quest) => html`
							<quest-card .quest=${quest}></quest-card>
						`,
						)}
						${this.comingSoonQuests.map(
							(quest) => html`
							<quest-card .quest=${quest} .isComingSoon=${true}></quest-card>
						`,
						)}
					</div>
				</section>

				<footer class="hub-footer">
					<wa-button variant="danger" @click="${this.#dispatchReset}">
						<wa-icon slot="start" name="trash"></wa-icon>
						${msg("Reset Progress")}
					</wa-button>
				</footer>
				
				<about-slides></about-slides>
			</div>
		`;
	}

	/**
	 * Dispatches reset progress event after confirmation
	 */
	#dispatchReset() {
		if (
			confirm(
				msg(
					"Are you sure you want to reset all progress? This cannot be undone.",
				),
			)
		) {
			this.dispatchEvent(
				new CustomEvent(UIEvents.RESET_PROGRESS, {
					bubbles: true,
					composed: true,
				}),
			);
		}
	}

	/**
	 * Opens the about dialog
	 */
	#dispatchOpenAbout() {
		const aboutSlides = /** @type {AboutSlides} */ (
			this.shadowRoot?.querySelector("about-slides")
		);
		aboutSlides.show();
	}

	/**
	 * Toggles fullscreen mode
	 */
	#toggleFullscreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
		}
	}
}
