import { TaskStatus } from "@lit/task";
import { Signal } from "@lit-labs/signals";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HotSwitchStates } from "../core/constants.js";
import { ServiceType } from "../services/user-api-client.js";
import { ServiceController } from "./service-controller.js";

// Mock @lit/context to handle dependency injection in tests
const contextMocks = new Map();
vi.mock("@lit/context", () => {
	class MockContextConsumer {
		/**
		 * @param {any} host
		 * @param {any} options
		 */
		constructor(host, options) {
			this.host = host;
			this.options = options;
			// Store callback to trigger it manually
			contextMocks.set(options.context, options.callback);
		}
	}
	return {
		ContextConsumer: MockContextConsumer,
		createContext: vi.fn((key) => key),
	};
});

describe("ServiceController", () => {
	/** @type {any} */
	let host;
	/** @type {ServiceController} */
	let controller;

	// Mock services
	/** @type {any} */
	let legacyService;
	/** @type {any} */
	let mockService;
	/** @type {any} */
	let newService;
	/** @type {any} */
	let profileProvider;

	// Mock context states
	/** @type {any} */
	let mockHeroState;
	/** @type {any} */
	let mockQuestController;
	/** @type {any} */
	let mockApiClients;

	beforeEach(() => {
		vi.clearAllMocks();
		contextMocks.clear();

		// Mock services
		legacyService = {
			fetchUserData: vi.fn().mockResolvedValue({
				id: 1,
				name: "Legacy User",
				role: "developer",
			}),
			getServiceName: vi.fn().mockReturnValue("legacy"),
		};

		mockService = {
			fetchUserData: vi.fn().mockResolvedValue({
				id: 2,
				name: "Mock User",
				role: "tester",
			}),
			getServiceName: vi.fn().mockReturnValue("mock"),
		};

		newService = {
			fetchUserData: vi.fn().mockResolvedValue({
				id: 3,
				name: "New User",
				role: "admin",
			}),
			getServiceName: vi.fn().mockReturnValue("new"),
		};

		profileProvider = {
			setValue: vi.fn(),
		};

		mockHeroState = {
			hotSwitchState: new Signal.State(HotSwitchStates.LEGACY),
		};

		mockQuestController = {
			currentChapter: { serviceType: ServiceType.LEGACY },
		};

		mockApiClients = {
			legacy: legacyService,
			mock: mockService,
			new: newService,
		};

		host = {
			addController: vi.fn(),
			removeController: vi.fn(),
			requestUpdate: vi.fn(),
			updateComplete: Promise.resolve(true),
		};
	});

	const initController = (options = {}) => {
		controller = new ServiceController(host, options);

		// Manual injection via the stored callbacks from the mock ContextConsumer
		const callbacks = Array.from(contextMocks.values());
		// heroState, questController, apiClients
		if (callbacks[0]) callbacks[0](mockHeroState);
		if (callbacks[1]) callbacks[1](mockQuestController);
		if (callbacks[2]) callbacks[2](mockApiClients);
	};

	it("should initialize correctly", () => {
		initController();
		expect(host.addController).toHaveBeenCalledWith(controller);
		expect(controller.userTask).toBeDefined();
		expect(controller.userTask.status).toBe(TaskStatus.INITIAL);
	});

	describe("getActiveService", () => {
		beforeEach(() => {
			initController();
		});

		it("should return legacy service for 'legacy' type", () => {
			const service = controller.getActiveService(ServiceType.LEGACY, null);
			expect(service).toBe(legacyService);
		});

		it("should return mock service for 'mock' type", () => {
			const service = controller.getActiveService(ServiceType.MOCK, null);
			expect(service).toBe(mockService);
		});

		it("should return legacy service for 'new' type with 'legacy' hotSwitch", () => {
			const service = controller.getActiveService(
				ServiceType.NEW,
				HotSwitchStates.LEGACY,
			);
			expect(service).toBe(legacyService);
		});

		it("should return new service for 'new' type with 'new' hotSwitch", () => {
			const service = controller.getActiveService(
				ServiceType.NEW,
				HotSwitchStates.NEW,
			);
			expect(service).toBe(newService);
		});

		it("should return null for 'new' type in neutral zone", () => {
			const service = controller.getActiveService(ServiceType.NEW, null);
			expect(service).toBeNull();
		});
	});

	describe("Task Execution", () => {
		it("should fetch user data when service is active", async () => {
			initController({ profileProvider });

			// Trigger task update logic
			await controller.userTask.run();

			expect(legacyService.fetchUserData).toHaveBeenCalledWith(1);
			expect(controller.userTask.status).toBe(TaskStatus.COMPLETE);
			expect(controller.userTask.value).toEqual({
				id: 1,
				name: "Legacy User",
				role: "developer",
			});
		});

		it("should update profile context on hostUpdate", async () => {
			initController({ profileProvider });
			await controller.userTask.run();

			controller.hostUpdate();

			expect(profileProvider.setValue).toHaveBeenCalledWith(
				expect.objectContaining({
					name: "Legacy User",
					role: "developer",
					loading: false,
					error: null,
					serviceName: "legacy",
				}),
			);
		});

		it("should handle errors", async () => {
			legacyService.fetchUserData.mockRejectedValue(new Error("Network error"));
			initController({ profileProvider });

			try {
				await controller.userTask.run();
			} catch (_e) {
				// Task run might reject
			}

			controller.hostUpdate();

			expect(controller.userTask.status).toBe(TaskStatus.ERROR);
			expect(profileProvider.setValue).toHaveBeenCalledWith(
				expect.objectContaining({
					error: "Error: Network error",
					loading: false,
				}),
			);
		});
	});

	describe("updateProfileContext", () => {
		it("should update profile context with pending state", async () => {
			initController({ profileProvider });

			expect(controller.userTask.status).toBe(TaskStatus.INITIAL);
			controller.hostUpdate();

			expect(profileProvider.setValue).toHaveBeenCalledWith(
				expect.objectContaining({
					loading: true,
					error: null,
				}),
			);
		});
	});
});
