import axe from "axe-core";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GameEvents } from "../../core/event-bus.js";
import { logger } from "../../services/logger-service.js";

import "./game-viewport.js";

/**
 * Creates a complete mock app that satisfies the IGameContext interface.
 */
function getMockApp(overrides = {}) {
	const heroState = {
		pos: { get: vi.fn(() => ({ x: 0, y: 0 })), set: vi.fn() },
		isEvolving: { get: vi.fn(() => false) },
		hotSwitchState: { get: vi.fn(() => "new") },
		imageSrc: { get: vi.fn(() => "hero.png"), set: vi.fn() },
		setPos: vi.fn(),
		setImageSrc: vi.fn(),
	};

	const questState = {
		hasCollectedItem: { get: vi.fn(() => false), set: vi.fn() },
		isRewardCollected: { get: vi.fn(() => false), set: vi.fn() },
		isQuestCompleted: { get: vi.fn(() => false) },
		lockedMessage: { get: vi.fn(() => null) },
	};

	const worldState = {
		isPaused: {
			get: vi.fn(() => false),
			set: vi.fn(),
			subscribe: vi.fn(() => () => {}),
		},
		showDialog: { get: vi.fn(() => false) },
		currentDialogText: { get: vi.fn(() => "") },
	};

	return {
		addController: vi.fn(),
		getChapterData: vi.fn(),
		// Domain Services
		heroState,
		questState,
		worldState,

		gameState: {
			setPaused: vi.fn(),
			isPaused: { get: vi.fn(() => false) },
			isQuestCompleted: { get: vi.fn(() => false) },
			showDialog: { get: vi.fn(() => false) },
			heroPos: { get: vi.fn(() => ({ x: 0, y: 0 })) },
			isEvolving: { get: vi.fn(() => false) },
			hotSwitchState: { get: vi.fn(() => "new") },
			hasCollectedItem: { get: vi.fn(() => false) },
			isRewardCollected: { get: vi.fn(() => false) },
			themeMode: { get: vi.fn(() => "light") },
			lockedMessage: { get: vi.fn(() => null) },
			getState: vi.fn(() => ({
				ui: { isPaused: false },
				heroPos: { x: 0, y: 0 },
				hasCollectedItem: false,
				themeMode: "light",
				hotSwitchState: "new",
				isQuestCompleted: false,
				showDialog: false,
			})),
			setHeroPosition: vi.fn(),
			setCurrentDialogText: vi.fn(),
			setShowDialog: vi.fn(),
			setCollectedItem: vi.fn(),
		},
		handleMove: vi.fn(),
		handleInteract: vi.fn(),
		getActiveService: vi.fn(() => null),
		profileProvider: { setValue: vi.fn() },
		suitProvider: { setValue: vi.fn() },
		gearProvider: { setValue: vi.fn() },
		powerProvider: { setValue: vi.fn() },
		masteryProvider: { setValue: vi.fn() },
		serviceController: { loadUserData: vi.fn(), options: {} },
		characterContexts: { options: {} },
		interaction: {
			isCloseToNpc: vi.fn(),
			interact: vi.fn(),
			handleInteract: vi.fn(),
		},
		gameService: {
			setLevel: vi.fn(),
			giveItem: vi.fn(),
			teleport: vi.fn(),
			getState: vi.fn(),
			setTheme: vi.fn(),
			startQuest: vi.fn(),
			completeQuest: vi.fn(),
			returnToHub: vi.fn(),
			listQuests: vi.fn(() => []),
			getProgress: vi.fn(),
			resetProgress: vi.fn(),
		},
		questController: {
			currentChapter: { exitZone: { x: 10, y: 10 } },
			hasExitZone: vi.fn(() => true),
			getCurrentChapterNumber: vi.fn(() => 1),
			getTotalChapters: vi.fn(() => 3),
			isLastChapter: vi.fn(() => false),
			hasNextChapter: vi.fn(() => true),
			state: questState, // LINKED HERE
		},
		eventBus: (() => {
			const handlers = new Map();
			return {
				on: vi.fn((event, handler) => {
					if (!handlers.has(event)) {
						handlers.set(event, []);
					}
					handlers.get(event).push(handler);
				}),
				off: vi.fn((event, handler) => {
					if (handlers.has(event)) {
						const eventHandlers = handlers.get(event);
						const index = eventHandlers.indexOf(handler);
						if (index > -1) {
							eventHandlers.splice(index, 1);
						}
					}
				}),
				emit: vi.fn((event, data) => {
					if (handlers.has(event)) {
						for (const handler of handlers.get(event)) {
							handler(data);
						}
					}
				}),
			};
		})(),
		commandBus: {
			execute: vi.fn(),
		},
		sessionManager: {
			getGameState: vi.fn(() => ({
				isLoading: false,
				isInHub: false,
			})),
		},
		aiService: {
			checkAvailability: vi.fn().mockResolvedValue("no"),
			createSession: vi.fn(),
			getSession: vi.fn(),
			destroySession: vi.fn(),
		},
		voiceSynthesisService: {
			speak: vi.fn(),
			cancel: vi.fn(),
		},
		...overrides,
	};
}

describe("GameViewport", () => {
	/** @type {HTMLElement} */
	let container;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
		vi.spyOn(logger, "warn").mockImplementation(() => {});
	});

	afterEach(() => {
		if (container) {
			container.remove();
		}
		vi.clearAllMocks();
	});

	it("should render without crashing", async () => {
		render(html`<game-viewport></game-viewport>`, container);
		const element = /** @type {HTMLElement} */ (
			container.querySelector("game-viewport")
		);
		await /** @type {import('lit').LitElement} */ (element).updateComplete;
		expect(element).toBeTruthy();
	});

	it("should have no accessibility violations", async () => {
		// Mock minimal valid state for a11y check
		const gameState = {
			config: {
				title: "Test Level",
			},
			quest: {
				data: { name: "Test Quest" },
			},
			levelState: {},
			hero: {
				pos: { x: 50, y: 50 },
			},
		};

		const mockApp = getMockApp();

		render(
			html`<game-viewport .gameState="${gameState}" .app="${mockApp}"></game-viewport>`,
			container,
		);
		const element = /** @type {HTMLElement} */ (
			container.querySelector("game-viewport")
		);
		await /** @type {import('lit').LitElement} */ (element).updateComplete;

		const results = await axe.run(element);
		expect(results.violations).toEqual([]);
	});

	describe("Engine Controllers", () => {
		/** @type {any} */
		let el;
		/** @type {any} */
		let mockApp;

		beforeEach(async () => {
			mockApp = getMockApp();
			render(
				html`<game-viewport .app="${mockApp}"></game-viewport>`,
				container,
			);
			el = container.querySelector("game-viewport");
			el.gameState = {
				ui: {
					isPaused: false,
					showDialog: false,
					isQuestCompleted: false,
					lockedMessage: "",
				},
				hero: { pos: { x: 0, y: 0 }, isEvolving: false, hotSwitchState: null },
				config: { zones: [] },
				quest: {
					data: {},
					chapterNumber: 0,
					totalChapters: 0,
					isLastChapter: false,
					levelId: "",
				},
				levelState: {
					hasCollectedItem: false,
					isRewardCollected: false,
					isCloseToTarget: false,
				},
			};
			await el.updateComplete;
		});

		it("should initialize keyboard controller", () => {
			expect(el.keyboard).toBeDefined();
			expect(el.keyboard?.options.speed).toBe(2.5);
		});

		it("should handle HERO_MOVE_INPUT event", () => {
			// Mock handleMove method on the element instance or ensure controller logic works
			const handleMoveSpy = vi.spyOn(el, "handleMove");

			// Emit event through event bus
			mockApp.eventBus.emit(GameEvents.HERO_MOVE_INPUT, { dx: 1, dy: 0 });

			// With new architecture, GameViewport delegates event handling.
			expect(handleMoveSpy).toHaveBeenCalledWith(1, 0);
		});

		it("should subscribe to HERO_MOVE_INPUT with app provided", async () => {
			// Verify subscription happened during update
			expect(mockApp.eventBus.on).toHaveBeenCalledWith(
				GameEvents.HERO_MOVE_INPUT,
				expect.any(Function),
			);
		});

		it("should unsubscribe from events on disconnect", async () => {
			// Verify subscription happened
			expect(mockApp.eventBus.on).toHaveBeenCalled();

			// Disconnect element
			el.remove();

			// Verify unsubscription happened
			expect(mockApp.eventBus.off).toHaveBeenCalledWith(
				GameEvents.HERO_MOVE_INPUT,
				expect.any(Function),
			);
		});
	});
});
