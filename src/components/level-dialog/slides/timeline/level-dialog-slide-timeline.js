import { LevelDialogSlideTimeline } from "./LevelDialogSlideTimeline.js";

if (!customElements.get("level-dialog-slide-timeline")) {
	customElements.define(
		"level-dialog-slide-timeline",
		LevelDialogSlideTimeline,
	);
}
