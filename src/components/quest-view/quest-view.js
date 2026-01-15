import { QuestView } from "./QuestView.js";

if (!customElements.get("quest-view")) {
	customElements.define("quest-view", QuestView);
}

export { QuestView };
