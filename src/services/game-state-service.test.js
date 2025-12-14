import { beforeEach, describe, expect, it, vi } from "vitest";
import { GameStateService } from "./game-state-service.js";

describe("GameStateService", () => {
	let service;

	beforeEach(() => {
		service = new GameStateService();
	});

	it("should initialize with default state", () => {
		const state = service.getState();
		expect(state.heroPos).toBeDefined();
		expect(state.hasCollectedItem).toBe(false);
		expect(state.isPaused).toBe(false);
		expect(state.themeMode).toBe("light");
	});

	it("should return a copy of the state", () => {
		const state1 = service.getState();
		const state2 = service.getState();

		expect(state1).not.toBe(state2); // Different objects
		expect(state1).toEqual(state2); // Same content
	});

	it("should update state with setState", () => {
		service.setState({ hasCollectedItem: true });

		const state = service.getState();
		expect(state.hasCollectedItem).toBe(true);
		// Other properties should remain unchanged
		expect(state.isPaused).toBe(false);
	});

	it("should notify listeners on state change", () => {
		const listener = vi.fn();
		service.subscribe(listener);

		service.setState({ isPaused: true });

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith(
			expect.objectContaining({ isPaused: true }), // New state
			expect.objectContaining({ isPaused: false }), // Old state
		);
	});

	it("should unsubscribe listener", () => {
		const listener = vi.fn();
		const unsubscribe = service.subscribe(listener);

		service.setState({ isPaused: true });
		expect(listener).toHaveBeenCalledTimes(1);

		unsubscribe();

		service.setState({ isPaused: false });
		expect(listener).toHaveBeenCalledTimes(1); // Should not be called again
	});

	it("should handle multiple listeners", () => {
		const listenerA = vi.fn();
		const listenerB = vi.fn();

		service.subscribe(listenerA);
		service.subscribe(listenerB);

		service.setState({ themeMode: "dark" });

		expect(listenerA).toHaveBeenCalled();
		expect(listenerB).toHaveBeenCalled();
	});
});
