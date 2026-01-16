import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GameEvents } from "../core/event-bus.js";
import { KeyboardController } from "./keyboard-controller.js";

describe("KeyboardController", () => {
	/** @type {any} */
	let host;
	/** @type {any} */
	let context;
	/** @type {KeyboardController} */
	let controller;
	/** @type {Record<string, Function>} */
	let eventMap = {};

	beforeEach(() => {
		// Mock host
		host = {
			addController: vi.fn(),
			requestUpdate: vi.fn(),
			interaction: {
				handleInteract: vi.fn(),
			},
		};

		// Mock context
		context = {
			eventBus: {
				emit: vi.fn(),
			},
			interaction: {
				handleInteract: vi.fn(),
			},
			gameState: {},
			worldState: {
				isPaused: { get: () => false },
				setPaused: vi.fn(),
			},
		};

		// Mock window event listeners
		window.addEventListener = vi.fn((event, callback) => {
			eventMap[event] = callback;
		});
		window.removeEventListener = vi.fn((event) => {
			delete eventMap[event];
		});

		// Initialize controller
		// Passing context as 2nd argument (matching implementation)
		controller = new KeyboardController(host, { ...context });
		controller.hostConnected();
	});

	afterEach(() => {
		controller.hostDisconnected();
		eventMap = {};
		vi.clearAllMocks();
	});

	it("should register keydown listener on connection", () => {
		expect(window.addEventListener).toHaveBeenCalledWith(
			"keydown",
			expect.any(Function),
		);
	});

	it("should emit HERO_MOVE_INPUT for arrow keys", () => {
		const event = { key: "ArrowUp", preventDefault: vi.fn() };
		eventMap.keydown(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(context.eventBus.emit).toHaveBeenCalledWith(
			GameEvents.HERO_MOVE_INPUT,
			{
				dx: 0,
				dy: -2.5,
			},
		);
	});

	it("should emit HERO_MOVE_INPUT for WASD keys", () => {
		const event = { key: "d", preventDefault: vi.fn() };
		eventMap.keydown(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(context.eventBus.emit).toHaveBeenCalledWith(
			GameEvents.HERO_MOVE_INPUT,
			{
				dx: 2.5,
				dy: 0,
			},
		);
	});

	it("should call interaction.handleInteract() on Space", () => {
		const event = { code: "Space", preventDefault: vi.fn() };
		eventMap.keydown(event);

		expect(event.preventDefault).toHaveBeenCalled();
		// It checks host.interaction first, then option.interaction
		// host.interaction is set in beforeEach
		expect(host.interaction.handleInteract).toHaveBeenCalled();
	});

	it("should call worldState.setPaused() on Escape", () => {
		const event = { code: "Escape", preventDefault: vi.fn() };
		eventMap.keydown(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(context.worldState.setPaused).toHaveBeenCalledWith(true);
	});

	it("should use custom speed from options", () => {
		const customController = new KeyboardController(host, {
			...context,
			speed: 5.0,
		});
		customController.hostConnected();

		// WASD 'd' (Right)
		const event = { key: "d", preventDefault: vi.fn() };
		eventMap.keydown(event);

		expect(context.eventBus.emit).toHaveBeenCalledWith(
			GameEvents.HERO_MOVE_INPUT,
			{
				dx: 5.0,
				dy: 0,
			},
		);
	});

	it("should remove event listener on disconnect", () => {
		controller.hostDisconnected();
		expect(window.removeEventListener).toHaveBeenCalledWith(
			"keydown",
			expect.any(Function),
		);
	});
});
