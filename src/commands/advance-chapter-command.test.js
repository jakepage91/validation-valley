import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FakeGameStateService } from "../services/fakes/fake-game-state-service.js";
import { AdvanceChapterCommand } from "./advance-chapter-command.js";

describe("AdvanceChapterCommand", () => {
	/** @type {FakeGameStateService} */
	let fakeGameState;
	/** @type {any} */
	let mockQuestController;

	beforeEach(() => {
		vi.useFakeTimers();
		fakeGameState = new FakeGameStateService();
		mockQuestController = {
			isInQuest: vi.fn().mockReturnValue(true),
			completeChapter: vi.fn(),
			completeQuest: vi.fn(),
			isLastChapter: vi.fn().mockReturnValue(false),
		};
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should advance chapter with evolution state sequence", async () => {
		const command = new AdvanceChapterCommand({
			gameState: fakeGameState,
			questController: mockQuestController,
		});

		const executePromise = command.execute();

		// Check intermediate state (evolution should be active)
		expect(fakeGameState.isEvolving.get()).toBe(true);

		// Fast-forward time
		await vi.advanceTimersByTimeAsync(500);
		await executePromise;

		expect(mockQuestController.completeChapter).toHaveBeenCalled();
		expect(fakeGameState.isEvolving.get()).toBe(false);
	});

	describe("Regression Tests", () => {
		it("should complete quest if on last chapter (Fix: Unable to exit last chapter)", async () => {
			mockQuestController.isLastChapter.mockReturnValue(true);
			const command = new AdvanceChapterCommand({
				gameState: fakeGameState,
				questController: mockQuestController,
			});

			const executePromise = command.execute();
			await vi.advanceTimersByTimeAsync(500);
			await executePromise;

			expect(mockQuestController.completeQuest).toHaveBeenCalled();
			expect(mockQuestController.completeChapter).not.toHaveBeenCalled();
		});
	});
});
