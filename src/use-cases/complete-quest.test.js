import { beforeEach, describe, expect, it, vi } from "vitest";
import { eventBus, GameEvents } from "../core/event-bus.js";
import { CompleteQuestUseCase } from "./complete-quest.js";

describe("CompleteQuestUseCase", () => {
	/** @type {CompleteQuestUseCase} */
	let useCase;
	/** @type {any} */
	let mockQuestController;
	/** @type {any} */
	let mockQuest;

	beforeEach(() => {
		// Create mock quest
		mockQuest = {
			id: "test-quest",
			name: "Test Quest",
			chapters: [],
		};

		// Create mock quest controller
		mockQuestController = {
			currentQuest: mockQuest,
			completeQuest: vi.fn(),
		};

		useCase = new CompleteQuestUseCase({
			questController: mockQuestController,
		});
	});

	it("should complete quest successfully", () => {
		const result = useCase.execute();

		expect(result.success).toBe(true);
		expect(result.questId).toBe("test-quest");
		expect(mockQuestController.completeQuest).toHaveBeenCalled();
	});

	it("should emit QUEST_COMPLETE event", () => {
		const emitSpy = vi.spyOn(eventBus, "emit");

		useCase.execute();

		expect(emitSpy).toHaveBeenCalledWith(GameEvents.QUEST_COMPLETE, {
			questId: "test-quest",
			quest: mockQuest,
		});
	});

	it("should handle no active quest", () => {
		mockQuestController.currentQuest = null;

		const result = useCase.execute();

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(mockQuestController.completeQuest).not.toHaveBeenCalled();
	});

	it("should handle errors gracefully", () => {
		mockQuestController.completeQuest.mockImplementation(() => {
			throw new Error("Completion failed");
		});

		const result = useCase.execute();

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
	});

	it("should emit ERROR event on failure", () => {
		const emitSpy = vi.spyOn(eventBus, "emit");
		mockQuestController.completeQuest.mockImplementation(() => {
			throw new Error("Completion failed");
		});

		useCase.execute();

		expect(emitSpy).toHaveBeenCalledWith(
			GameEvents.ERROR,
			expect.objectContaining({
				message: "Failed to complete quest",
			}),
		);
	});

	it("should log completion", () => {
		// Just verify it doesn't throw
		expect(() => useCase.execute()).not.toThrow();
	});
});
