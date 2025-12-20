import { beforeEach, describe, expect, it, vi } from "vitest";
import { CollisionController } from "./collision-controller.js";

describe("CollisionController", () => {
	/** @type {import("lit").ReactiveControllerHost} */
	let host;
	/** @type {CollisionController} */
	let controller;
	/** @type {import("vitest").Mock} */
	let onExitCollision;

	beforeEach(() => {
		host = {
			addController: vi.fn(),
			removeController: vi.fn(),
			requestUpdate: vi.fn(),
			updateComplete: Promise.resolve(true),
		};
		onExitCollision = vi.fn();

		controller = new CollisionController(host, {
			onExitCollision,
			heroSize: 2.5,
		});
	});

	it("should initialize and add controller to host", () => {
		expect(host.addController).toHaveBeenCalledWith(controller);
	});

	describe("checkAABB", () => {
		it("should detect overlapping boxes", () => {
			const box1 = { x: 10, y: 10, width: 10, height: 10 };
			const box2 = { x: 12, y: 12, width: 10, height: 10 };

			expect(controller.checkAABB(box1, box2)).toBe(true);
		});

		it("should not detect separated boxes", () => {
			const box1 = { x: 10, y: 10, width: 10, height: 10 };
			const box2 = { x: 30, y: 30, width: 10, height: 10 };

			expect(controller.checkAABB(box1, box2)).toBe(false);
		});

		it("should not detect touching boxes (strict inequality)", () => {
			// Box 1: x=5-15 (center 10, width 10)
			// Box 2: x=15-25 (center 20, width 10)
			const box1 = { x: 10, y: 10, width: 10, height: 10 };
			const box2 = { x: 20, y: 10, width: 10, height: 10 };

			expect(controller.checkAABB(box1, box2)).toBe(false);
		});
	});

	describe("checkExitZone", () => {
		const exitZone = { x: 50, y: 50, width: 10, height: 10 };

		it("should return false if item is not collected", () => {
			expect(controller.checkExitZone(50, 50, exitZone, false)).toBe(false);
			expect(onExitCollision).not.toHaveBeenCalled();
		});

		it("should return false if exitZone is null", () => {
			expect(controller.checkExitZone(50, 50, null, true)).toBe(false);
		});

		it("should detect collision when item is collected and overlapping", () => {
			// Hero at 50,50 overlaps with exit at 50,50
			const result = controller.checkExitZone(50, 50, exitZone, true);

			expect(result).toBe(true);
			expect(onExitCollision).toHaveBeenCalled();
		});

		it("should not detect collision if strictly outside", () => {
			// Hero at 70,70 is far from exit at 50,50
			const result = controller.checkExitZone(70, 70, exitZone, true);

			expect(result).toBe(false);
			expect(onExitCollision).not.toHaveBeenCalled();
		});
	});
});
