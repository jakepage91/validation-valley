import { beforeEach, describe, expect, it, vi } from "vitest";
import { StartQuestCommand } from "./start-quest-command.js";

describe("StartQuestCommand", () => {
	/** @type {any} */
	let mockUseCase;
	const questId = "quest-1";
	/** @type {StartQuestCommand} */
	let command;

	beforeEach(() => {
		mockUseCase = {
			execute: vi.fn().mockResolvedValue({ success: true, data: { questId } }),
		};

		command = new StartQuestCommand({
			startQuestUseCase: mockUseCase,
			questId,
		});
	});

	it("should have correct name and metadata", () => {
		expect(command.name).toBe("StartQuest");
		expect(command.metadata).toEqual({ questId });
	});

	it("should execute use case with correct questId", async () => {
		const result = await command.execute();

		expect(mockUseCase.execute).toHaveBeenCalledWith(questId);
		expect(result).toEqual({ success: true, data: { questId } });
	});

	it("should throw error if use case fails", async () => {
		const error = new Error("Quest failed");
		mockUseCase.execute.mockResolvedValue({ success: false, error });

		await expect(command.execute()).rejects.toThrow("Quest failed");
	});

	it("should throw generic error if use case fails without error object", async () => {
		mockUseCase.execute.mockResolvedValue({ success: false });

		await expect(command.execute()).rejects.toThrow("Failed to start quest");
	});
});
