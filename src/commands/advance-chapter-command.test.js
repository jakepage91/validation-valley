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

	it("should not advance if not in quest", async () => {
		mockQuestController.isInQuest.mockReturnValue(false);
		const command = new AdvanceChapterCommand({
			gameState: mockGameState,
			questController: mockQuestController,
		});

		await command.execute();

		expect(mockGameState.setEvolving).not.toHaveBeenCalled();
		expect(mockQuestController.completeChapter).not.toHaveBeenCalled();
	});
});
