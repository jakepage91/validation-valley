import { GameView } from "./GameView.js";

if (!customElements.get("game-view")) {
	customElements.define("game-view", GameView);
}

export { GameView };
