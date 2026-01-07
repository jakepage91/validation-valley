import { beforeEach, describe, expect, it, vi } from "vitest";
import { CheckExitZoneCommand } from "./check-exit-zone-command.js";

describe("CheckExitZoneCommand", () => {
	/** @type {any} */
	let mockCollisionController;

	beforeEach(() => {
		mockCollisionController = {
			checkExitZone: vi.fn(),
		};
	});

	it("should call checkExitZone if exitZone exists", () => {
		const exitZone = { x: 90, y: 90, width: 10, height: 10 };
		const command = new CheckExitZoneCommand({
			collisionController: mockCollisionController,
			x: 95,
			y: 95,
			exitZone,
			hasCollectedItem: true,
		});

		command.execute();

		expect(mockCollisionController.checkExitZone).toHaveBeenCalledWith(
			95,
			95,
			exitZone,
			true,
		);
	});

	it("should not call checkExitZone if no exitZone", () => {
		const command = new CheckExitZoneCommand({
			collisionController: mockCollisionController,
			x: 95,
			y: 95,
			hasCollectedItem: true,
		});

		command.execute();

		expect(mockCollisionController.checkExitZone).not.toHaveBeenCalled();
	});
});
