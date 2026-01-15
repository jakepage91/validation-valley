import { beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "../../services/logger-service.js";

/**
 * Creates a complete mock app that satisfies the IGameContext interface.
 */
function getMockApp(overrides = {}) {
	return {
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
			lockedMessage: { get: vi.fn(() => null) },
			setCurrentDialogText: vi.fn(),
		},
		commandBus: {
			execute: vi.fn(),
		},
		eventBus: {
			on: vi.fn(),
			off: vi.fn(),
			emit: vi.fn(),
		},
		logger: {
			warn: vi.fn(),
			info: vi.fn(),
			error: vi.fn(),
		},
		aiService: {
			checkAvailability: vi.fn().mockResolvedValue("no"),
			destroySession: vi.fn(),
		},
		voiceSynthesisService: {
			speak: vi.fn(),
			cancel: vi.fn(),
		},
		...overrides,
	};
}

describe("QuestView Component (Wrapper)", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
		vi.spyOn(logger, "warn").mockImplementation(() => {});
	});

	it("renders loading state when no config is provided", async () => {
		const el = /** @type {any} */ (document.createElement("quest-view"));
		document.body.appendChild(el);
		await el.updateComplete;

		expect(el.shadowRoot?.textContent).toContain("Loading level data...");
	});

	it("renders game-viewport when config and app are provided", async () => {
		const el = /** @type {any} */ (document.createElement("quest-view"));
		el.app = getMockApp();
		el.gameState = /** @type {any} */ ({
			config: { zones: [] },
			quest: { data: {}, chapterNumber: 1, totalChapters: 3 },
		});
		document.body.appendChild(el);
		await el.updateComplete;

		const viewport = el.shadowRoot?.querySelector("game-viewport");
		expect(viewport).toBeTruthy();
	});

	it("renders victory-screen when quest is completed", async () => {
		const mockApp = getMockApp();
		mockApp.gameState.isQuestCompleted.get.mockReturnValue(true);

		const el = /** @type {any} */ (document.createElement("quest-view"));
		el.app = mockApp;
		el.gameState = /** @type {any} */ ({
			config: { zones: [] },
			quest: { data: { name: "Test Quest" } },
		});
		document.body.appendChild(el);
		await el.updateComplete;

		const victory = el.shadowRoot?.querySelector("victory-screen");
		expect(victory).toBeTruthy();
	});

	it("renders pause-menu and reflects paused state", async () => {
		const mockApp = getMockApp();
		mockApp.gameState.isPaused.get.mockReturnValue(true);

		const el = /** @type {any} */ (document.createElement("quest-view"));
		el.app = mockApp;
		el.gameState = /** @type {any} */ ({
			config: { zones: [] },
		});
		document.body.appendChild(el);
		await el.updateComplete;

		const pauseMenu = el.shadowRoot?.querySelector("pause-menu");
		expect(pauseMenu).toBeTruthy();
		expect(pauseMenu?.open).toBe(true);
	});

	it("renders level-dialog when showDialog is true", async () => {
		const mockApp = getMockApp();
		mockApp.gameState.showDialog.get.mockReturnValue(true);

		const el = /** @type {any} */ (document.createElement("quest-view"));
		el.app = mockApp;
		el.gameState = /** @type {any} */ ({
			config: { zones: [] },
			quest: { levelId: "1" },
		});
		document.body.appendChild(el);
		await el.updateComplete;

		const dialog = el.shadowRoot?.querySelector("level-dialog");
		expect(dialog).toBeTruthy();
	});
});
