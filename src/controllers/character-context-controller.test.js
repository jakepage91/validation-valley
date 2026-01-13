import { beforeEach, describe, expect, it, vi } from "vitest";
import { CharacterContextController } from "./character-context-controller.js";

describe("CharacterContextController", () => {
	/** @type {any} */
	let host;
	/** @type {CharacterContextController} */
	let controller;
	/** @type {any} */
	let characterProvider;
	/** @type {any} */
	let mockGameState;
	/** @type {any} */
	let mockQuestController;

	beforeEach(() => {
		host = {
			addController: vi.fn(),
			removeController: vi.fn(),
			requestUpdate: vi.fn(),
			updateComplete: Promise.resolve(true),
		};
		characterProvider = { setValue: vi.fn() };

		mockGameState = {
			getState: vi.fn().mockReturnValue({
				themeMode: "light",
				hotSwitchState: "legacy",
				hasCollectedItem: false,
				isRewardCollected: false,
			}),
		};

		mockQuestController = {
			currentChapter: {
				id: "level1",
				hero: { image: "hero.png", reward: "hero-reward.png" },
				reward: { image: "item.png" },
			},
		};

		controller = new CharacterContextController(/** @type {any} */ (host), {
			gameState: mockGameState,
			questController: mockQuestController,
			characterProvider,
		});
	});

	it("should initialize and add controller to host", () => {
		expect(host.addController).toHaveBeenCalledWith(controller);
	});

	describe("update", () => {
		it("should update suit context based on level and reward", () => {
			mockQuestController.currentChapter = {
				id: "level_1",
				hero: {
					image: "/assets/level_1/hero.png",
					reward: "/assets/level_1/hero-reward.png",
				},
			};

			controller.hostUpdate();

			expect(characterProvider.setValue).toHaveBeenCalledWith(
				expect.objectContaining({
					suit: { image: "/assets/level_1/hero.png" },
				}),
			);
		});

		it("should update suit context with reward image when evolved", () => {
			mockQuestController.currentChapter = {
				id: "level_1",
				hero: {
					image: "/assets/level_1/hero.png",
					reward: "/assets/level_1/hero-reward.png",
				},
			};
			mockGameState.getState.mockReturnValue({
				isRewardCollected: true,
			});

			controller.hostUpdate();

			expect(characterProvider.setValue).toHaveBeenCalledWith(
				expect.objectContaining({
					suit: { image: "/assets/level_1/hero-reward.png" },
				}),
			);
		});

		it("should update gear context when item is collected", () => {
			mockQuestController.currentChapter = {
				id: "level_2",
				reward: { image: "/assets/level_2/reward.png" },
			};
			mockGameState.getState.mockReturnValue({
				hasCollectedItem: true,
			});

			controller.hostUpdate();

			expect(characterProvider.setValue).toHaveBeenCalledWith(
				expect.objectContaining({
					gear: { image: "/assets/level_2/reward.png" },
				}),
			);
		});

		it("should clear gear context when item is not collected", () => {
			mockQuestController.currentChapter = {
				id: "level_2",
				reward: { image: "/assets/level_2/reward.png" },
			};
			mockGameState.getState.mockReturnValue({
				hasCollectedItem: false,
			});

			controller.hostUpdate();

			expect(characterProvider.setValue).toHaveBeenCalledWith(
				expect.objectContaining({
					gear: { image: null },
				}),
			);
		});

		it("should update power context based on hot switch state", () => {
			mockGameState.getState.mockReturnValue({
				hotSwitchState: "new",
				themeMode: "dark",
			});

			controller.hostUpdate();

			expect(characterProvider.setValue).toHaveBeenCalledWith(
				expect.objectContaining({
					power: {
						effect: "stable",
						intensity: "high",
					},
				}),
			);
		});

		it("should not crash if characterProvider is missing", () => {
			controller = new CharacterContextController(/** @type {any} */ (host), {
				gameState: mockGameState,
				questController: mockQuestController,
			});

			expect(() => controller.hostUpdate()).not.toThrow();
		});
	});
});
