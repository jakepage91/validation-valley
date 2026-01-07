import { beforeEach, describe, expect, it, vi } from "vitest";
import { CheckZonesCommand } from "./check-zones-command.js";

describe("CheckZonesCommand", () => {
	/** @type {any} */
	let mockZoneController;

	beforeEach(() => {
		mockZoneController = {
			checkZones: vi.fn(),
		};
	});

	it("should call checkZones on the controller", () => {
		const command = new CheckZonesCommand({
			gameZoneController: mockZoneController,
			x: 50,
			y: 50,
		});

		command.execute();

		expect(mockZoneController.checkZones).toHaveBeenCalledWith(50, 50);
	});
});
