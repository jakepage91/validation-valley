import { consume } from "@lit/context";
import { msg } from "@lit/localize";
import { SignalWatcher } from "@lit-labs/signals";
import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
// Import reward images for each chapter
import aiForgedReward from "../../../../assets/ai-forged-lands/reward.png";
import crackedArchiveReward from "../../../../assets/cracked-archive/reward.png";
import endlessLoopReward from "../../../../assets/endless-loop/reward.png";
import floodedGateReward from "../../../../assets/flooded-gate/reward.png";
import validationClearingReward from "../../../../assets/validation-clearing/reward.png";
import { questControllerContext } from "../../../../contexts/quest-controller-context.js";
import { questStateContext } from "../../../../game/contexts/quest-context.js";
import { timelineSlideStyles } from "./LevelDialogSlideTimeline.styles.js";

/**
 * Chapter metadata for the timeline display
 * @type {Record<string, { name: string, icon: string }>}
 */
const CHAPTER_META = {
	"ai-forged-lands": {
		name: "AI-Forged Lands",
		icon: aiForgedReward,
	},
	"flooded-gate": {
		name: "Flooded OSS Maintainer Gate",
		icon: floodedGateReward,
	},
	"cracked-archive": {
		name: "Cracked CVE Archive",
		icon: crackedArchiveReward,
	},
	"endless-loop": {
		name: "Endless Loop",
		icon: endlessLoopReward,
	},
	"validation-clearing": {
		name: "Validation Clearing",
		icon: validationClearingReward,
	},
};

/**
 * LevelDialogSlideTimeline - Shows a visual journey through quest chapters
 *
 * @element level-dialog-slide-timeline
 */
export class LevelDialogSlideTimeline extends SignalWatcher(LitElement) {
	/** @type {import('../../../../services/interfaces.js').IQuestController} */
	@consume({ context: questControllerContext, subscribe: true })
	accessor questController =
		/** @type {import('../../../../services/interfaces.js').IQuestController} */ (
			/** @type {unknown} */ (null)
		);

	/** @type {import('../../../../game/interfaces.js').IQuestStateService} */
	@consume({ context: questStateContext, subscribe: true })
	accessor questState =
		/** @type {import('../../../../game/interfaces.js').IQuestStateService} */ (
			/** @type {unknown} */ (null)
		);

	/**
	 * Optional title override
	 * @type {string}
	 * @override
	 */
	@property({ type: String })
	accessor title = "";

	/**
	 * Optional subtitle
	 * @type {string}
	 */
	@property({ type: String })
	accessor subtitle = "";

	/** @override */
	static styles = timelineSlideStyles;

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
		// Use the reactive signal from questState
		const currentIndex = this.questState.currentChapterNumber.get() - 1;

		const displayTitle = this.title || msg("Your Journey Ahead");
		const displaySubtitle =
			this.subtitle ||
			msg("Collect a reward after each stage representing what we've learned");

		return html`
			<div class="timeline-container">
				<h3 class="timeline-title">${displayTitle}</h3>

				<div class="timeline-track">
					${chapterIds.map((chapterId, index) => {
						const meta = CHAPTER_META[chapterId] || {
							name: chapterId,
							icon: "/assets/default-reward.png",
						};
						const isCompleted = index < currentIndex;
						const isCurrent = index === currentIndex;

						const nodeClass = isCompleted
							? "completed"
							: isCurrent
								? "current"
								: "upcoming";

						const showConnector = index < chapterIds.length - 1;
						const connectorCompleted = index < currentIndex;

						return html`
							<div class="chapter-node ${nodeClass}">
								<div class="chapter-icon">
									<img src="${meta.icon}" alt="${meta.name}" />
								</div>
								<span class="chapter-name">${meta.name}</span>
							</div>
							${
								showConnector
									? html`<div class="connector-line ${connectorCompleted ? "completed" : ""}"></div>`
									: nothing
							}
						`;
					})}
				</div>

				<p class="timeline-subtitle">${displaySubtitle}</p>
			</div>
		`;
	}
}

if (!customElements.get("level-dialog-slide-timeline")) {
	customElements.define(
		"level-dialog-slide-timeline",
		LevelDialogSlideTimeline,
	);
}
