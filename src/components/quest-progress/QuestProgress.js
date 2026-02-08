import { consume } from "@lit/context";
import { SignalWatcher } from "@lit-labs/signals";
import { html, LitElement, nothing } from "lit";
import { questControllerContext } from "../../contexts/quest-controller-context.js";
import { questStateContext } from "../../game/contexts/quest-context.js";
import { questProgressStyles } from "./QuestProgress.styles.js";

/**
 * Chapter display names for the progress indicator
 * @type {Record<string, string>}
 */
const CHAPTER_NAMES = {
	"ai-forged-lands": "AI-Forged Lands",
	"flooded-gate": "Flooded OSS Maintainer Gate",
	"cracked-archive": "Cracked CVE Archive",
	"endless-loop": "Endless Loop",
	"validation-clearing": "Validation Clearing",
	"the-end": "The End",
};

/**
 * QuestProgress - Vertical progress indicator showing current position in quest
 * Click on any chapter to jump directly to it (useful for presentations)
 *
 * @element quest-progress
 */
export class QuestProgress extends SignalWatcher(LitElement) {
	/** @type {import('../../services/interfaces.js').IQuestController} */
	@consume({ context: questControllerContext, subscribe: true })
	accessor questController =
		/** @type {import('../../services/interfaces.js').IQuestController} */ (
			/** @type {unknown} */ (null)
		);

	/** @type {import('../../game/interfaces.js').IQuestStateService} */
	@consume({ context: questStateContext, subscribe: true })
	accessor questState =
		/** @type {import('../../game/interfaces.js').IQuestStateService} */ (
			/** @type {unknown} */ (null)
		);

	/** @override */
	static styles = questProgressStyles;

	/**
	 * Handle click on a chapter to jump to it
	 * @param {string} chapterId
	 */
	#handleChapterClick(chapterId) {
		if (this.questController?.forceJumpToChapter) {
			this.questController.forceJumpToChapter(chapterId);
		}
	}

	/** @override */
	render() {
		if (!this.questController || !this.questState) {
			return nothing;
		}

		const currentQuest = this.questController.currentQuest;
		if (!currentQuest?.chapterIds) {
			return nothing;
		}

		const chapterIds = currentQuest.chapterIds;
		// Use the reactive signal from questState instead of the plain property
		const currentIndex = this.questState.currentChapterNumber.get() - 1;

		return html`
			<div class="progress-container">
				${chapterIds.map((chapterId, index) => {
					const isCompleted = index < currentIndex;
					const isCurrent = index === currentIndex;

					const markerClass = isCompleted
						? "completed"
						: isCurrent
							? "current"
							: "upcoming";

					const connectorClass = index < currentIndex ? "completed" : "";

					return html`
						<div
							class="chapter-marker ${markerClass}"
							@click=${() => this.#handleChapterClick(chapterId)}
							title="Jump to ${CHAPTER_NAMES[chapterId] || chapterId}"
						>
							<span class="chapter-label">${CHAPTER_NAMES[chapterId] || chapterId}</span>
						</div>
						${
							index < chapterIds.length - 1
								? html`<div class="connector ${connectorClass}"></div>`
								: nothing
						}
					`;
				})}
			</div>
		`;
	}
}

if (!customElements.get("quest-progress")) {
	customElements.define("quest-progress", QuestProgress);
}
