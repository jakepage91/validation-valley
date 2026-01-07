import { beforeEach, describe, expect, it } from "vitest";
import { GameStateService } from "./game-state-service.js";

/**
 * Regression Test: State Synchronization
 * Ensures that changes in GameStateService are correctly reflected in the application component.
 */
describe("State Synchronization Regression", () => {
	/** @type {import("./game-state-service.js").GameStateService} */
	let gameState;
	/** @type {any} */
	let mockApp;

	beforeEach(() => {
		gameState = new GameStateService();
		mockApp = {
			gameState,
			showDialog: false,
			showQuestCompleteDialog: false,
			syncState: function () {
				const state = this.gameState.getState();
				this.showDialog = state.showDialog;
				this.showQuestCompleteDialog = state.isQuestCompleted;
			},
		};
		// Simulate the subscription that LegacysEndApp does
		gameState.subscribe(() => mockApp.syncState());
	});

	it("should sync showDialog from GameStateService to app", () => {
		gameState.setShowDialog(true);
		expect(mockApp.showDialog).to.be.true;

		gameState.setShowDialog(false);
		expect(mockApp.showDialog).to.be.false;
	});

	it("should sync isQuestCompleted from GameStateService to app", () => {
		gameState.setQuestCompleted(true);
		expect(mockApp.showQuestCompleteDialog).to.be.true;

		gameState.setQuestCompleted(false);
		expect(mockApp.showQuestCompleteDialog).to.be.false;
	});
});
