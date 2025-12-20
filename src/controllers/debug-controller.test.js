import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DebugController } from "./debug-controller.js";

describe("DebugController", () => {
	/** @type {import("lit").ReactiveControllerHost} */
	let host;
	/** @type {DebugController} */
	let controller;
	/** @type {import("vitest").Mock} */
	let setLevel;

	beforeEach(() => {
		host = {
			addController: vi.fn(),
			removeController: vi.fn(),
			requestUpdate: vi.fn(),
			updateComplete: Promise.resolve(true),
		};
		setLevel = vi.fn();

		// Mock window.location
		// Reset URL
		window.history.replaceState({}, "", "/");

		// Clean up window.game
		delete window.game;
	});

	afterEach(() => {
		delete window.game;
		vi.restoreAllMocks();
	});

	it("should not enable debug mode by default", () => {
		controller = new DebugController(host);
		controller.hostConnected();

		expect(controller.isEnabled).toBe(false);
		expect(window.game).toBeUndefined();
	});

	it("should enable debug mode when ?debug is in URL", () => {
		window.history.replaceState({}, "", "/?debug");
		controller = new DebugController(host, { setLevel });
		controller.hostConnected();

		expect(controller.isEnabled).toBe(true);
		expect(window.game).toBeDefined();
	});

	it("should expose debug commands", () => {
		window.history.replaceState({}, "", "/?debug");
		controller = new DebugController(host, { setLevel });
		controller.hostConnected();

		window.game.setChapter("chapter-1");
		expect(setLevel).toHaveBeenCalledWith("chapter-1");
	});

	it("should cleanup on hostDisconnected", () => {
		window.history.replaceState({}, "", "/?debug");
		controller = new DebugController(host);
		controller.hostConnected();

		expect(window.game).toBeDefined();

		controller.hostDisconnected();
		expect(window.game).toBeUndefined();
	});

	it("should handle missing callbacks gracefully", () => {
		window.history.replaceState({}, "", "/?debug");
		// Initialize without options
		controller = new DebugController(host);
		controller.hostConnected();

		// Should not throw
		expect(() => window.game.setChapter("test")).not.toThrow();
		expect(() => window.game.giveItem()).not.toThrow();
	});
});
