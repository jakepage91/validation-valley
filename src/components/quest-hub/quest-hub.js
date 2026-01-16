import { QuestHub } from "./QuestHub.js";

if (!customElements.get("quest-hub")) {
	customElements.define("quest-hub", QuestHub);
}
