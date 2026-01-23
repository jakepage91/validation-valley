import { describe, expect, it } from "vitest";
import { HotSwitchStates } from "../core/constants.js";
import { InteractWithNpcUseCase } from "./interact-with-npc.js";

describe("InteractWithNpcUseCase", () => {
	const useCase = new InteractWithNpcUseCase();

	it("should return action 'none' if not close", () => {
		const result = useCase.execute({
			isClose: false,
			chapterData: /** @type {any} */ ({}),
			gameState: { hotSwitchState: HotSwitchStates.NEW },
			hasCollectedItem: false,
		});

		expect(result.action).toBe("none");
		expect(result.success).toBe(false);
	});

	it("should return action 'showDialog' for regular interaction if item not collected", () => {
		const result = useCase.execute({
			isClose: true,
			chapterData: /** @type {any} */ ({ npc: {} }),
			gameState: { hotSwitchState: HotSwitchStates.LEGACY },
			hasCollectedItem: false,
		});

		expect(result.action).toBe("showDialog");
		expect(result.success).toBe(true);
	});

	it("should return action 'none' for regular interaction if item already collected", () => {
		const result = useCase.execute({
			isClose: true,
			chapterData: /** @type {any} */ ({ npc: {} }),
			gameState: { hotSwitchState: HotSwitchStates.NEW },
			hasCollectedItem: true,
		});

		expect(result.action).toBe("none");
		expect(result.success).toBe(false);
	});

	it("should return action 'showDialog' for final boss if hotSwitchState is 'new'", () => {
		const result = useCase.execute({
			isClose: true,
			chapterData: /** @type {any} */ ({
				npc: {
					requirements: {
						hotSwitchState: {
							value: HotSwitchStates.NEW,
							message: "REQ: NEW API",
						},
					},
				},
			}),
			gameState: { hotSwitchState: HotSwitchStates.NEW },
			hasCollectedItem: false,
		});

		expect(result.action).toBe("showDialog");
		expect(result.success).toBe(true);
	});

	it("should return action 'showLocked' for final boss if hotSwitchState is 'legacy'", () => {
		const result = useCase.execute({
			isClose: true,
			chapterData: /** @type {any} */ ({
				npc: {
					requirements: {
						hotSwitchState: {
							value: HotSwitchStates.NEW,
							message: "REQ: NEW API",
						},
					},
				},
			}),
			gameState: { hotSwitchState: HotSwitchStates.LEGACY },
			hasCollectedItem: false,
		});

		expect(result.action).toBe("showLocked");
		expect(result.message).toBe("REQ: NEW API");
		expect(result.success).toBe(false);
	});
	it("should support generic requirements (e.g. check level)", () => {
		const result = useCase.execute({
			isClose: true,
			chapterData: /** @type {any} */ ({
				npc: {
					requirements: {
						level: { value: "specific-level", message: "Level too low" },
					},
				},
			}),
			gameState: { hotSwitchState: HotSwitchStates.NEW, level: "other-level" },
			hasCollectedItem: false,
		});

		expect(result.action).toBe("showLocked");
		expect(result.message).toBe("Level too low");
		expect(result.success).toBe(false);
	});

	it("should ensure ALL requirements are met (Logical AND)", () => {
		const result = useCase.execute({
			isClose: true,
			chapterData: /** @type {any} */ ({
				npc: {
					requirements: {
						hotSwitchState: {
							value: HotSwitchStates.NEW,
							message: "REQ: NEW API",
						},
						hasKey: { value: true, message: "Need Key" },
					},
				},
			}),
			gameState: { hotSwitchState: HotSwitchStates.NEW, hasKey: false },
			hasCollectedItem: false,
		});

		expect(result.action).toBe("showLocked");
		expect(result.message).toBe("Need Key");
		expect(result.success).toBe(false);
	});
});
