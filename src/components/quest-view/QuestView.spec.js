import { ContextProvider } from "@lit/context";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { heroStateContext } from "../../game/contexts/hero-context.js";
import { questStateContext } from "../../game/contexts/quest-context.js";
import { worldStateContext } from "../../game/contexts/world-context.js";
import { logger } from "../../services/logger-service.js";
import "./quest-view.js";

/**
 * Creates mock domain services.
 */
function getMockServices() {
	return {
		heroState: {
			pos: { get: vi.fn(() => ({ x: 0, y: 0 })) },
			hotSwitchState: { get: vi.fn(() => "new") },
			isEvolving: { get: vi.fn(() => false) },
			imageSrc: { get: vi.fn(() => "hero.png") },
			setImageSrc: vi.fn(),
		},
		questState: {
			hasCollectedItem: { get: vi.fn(() => false) },
			isRewardCollected: { get: vi.fn(() => false) },
			isQuestCompleted: { get: vi.fn(() => false) },
			lockedMessage: { get: vi.fn(() => null) },
		},
		worldState: {
			isPaused: { get: vi.fn(() => false) },
			showDialog: { get: vi.fn(() => false) },
			setCurrentDialogText: vi.fn(),
		},
		aiService: {
			checkAvailability: vi.fn().mockResolvedValue("no"),
			createSession: vi.fn(),
			destroySession: vi.fn(),
			hasSession: vi.fn(() => false),
		},
		voiceSynthesisService: {
			speak: vi.fn(),
			cancel: vi.fn(),
		},
	};
}

/**
 * @param {HTMLElement} container
 * @param {any} services
 */
function setupContexts(container, services) {
	new ContextProvider(container, {
		context: heroStateContext,
		initialValue: services.heroState,
	});
	new ContextProvider(container, {
		context: questStateContext,
		initialValue: services.questState,
	});
	new ContextProvider(container, {
		context: worldStateContext,
		initialValue: services.worldState,
	});
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
		const services = getMockServices();
		const container = document.createElement("div");
		document.body.appendChild(container);
		setupContexts(container, services);

		const el = /** @type {any} */ (document.createElement("quest-view"));
		el.gameState = /** @type {any} */ ({
			config: { zones: [] },
			quest: { data: {}, chapterNumber: 1, totalChapters: 3 },
		});
		// Inject mock app for GameViewport
		el.app = {
			...services,
			questController: {
				currentChapter: {},
				getCurrentChapterNumber: vi.fn(),
				getTotalChapters: vi.fn(),
				state: services.questState,
			},
			gameState: {
				questState: services.questState,
				heroState: services.heroState,
			},
			themeService: { themeMode: { get: vi.fn(() => "light") } },
			characterContexts: { options: {} },
			questState: services.questState,
		};

		container.appendChild(el);
		await el.updateComplete;

		const viewport = el.shadowRoot?.querySelector("game-viewport");
		expect(viewport).toBeTruthy();
	});

	it("renders victory-screen when quest is completed", async () => {
		const services = getMockServices();
		services.questState.isQuestCompleted.get.mockReturnValue(true);

		const container = document.createElement("div");
		document.body.appendChild(container);
		setupContexts(container, services);

		const el = /** @type {any} */ (document.createElement("quest-view"));
		el.gameState = /** @type {any} */ ({
			config: { zones: [] },
			quest: { data: { name: "Test Quest" } },
		});

		container.appendChild(el);
		await el.updateComplete;

		const victory = el.shadowRoot?.querySelector("victory-screen");
		expect(victory).toBeTruthy();
	});

	it("renders pause-menu and reflects paused state", async () => {
		const services = getMockServices();
		services.worldState.isPaused.get.mockReturnValue(true);

		const container = document.createElement("div");
		document.body.appendChild(container);
		setupContexts(container, services);

		const el = /** @type {any} */ (document.createElement("quest-view"));
		el.gameState = /** @type {any} */ ({
			config: { zones: [] },
		});
		el.app = {
			...services,
			questController: {
				currentChapter: {},
				getCurrentChapterNumber: vi.fn(),
				getTotalChapters: vi.fn(),
				state: services.questState,
			},
			gameState: {
				questState: services.questState,
				heroState: services.heroState,
			},
			themeService: { themeMode: { get: vi.fn(() => "light") } },
			characterContexts: { options: {} },
			questState: services.questState,
		};

		container.appendChild(el);
		await el.updateComplete;

		const pauseMenu = el.shadowRoot?.querySelector("pause-menu");
		expect(pauseMenu).toBeTruthy();
		expect(pauseMenu?.open).toBe(true);
	});

	it("renders level-dialog when showDialog is true", async () => {
		await customElements.whenDefined("quest-view");
		const services = getMockServices();
		services.worldState.showDialog.get.mockReturnValue(true);

		const container = document.createElement("div");
		document.body.appendChild(container);
		setupContexts(container, services);

		const el = /** @type {any} */ (document.createElement("quest-view"));
		el.gameState = /** @type {any} */ ({
			config: { zones: [] },
			quest: { levelId: "1" },
		});
		el.app = {
			...services,
			questController: {
				currentChapter: {}, // valid chapter object to safe guard
				getCurrentChapterNumber: vi.fn(),
				getTotalChapters: vi.fn(),
				state: services.questState,
			},
			gameState: {
				questState: services.questState,
				heroState: services.heroState,
			},
			themeService: { themeMode: { get: vi.fn(() => "light") } },
			characterContexts: { options: {} },
			questState: services.questState,
		};

		container.appendChild(el);

		// Wait for stability
		await el.updateComplete;
		await new Promise((r) => setTimeout(r, 100));
		await el.updateComplete;

		expect(el.shadowRoot).toBeTruthy();
		const dialog = el.shadowRoot?.querySelector("level-dialog");
		expect(dialog).toBeTruthy();
	});
});
