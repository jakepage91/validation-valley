import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdvanceChapterCommand } from "./advance-chapter-command.js";

describe("AdvanceChapterCommand", () => {
	/** @type {any} */
	let mockGameState;
	/** @type {any} */
	let mockQuestController;

	beforeEach(() => {
		mockGameState = {
			setEvolving: vi.fn(),
		};
		mockQuestController = {
			isInQuest: vi.fn().mockReturnValue(true),
			completeChapter: vi.fn(),
			completeQuest: vi.fn(),
			isLastChapter: vi.fn().mockReturnValue(false),
		};
	});

	it("should advance chapter with evolution state", async () => {
		const command = new AdvanceChapterCommand({
			gameState: mockGameState,
			questController: mockQuestController,
		});

		const executePromise = command.execute();

		expect(mockGameState.setEvolving).toHaveBeenCalledWith(true);

		await executePromise;

		expect(mockQuestController.completeChapter).toHaveBeenCalled();
		expect(mockGameState.setEvolving).toHaveBeenCalledWith(false);
	});

	describe("Regression Tests", () => {
		it("should complete quest if on last chapter (Fix: Unable to exit last chapter)", async () => {
			mockQuestController.isLastChapter.mockReturnValue(true);
			const command = new AdvanceChapterCommand({
				gameState: mockGameState,
				questController: mockQuestController,
			});

			await command.execute();

			expect(mockQuestController.completeQuest).toHaveBeenCalled();
			expect(mockQuestController.completeChapter).not.toHaveBeenCalled();
		});
	});
});
