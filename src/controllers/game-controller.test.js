import { Signal } from "@lit-labs/signals";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GameController } from "./game-controller.js";

// Mock @lit/context to handle dependency injection in tests
const contextMocks = new Map();
vi.mock("@lit/context", () => {
	class MockContextConsumer {
		/**
		 * @param {any} host
		 * @param {any} options
		 */
		constructor(host, options) {
			this.host = host;
			this.options = options;
			// Store callback to trigger it manually
			contextMocks.set(options.context, options.callback);
		}
	}
	return {
		ContextConsumer: MockContextConsumer,
		createContext: vi.fn((key) => key),
	};
});

describe("GameController", () => {
	/** @type {any} */
	let host;
	/** @type {GameController} */
	let controller;

	// Mock services
	/** @type {any} */
	let mockLogger;
	/** @type {any} */
	let mockHeroState;
	/** @type {any} */
	let mockQuestState;
	/** @type {any} */
	let mockWorldState;
	/** @type {any} */
	let mockQuestController;

	beforeEach(() => {
		vi.clearAllMocks();
		contextMocks.clear();

		mockLogger = {
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
			debug: vi.fn(),
		};

		mockHeroState = {
			pos: new Signal.State({ x: 50, y: 15 }),
		};

		mockQuestState = {
			hasCollectedItem: new Signal.State(false),
			isRewardCollected: new Signal.State(false),
			setIsRewardCollected: (/** @type {boolean} */ val) =>
				mockQuestState.isRewardCollected.set(val),
			setHasCollectedItem: (/** @type {boolean} */ val) =>
				mockQuestState.hasCollectedItem.set(val),
		};

		mockWorldState = {
			isPaused: new Signal.State(false),
			setShowDialog: vi.fn(),
		};

		mockQuestController = {
			hasNextChapter: vi.fn(),
			isLastChapter: vi.fn(),
			currentChapter: { id: "c1" }, // Default no exit zone
			advanceChapter: vi.fn().mockResolvedValue(undefined),
		};

		host = {
			addController: vi.fn(),
			removeController: vi.fn(),
			requestUpdate: vi.fn(),
			updateComplete: Promise.resolve(true),
		};

		// Mock window.location
		window.history.replaceState({}, "", "/");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	const initController = (options = {}) => {
		controller = new GameController(host, options);

		// Manual injection via the stored callbacks from the mock ContextConsumer
		const callbacks = Array.from(contextMocks.values());
		// logger, heroState, questState, worldState, questController, questLoader
		if (callbacks[0]) callbacks[0](mockLogger);
		if (callbacks[1]) callbacks[1](mockHeroState);
		if (callbacks[2]) callbacks[2](mockQuestState);
		if (callbacks[3]) callbacks[3](mockWorldState);
		if (callbacks[4]) callbacks[4](mockQuestController);
	};

	it("should not enable debug mode by default", () => {
		initController();
		controller.hostConnected();

		expect(controller.isEnabled).toBe(false);
	});

	it("should enable debug mode when ?debug is in URL", () => {
		window.history.replaceState({}, "", "/?debug");
		initController();
		controller.hostConnected();

		expect(controller.isEnabled).toBe(true);
	});

	it("should log instructions on enable", () => {
		window.history.replaceState({}, "", "/?debug");
		initController();
		controller.hostConnected();

		expect(mockLogger.info).toHaveBeenCalledWith(
			expect.stringContaining("DEBUG MODE ENABLED"),
		);
	});

	it("should handle exit zone reached by executing questController.advanceChapter", () => {
		initController();
		controller.hostConnected();

		controller.handleExitZoneReached();

		expect(mockQuestController.advanceChapter).toHaveBeenCalled();
	});

	describe("handleLevelCompleted", () => {
		beforeEach(() => {
			initController();
			controller.hostConnected();
		});

		it("should mark item as collected and advance if NOT yet collected and no exit zone", () => {
			// Fake state: Reward NOT collected, NO exit zone (default)
			mockQuestState.setIsRewardCollected(false);
			mockQuestController.hasNextChapter.mockReturnValue(true);

			controller.handleLevelCompleted();

			expect(mockQuestState.hasCollectedItem.get()).toBe(true);
			expect(mockQuestController.advanceChapter).toHaveBeenCalled();
		});

		it("should NOT advance chapter if reward IS collected BUT there IS an exit zone", () => {
			// Fake state: Reward COLLECTED, HAS exit zone
			mockQuestState.setIsRewardCollected(true);
			mockQuestController.hasNextChapter.mockReturnValue(true);
			mockQuestController.currentChapter.exitZone = {
				x: 10,
				y: 10,
				width: 5,
				height: 5,
			};

			controller.handleLevelCompleted();

			expect(mockQuestState.hasCollectedItem.get()).toBe(true);
			expect(mockQuestController.advanceChapter).not.toHaveBeenCalled();
		});

		it("should advance chapter if reward IS collected AND there is NO exit zone", () => {
			// Fake state: Reward COLLECTED, NO exit zone
			mockQuestState.setIsRewardCollected(true);
			mockQuestController.hasNextChapter.mockReturnValue(true);
			mockQuestController.currentChapter.exitZone = null;

			controller.handleLevelCompleted();

			expect(mockQuestController.advanceChapter).toHaveBeenCalled();
		});

		it("should still advance if NO next chapter but NO exit zone (completing quest)", () => {
			// Fake state: Reward COLLECTED + NO Next Chapter + NO exit zone
			mockQuestState.setIsRewardCollected(true);
			mockQuestController.hasNextChapter.mockReturnValue(false);
			mockQuestController.currentChapter.exitZone = null;

			controller.handleLevelCompleted();

			expect(mockQuestState.hasCollectedItem.get()).toBe(true);
			expect(mockQuestController.advanceChapter).toHaveBeenCalled();
		});
	});
});
