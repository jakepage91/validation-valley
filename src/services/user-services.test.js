import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	LegacyUserService,
	MockUserService,
	NewUserService,
	ServiceType,
} from "./user-services.js";

describe("UserServices", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("LegacyUserService", () => {
		it("should return LEGACY service name", () => {
			const service = new LegacyUserService();
			expect(service.getServiceName()).toBe(ServiceType.LEGACY);
		});

		it("should fetch user data after delay", async () => {
			const service = new LegacyUserService();
			const promise = service.fetchUserData(123);

			vi.advanceTimersByTime(500);

			const data = await promise;
			expect(data).toEqual({
				id: 123,
				name: "Alarion",
				role: "Monolith Dweller",
				hp: 50,
				avatarColor: "#ef4444",
			});
		});
	});

	describe("MockUserService", () => {
		it("should return MOCK service name", () => {
			const service = new MockUserService();
			expect(service.getServiceName()).toBe(ServiceType.MOCK);
		});

		it("should fetch user data after delay", async () => {
			const service = new MockUserService();
			const promise = service.fetchUserData(456);

			vi.advanceTimersByTime(500);

			const data = await promise;
			expect(data).toEqual({
				id: 456,
				name: "Test Dummy",
				role: "QA Subject",
				hp: 9999,
				avatarColor: "#eab308",
			});
		});
	});

	describe("NewUserService", () => {
		it("should return NEW service name", () => {
			const service = new NewUserService();
			expect(service.getServiceName()).toBe(ServiceType.NEW);
		});

		it("should fetch user data after delay", async () => {
			const service = new NewUserService();
			const promise = service.fetchUserData(789);

			vi.advanceTimersByTime(500);

			const data = await promise;
			expect(data).toEqual({
				id: 789,
				name: "Alarion",
				role: "System Walker",
				hp: 100,
				avatarColor: "#22c55e",
			});
		});
	});
});
