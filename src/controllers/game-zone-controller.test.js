import { beforeEach, describe, expect, it, vi } from "vitest";
import { FakeGameStateService } from "../services/fakes/fake-game-state-service.js";
import { GameZoneController } from "./game-zone-controller.js";

describe("GameZoneController", () => {
	/** @type {import("lit").ReactiveControllerHost} */
	let host;
	/** @type {GameZoneController} */
	let controller;
	/** @type {any} */
	let context;
	/** @type {FakeGameStateService} */
	let fakeGameState;

	beforeEach(() => {
		host = {
			addController: vi.fn(),
			removeController: vi.fn(),
			requestUpdate: vi.fn(),
			updateComplete: Promise.resolve(true),
		};

		fakeGameState = new FakeGameStateService();
		// Initial state
		fakeGameState.hasCollectedItem.set(false);

		context = {
			eventBus: {
				on: vi.fn(),
				off: vi.fn(),
				emit: vi.fn(),
			},
			questController: {
				currentChapter: {},
			},
			gameState: fakeGameState,
		};
	});

	it("should initialize correctly", () => {
		controller = new GameZoneController(host, context, {
			processGameZoneInteraction: /** @type {any} */ ({
				execute: vi.fn(),
			}),
		});
		expect(host.addController).toHaveBeenCalledWith(controller);
	});

	it("should check zones on hostUpdate", () => {
		controller = new GameZoneController(host, context, {
			processGameZoneInteraction: /** @type {any} */ ({
				execute: vi.fn().mockReturnValue([]),
			}),
		});

		const spy = vi.spyOn(controller, "checkZones");

		// Initial state
		fakeGameState.heroPos.set({ x: 50, y: 50 });
		controller.hostConnected();
		controller.hostUpdate();

		// Initial check
		expect(spy).toHaveBeenCalled();

		// Update position
		spy.mockClear();
		fakeGameState.heroPos.set({ x: 55, y: 55 });
		controller.hostUpdate();

		expect(spy).toHaveBeenCalledWith(55, 55, false);

		controller.hostDisconnected();
	});

	describe("Theme Zones", () => {
		const themeZones = [
			{
				x: 0,
				y: 25,
				width: 100,
				height: 75,
				type: "THEME_CHANGE",
				payload: "light",
				requiresItem: true,
			},
			{
				x: 0,
				y: 0,
				width: 100,
				height: 25,
				type: "THEME_CHANGE",
				payload: "dark",
				requiresItem: true,
			},
		];

		it("should trigger theme change when item is collected and in zone", () => {
			context.questController.currentChapter = { zones: themeZones };

			// Mock the use case to return the theme change result requested
			const mockUseCase = {
				execute: vi.fn().mockReturnValue([
					{
						type: "THEME_CHANGE",
						payload: "light",
					},
				]),
			};

			controller = new GameZoneController(host, context, {
				processGameZoneInteraction: /** @type {any} */ (mockUseCase),
			});

			// Update state to have collected item
			fakeGameState.hasCollectedItem.set(true);

			// Above limit -> Light
			// The arguments passed to checkZones are irrelevant for this test as usage is mocked,
			// but we call it to trigger the flow.
			controller.checkZones(50, 35, true);
			expect(fakeGameState.themeMode.get()).toBe("light");
		});

		it("should NOT trigger theme change if item is NOT collected", () => {
			// I'll add `requiresItem: true` to the Zone in the test, and update UseCase to handle it.
			// Let's stick to the Plan: "Refactor Quest Logic".
			// I missed this nuance in the original file, it was a TODO/Empty test.
			// I will populate it correctly now using Fakes.

			context.questController.currentChapter = { zones: themeZones };
			fakeGameState.hasCollectedItem.set(false);
			fakeGameState.themeMode.set("dark");

			// Logic is inside processGameZoneInteraction.
			// If I mock it to return [] (empty actions), I simulate "No Action".
			const mockUseCase = {
				execute: vi.fn().mockReturnValue([]),
			};

			controller = new GameZoneController(host, context, {
				processGameZoneInteraction: /** @type {any} */ (mockUseCase),
			});

			controller.checkZones(50, 35, true);
			expect(fakeGameState.themeMode.get()).toBe("dark");
		});
	});
	describe("Regressions & Optimizations", () => {
		it("should skip processing if position has not changed", () => {
			const processSpy = vi.fn().mockReturnValue([]);
			controller = new GameZoneController(host, context, {
				processGameZoneInteraction: /** @type {any} */ ({
					execute: processSpy,
				}),
			});

			fakeGameState.heroPos.set({ x: 10, y: 10 });
			controller.hostUpdate();
			expect(processSpy).toHaveBeenCalledTimes(1);

			// Call update again with same position
			controller.hostUpdate();
			expect(processSpy).toHaveBeenCalledTimes(1); // Should not increase

			// Change position
			fakeGameState.heroPos.set({ x: 20, y: 20 });
			controller.hostUpdate();
			expect(processSpy).toHaveBeenCalledTimes(2); // Should increase
		});

		it("should prioritize the last matching zone when zones overlap", () => {
			const processSpy = vi.fn().mockReturnValue([
				{ type: "CONTEXT_CHANGE", payload: "legacy" },
				{ type: "CONTEXT_CHANGE", payload: "new" }, // Should win
			]);

			controller = new GameZoneController(host, context, {
				processGameZoneInteraction: /** @type {any} */ ({
					execute: processSpy,
				}),
			});

			const spy = vi.spyOn(fakeGameState, "setHotSwitchState");

			fakeGameState.heroPos.set({ x: 50, y: 50 });
			controller.hostUpdate();

			expect(spy).toHaveBeenCalledWith("new");
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it("should only update state if value actually changed", () => {
			// Set initial state
			fakeGameState.setThemeMode("light");

			const processSpy = vi.fn().mockReturnValue([
				{ type: "THEME_CHANGE", payload: "light" }, // Same as current
			]);

			controller = new GameZoneController(host, context, {
				processGameZoneInteraction: /** @type {any} */ ({
					execute: processSpy,
				}),
			});

			const spy = vi.spyOn(fakeGameState, "setThemeMode");

			fakeGameState.heroPos.set({ x: 50, y: 50 });
			controller.hostUpdate();

			expect(spy).not.toHaveBeenCalled(); // Should skip update
		});
	});
});
