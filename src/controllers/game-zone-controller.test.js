import { beforeEach, describe, expect, it, vi } from "vitest";
import { EVENTS } from "../constants/events.js";
import { GAME_CONFIG } from "../constants/game-config.js";
import { GameZoneController } from "./game-zone-controller.js";

describe("GameZoneController", () => {
	/** @type {import("lit").ReactiveControllerHost} */
	let host;
	/** @type {GameZoneController} */
	let controller;
	/** @type {any} */
	let context;

	beforeEach(() => {
		host = {
			addController: vi.fn(),
			removeController: vi.fn(),
			requestUpdate: vi.fn(),
			updateComplete: Promise.resolve(true),
		};

		context = {
			eventBus: {
				on: vi.fn(),
				off: vi.fn(),
				emit: vi.fn(),
			},
			questController: {
				currentChapter: {},
			},
			gameState: {
				getState: vi.fn(() => ({ hasCollectedItem: false })),
			},
		};
	});

	it("should initialize correctly", () => {
		controller = new GameZoneController(host, context);
		expect(host.addController).toHaveBeenCalledWith(controller);
	});

	it("should subscribe to HERO_MOVED on hostConnected", () => {
		controller = new GameZoneController(host, context);
		controller.hostConnected();
		expect(context.eventBus.on).toHaveBeenCalledWith(
			EVENTS.UI.HERO_MOVED,
			/** @type {any} */ (controller).handleHeroMoved,
		);
	});

	describe("Theme Zones", () => {
		it("should trigger theme change when item is collected and zones are active", () => {
			context.questController.currentChapter = { hasThemeZones: true };

			controller = new GameZoneController(host, context);

			// Above limit -> Light
			controller.checkZones(
				50,
				GAME_CONFIG.VIEWPORT.ZONES.THEME.DARK_HEIGHT + 10,
				true,
			);
			expect(context.eventBus.emit).toHaveBeenCalledWith("theme-changed", {
				theme: "light",
			});
			context.eventBus.emit.mockClear();

			// Below limit -> Dark
			controller.checkZones(
				50,
				GAME_CONFIG.VIEWPORT.ZONES.THEME.DARK_HEIGHT - 10,
				true,
			);
			expect(context.eventBus.emit).toHaveBeenCalledWith("theme-changed", {
				theme: "dark",
			});
		});

		it("should NOT trigger theme change if item is NOT collected", () => {
			context.questController.currentChapter = { hasThemeZones: true };

			controller = new GameZoneController(host, context);

			controller.checkZones(50, 10, false); // Should be dark but item not collected
			expect(context.eventBus.emit).not.toHaveBeenCalled();
		});

		it("should NOT trigger theme change if chapter has no zones", () => {
			context.questController.currentChapter = { hasThemeZones: false };

			controller = new GameZoneController(host, context);

			controller.checkZones(50, 10, true);
			expect(context.eventBus.emit).not.toHaveBeenCalled();
		});
	});

	describe("Context Zones (Hot Switch)", () => {
		beforeEach(() => {
			context.questController.currentChapter = { hasHotSwitch: true };
			controller = new GameZoneController(host, context);
		});

		it("should detect legacy zone", () => {
			// Legacy Zone: x[50-100], y[40-100]
			controller.checkZones(75, 75);
			expect(context.eventBus.emit).toHaveBeenCalledWith("context-changed", {
				context: "legacy",
			});
		});

		it("should detect new zone", () => {
			// New Zone: x[0-50), y[40-100]
			controller.checkZones(25, 75);
			expect(context.eventBus.emit).toHaveBeenCalledWith("context-changed", {
				context: "new",
			});
		});

		it("should detect neutral zone", () => {
			// Neutral: y < 40
			controller.checkZones(50, 10);
			expect(context.eventBus.emit).toHaveBeenCalledWith("context-changed", {
				context: null,
			});
		});
	});
});
