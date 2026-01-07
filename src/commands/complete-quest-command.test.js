import { beforeEach, describe, expect, it, vi } from "vitest";
import { CompleteQuestCommand } from "./complete-quest-command.js";

describe("CompleteQuestCommand", () => {
	/** @type {any} */
	let mockUseCase;
	/** @type {CompleteQuestCommand} */
	let command;

	beforeEach(() => {
		mockUseCase = {
			execute: vi
				.fn()
				.mockReturnValue({ success: true, data: { status: "completed" } }),
		};

		command = new CompleteQuestCommand({
			completeQuestUseCase: mockUseCase,
		});
	});

	it("should have correct name and empty metadata", () => {
		expect(command.name).toBe("CompleteQuest");
		expect(command.metadata).toEqual({});
	});

	it("should execute use case", () => {
		const result = command.execute();

		expect(mockUseCase.execute).toHaveBeenCalled();
		expect(result).toEqual({ success: true, data: { status: "completed" } });
	});

	it("should throw error if use case fails", () => {
		const error = new Error("Completion failed");
		mockUseCase.execute.mockReturnValue({ success: false, error });

		expect(() => command.execute()).toThrow("Completion failed");
	});

	it("should throw generic error if use case fails without error object", () => {
		mockUseCase.execute.mockReturnValue({ success: false });

		expect(() => command.execute()).toThrow("Failed to complete quest");
	});
});
