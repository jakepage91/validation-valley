import { beforeEach, describe, expect, it, vi } from "vitest";
import { eventBus, GameEvents } from "../core/event-bus.js";
import { ContinueQuestUseCase } from "./continue-quest.js";

describe("ContinueQuestUseCase", () => {
	let useCase;
	let mockQuestController;
	let mockQuest;

	beforeEach(() => {
		eventBus.clear();

		mockQuest = {
			id: "test-quest",
			name: "Test Quest",
			chapters: [],
		};

		mockQuestController = {
			continueQuest: vi.fn().mockResolvedValue(undefined),
			currentQuest: mockQuest,
		};

		useCase = new ContinueQuestUseCase({
			// @ts-expect-error - Partial mock for testing
			questController: mockQuestController,
		});
	});

	it("should continue quest successfully", async () => {
		const result = await useCase.execute("test-quest");

		expect(result.success).toBe(true);
		expect(result.quest).toBe(mockQuest);
		expect(result.error).toBeUndefined();
		expect(mockQuestController.continueQuest).toHaveBeenCalledWith(
			"test-quest",
		);
	});

	it("should emit LOADING_START event", async () => {
		const listener = vi.fn();
		eventBus.on(GameEvents.LOADING_START, listener);

		await useCase.execute("test-quest");

		expect(listener).toHaveBeenCalledWith({ source: "continueQuest" });
	});

	it("should emit NAVIGATE_QUEST event on success", async () => {
		const listener = vi.fn();
		eventBus.on(GameEvents.NAVIGATE_QUEST, listener);

		await useCase.execute("test-quest");

		expect(listener).toHaveBeenCalledWith({ questId: "test-quest" });
	});

	it("should emit LOADING_END event", async () => {
		const listener = vi.fn();
		eventBus.on(GameEvents.LOADING_END, listener);

		await useCase.execute("test-quest");

		expect(listener).toHaveBeenCalledWith({ source: "continueQuest" });
	});

	it("should handle errors gracefully", async () => {
		const error = new Error("Quest not found");
		mockQuestController.continueQuest.mockRejectedValue(error);

		const result = await useCase.execute("invalid-quest");

		expect(result.success).toBe(false);
		expect(result.quest).toBeNull();
		expect(result.error).toBe(error);
	});

	it("should emit ERROR event on failure", async () => {
		const error = new Error("Quest not found");
		mockQuestController.continueQuest.mockRejectedValue(error);

		const listener = vi.fn();
		eventBus.on(GameEvents.ERROR, listener);

		await useCase.execute("invalid-quest");

		expect(listener).toHaveBeenCalledWith({
			message: "Failed to continue quest",
			error,
			context: { questId: "invalid-quest" },
		});
	});

	it("should emit LOADING_END even on error", async () => {
		mockQuestController.continueQuest.mockRejectedValue(
			new Error("Test error"),
		);

		const listener = vi.fn();
		eventBus.on(GameEvents.LOADING_END, listener);

		await useCase.execute("test-quest");

		expect(listener).toHaveBeenCalledWith({ source: "continueQuest" });
	});
});
