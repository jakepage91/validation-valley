import { beforeEach, describe, expect, it, vi } from "vitest";
import "./game-view.js";

/** @typedef {import("./game-view.js").GameView} GameView */

describe("GameView Component", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
	});

	it("renders loading state when no config is provided", async () => {
		const el = /** @type {GameView} */ (document.createElement("game-view"));
		document.body.appendChild(el);
		await el.updateComplete;

		expect(el.shadowRoot.textContent).toContain("Loading level data...");
	});

	it("renders game-viewport when config is provided", async () => {
		const el = /** @type {GameView} */ (document.createElement("game-view"));
		el.gameState = {
			config: {
				canToggleTheme: true,
				hasHotSwitch: true,
				isFinalBoss: false,
			},
			hero: {
				pos: { x: 0, y: 0 },
			},
		};
		document.body.appendChild(el);
		await el.updateComplete;

		const viewport = el.shadowRoot.querySelector("game-viewport");
		expect(viewport).toBeTruthy();
	});

	describe("Keyboard Controller", () => {
		let el;
		let mockApp;

		beforeEach(async () => {
			// Create mock app
			mockApp = {
				addController: vi.fn(),
				gameState: {
					setPaused: vi.fn(),
					getState: () => ({ ui: { isPaused: false } }),
				},
				handleMove: vi.fn(),
				handleInteract: vi.fn(),
				getActiveService: vi.fn(() => null),
				profileProvider: { setValue: vi.fn() },
				suitProvider: { setValue: vi.fn() },
				gearProvider: { setValue: vi.fn() },
				powerProvider: { setValue: vi.fn() },
				masteryProvider: { setValue: vi.fn() },
				serviceController: null,
				characterContexts: null,
			};

			el = /** @type {GameView} */ (document.createElement("game-view"));
			el.app = mockApp;
			el.gameState = { ui: { isPaused: false } };
			document.body.appendChild(el);
			await el.updateComplete;
		});

		it("should initialize keyboard controller", () => {
			expect(el.keyboard).toBeDefined();
			expect(el.keyboard.options.speed).toBe(2.5);
		});

		it("should call handleMove when keyboard moves", () => {
			el.keyboard.options.onMove(1, 0);
			expect(mockApp.handleMove).toHaveBeenCalledWith(1, 0);
		});

		it("should call handleInteract when keyboard interacts", () => {
			el.keyboard.options.onInteract();
			expect(mockApp.handleInteract).toHaveBeenCalled();
		});

		it("should toggle pause when keyboard pauses", () => {
			el.keyboard.options.onPause();
			expect(mockApp.gameState.setPaused).toHaveBeenCalledWith(true);
		});
	});
});
