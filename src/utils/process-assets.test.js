import { describe, expect, it, vi } from "vitest";
import { extractAssetPath, processImagePath } from "./process-assets.js";

// Mock asset-path module
vi.mock("./responsive-assets.js", () => ({
	getResponsiveUrl: vi.fn((path) => path),
	getSrcset: vi.fn(() => "mock-srcset"),
}));

describe("Process Assets", () => {
	describe("extractAssetPath", () => {
		it("should return undefined for undefined input", () => {
			expect(extractAssetPath(/** @type {any} */ (undefined))).toBeUndefined();
		});

		it("should extract path from valid url()", () => {
			expect(extractAssetPath("url('/assets/image.png')")).toBe(
				"/assets/image.png",
			);
			expect(extractAssetPath('url("/assets/image.png")')).toBe(
				"/assets/image.png",
			);
			expect(extractAssetPath("url(/assets/image.png)")).toBe(
				"/assets/image.png",
			);
		});

		it("should return undefined for invalid url()", () => {
			expect(extractAssetPath("not-a-url")).toBeUndefined();
			expect(
				extractAssetPath("url(https://external.com/img.png)"),
			).toBeUndefined();
		});
	});

	describe("processImagePath", () => {
		it("should return undefined for non-truthy input", () => {
			expect(processImagePath(/** @type {any} */ (undefined))).toBeUndefined();
			expect(processImagePath(/** @type {any} */ (null))).toBeUndefined();
			expect(processImagePath("")).toBeUndefined();
		});

		it("should process asset path using mock", () => {
			const result = processImagePath("/assets/image.png");
			expect(result).toBe("/assets/image.png");
		});

		it("should handle BASE_URL with subdirectory using mock", () => {
			import.meta.env.BASE_URL = "/app/";
			const result = processImagePath("/assets/image.png");
			expect(result).toBe("/assets/image.png"); // Mock doesn't use BASE_URL anymore
		});
	});
});
