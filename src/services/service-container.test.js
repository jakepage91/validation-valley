import { beforeEach, describe, expect, it } from "vitest";
import { ServiceContainer } from "./service-container.js";

describe("ServiceContainer", () => {
	let container;

	beforeEach(() => {
		container = new ServiceContainer();
	});

	it("should register and retrieve services", () => {
		const mockService = { id: 1 };
		container.register("mock", mockService);

		const retrieved = container.get("mock");
		expect(retrieved).toBe(mockService);
	});

	it("should throw when retrieving unknown service", () => {
		expect(() => container.get("unknown")).toThrow();
	});

	it("should clear services", () => {
		container.register("test", {});
		container.clear();
		expect(() => container.get("test")).toThrow();
	});

	it("should handle symbol keys", () => {
		const key = Symbol("service");
		const service = {};
		container.register(key, service);
		expect(container.get(key)).toBe(service);
	});
});
