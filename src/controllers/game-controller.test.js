import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EVENTS } from "../constants/events.js";
import { GameService } from "../services/game-service.js";
import { GameController } from "./game-controller.js";

describe("GameController", () => {
	/** @type {import("lit").ReactiveControllerHost} */
	let host;
	/** @type {GameController} */
	let controller;
	/** @type {GameService} */
	let gameService;
	/** @type {import("vitest").Mock} */
	let setLevel;
	/** @type {import("vitest").Mock} */
	let getState;

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
			gameState: {
				setShowDialog: vi.fn(),
				setCollectedItem: vi.fn(),
				getState: vi.fn(() => ({ isRewardCollected: false })),
			},
			commandBus: {
				execute: vi.fn(),
			},
			questController: {
				hasNextChapter: vi.fn(),
			},
		};

		setLevel = vi.fn();
		getState = vi.fn().mockReturnValue({ level: "chapter-1" });

		// Mock window.location
		window.history.replaceState({}, "", "/");
	});

	afterEach(() => {
		// @ts-expect-error
		delete window.game;
		vi.restoreAllMocks();
	});

	it("should not enable debug mode by default", () => {
		gameService = new GameService();
		controller = new GameController(host, context, { gameService });
		controller.hostConnected();

		expect(controller.isEnabled).toBe(false);
		// @ts-expect-error
		expect(window.game).toBeUndefined();
	});

	it("should enable debug mode when ?debug is in URL", () => {
		window.history.replaceState({}, "", "/?debug");
		gameService = new GameService({ setLevel, getState });
		controller = new GameController(host, context, { gameService });
		controller.hostConnected();

		expect(controller.isEnabled).toBe(true);
	});

	it("should NOT expose window.game even in debug mode", () => {
		window.history.replaceState({}, "", "/?debug");
		gameService = new GameService({ setLevel, getState });
		controller = new GameController(host, context, { gameService });
		controller.hostConnected();

		// @ts-expect-error
		expect(window.game).toBeUndefined();
	});

	it("should log instructions and call getState on enable", () => {
		window.history.replaceState({}, "", "/?debug");
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

		gameService = new GameService({ getState });
		controller = new GameController(host, context, { gameService });
		controller.hostConnected();

		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining("DEBUG MODE ENABLED"),
		);
		expect(getState).toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it("should handle LEVEL_COMPLETED event", () => {
		gameService = new GameService();
		controller = new GameController(host, context, { gameService });

		controller.hostConnected();

		// Verify registration
		expect(context.eventBus.on).toHaveBeenCalledWith(
			EVENTS.UI.LEVEL_COMPLETED,
			controller.handleLevelCompleted,
		);

		// Simulate execution
		controller.handleLevelCompleted();

		// Should have toggled dialog off
		expect(context.gameState.setShowDialog).toHaveBeenCalledWith(false);

		// And set collected item (since we mocked hasNextChapter to undefined/false)
		expect(context.gameState.setCollectedItem).toHaveBeenCalledWith(true);
	});
});
