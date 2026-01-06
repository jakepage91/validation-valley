import { beforeEach, describe, expect, it, vi } from "vitest";
import { ROUTES } from "../constants/routes.js";
import { ReturnToHubUseCase } from "./return-to-hub.js";

describe("ReturnToHubUseCase", () => {
	/** @type {ReturnToHubUseCase} */
	let useCase;
	/** @type {any} */
	let mockQuestController;
	/** @type {any} */
	let mockRouter;

	beforeEach(() => {
		mockQuestController = {
			currentQuest: { id: "test-quest" },
			returnToHub: vi.fn(),
		};

		mockRouter = {
			currentPath: "/quest/test-quest",
			navigate: vi.fn(),
		};

		useCase = new ReturnToHubUseCase({
			questController: mockQuestController,
			router: mockRouter,
		});
	});

	it("should return to hub successfully", () => {
		const result = useCase.execute();

		expect(result.success).toBe(true);
		expect(mockQuestController.returnToHub).toHaveBeenCalled();
		expect(mockRouter.navigate).toHaveBeenCalledWith(ROUTES.HUB, false);
	});

	it("should call returnToHub on quest controller", () => {
		useCase.execute();

		expect(mockQuestController.returnToHub).toHaveBeenCalled();
	});

	it("should navigate to hub route", () => {
		useCase.execute();

		expect(mockRouter.navigate).toHaveBeenCalledWith(ROUTES.HUB, false);
	});

	it("should use replace when specified", () => {
		useCase.execute(true);

		expect(mockRouter.navigate).toHaveBeenCalledWith(ROUTES.HUB, true);
	});

	it("should not navigate if already at hub", () => {
		mockRouter.currentPath = ROUTES.HUB;

		useCase.execute();

		expect(mockRouter.navigate).not.toHaveBeenCalled();
	});

	it("should not call returnToHub if no current quest", () => {
		mockQuestController.currentQuest = null;

		useCase.execute();

		expect(mockQuestController.returnToHub).not.toHaveBeenCalled();
	});

	it("should handle missing quest controller gracefully", () => {
		useCase = new ReturnToHubUseCase({
			// @ts-expect-error - Testing with null questController
			questController: null,
			router: mockRouter,
		});

		const result = useCase.execute();

		expect(result.success).toBe(true);
		expect(mockRouter.navigate).toHaveBeenCalled();
	});

	it("should handle missing router gracefully", () => {
		useCase = new ReturnToHubUseCase({
			questController: mockQuestController,
			// @ts-expect-error - Testing with null router
			router: null,
		});

		const result = useCase.execute();

		expect(result.success).toBe(true);
		expect(mockQuestController.returnToHub).toHaveBeenCalled();
	});
});
