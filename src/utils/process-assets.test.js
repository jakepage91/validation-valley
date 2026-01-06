import { beforeEach, describe, expect, it, vi } from "vitest";
import { processBackgroundStyle, processImagePath } from "./process-assets.js";

// Mock asset-path module
vi.mock("./asset-path.js", () => ({
	getAssetPath: vi.fn((path) => {
		// Simple mock implementation
		const baseUrl = import.meta.env.BASE_URL || "/";
		if (!path) return path;
		if (path.startsWith(baseUrl)) return path;
		const cleanPath = path.startsWith("/") ? path.slice(1) : path;
		return `${baseUrl}${cleanPath}`;
	}),
}));

describe("Process Assets", () => {
	describe("processBackgroundStyle", () => {
		beforeEach(() => {
			// Reset BASE_URL for each test
			import.meta.env.BASE_URL = "/";
		});

		it("should return undefined for undefined input", () => {
			expect(
				processBackgroundStyle(/** @type {any} */ (undefined)),
			).toBeUndefined();
		});

		it("should return null for null input", () => {
			expect(processBackgroundStyle(/** @type {any} */ (null))).toBeNull();
		});

		it("should return empty string for empty string input", () => {
			expect(processBackgroundStyle("")).toBe("");
		});

		it("should process single quoted url", () => {
			const input = "url('/assets/image.png') center / cover no-repeat";
			const result = processBackgroundStyle(input);
			expect(result).toBe("url('/assets/image.png') center / cover no-repeat");
		});

		it("should process double quoted url", () => {
			const input = 'url("/assets/image.png") center / cover no-repeat';
			const result = processBackgroundStyle(input);
			expect(result).toBe("url('/assets/image.png') center / cover no-repeat");
		});

		it("should process unquoted url", () => {
			const input = "url(/assets/image.png) center / cover no-repeat";
			const result = processBackgroundStyle(input);
			expect(result).toBe("url('/assets/image.png') center / cover no-repeat");
		});

		it("should process multiple urls in same string", () => {
			const input = "url(/assets/bg1.png) center, url('/assets/bg2.png') top";
			const result = processBackgroundStyle(input);
			expect(result).toBe(
				"url('/assets/bg1.png') center, url('/assets/bg2.png') top",
			);
		});

		it("should handle paths with different extensions", () => {
			const input = "url(/assets/image.jpg) no-repeat";
			const result = processBackgroundStyle(input);
			expect(result).toBe("url('/assets/image.jpg') no-repeat");
		});

		it("should handle paths with subdirectories", () => {
			const input = "url(/assets/images/backgrounds/hero.png) center";
			const result = processBackgroundStyle(input);
			expect(result).toBe("url('/assets/images/backgrounds/hero.png') center");
		});

		it("should not modify non-asset urls", () => {
			const input = "url(https://example.com/image.png) center";
			const result = processBackgroundStyle(input);
			expect(result).toBe("url(https://example.com/image.png) center");
		});

		it("should handle BASE_URL with subdirectory", () => {
			import.meta.env.BASE_URL = "/app/";
			const input = "url(/assets/image.png) center";
			const result = processBackgroundStyle(input);
			expect(result).toBe("url('/app/assets/image.png') center");
		});

		it("should not double-process paths that already have BASE_URL", () => {
			import.meta.env.BASE_URL = "/app/";
			const input = "url('/app/assets/image.png') center";
			const result = processBackgroundStyle(input);
			expect(result).toBe("url('/app/assets/image.png') center");
		});

		it("should handle complex background styles", () => {
			const input =
				"linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/assets/bg.png) center / cover no-repeat fixed";
			const result = processBackgroundStyle(input);
			expect(result).toContain("url('/assets/bg.png')");
			expect(result).toContain("linear-gradient");
		});
	});

	describe("processImagePath", () => {
		it("should return undefined for undefined input", () => {
			expect(processImagePath(/** @type {any} */ (undefined))).toBeUndefined();
		});

		it("should return null for null input", () => {
			expect(processImagePath(/** @type {any} */ (null))).toBeNull();
		});

		it("should return empty string for empty string input", () => {
			expect(processImagePath("")).toBe("");
		});

		it("should process asset path", () => {
			const result = processImagePath("/assets/image.png");
			expect(result).toBe("/assets/image.png");
		});

		it("should process path without leading slash", () => {
			const result = processImagePath("assets/image.png");
			expect(result).toBe("/assets/image.png");
		});

		it("should handle paths with subdirectories", () => {
			const result = processImagePath("/assets/images/hero.png");
			expect(result).toBe("/assets/images/hero.png");
		});

		it("should handle different file extensions", () => {
			expect(processImagePath("/assets/image.jpg")).toBe("/assets/image.jpg");
			expect(processImagePath("/assets/image.svg")).toBe("/assets/image.svg");
			expect(processImagePath("/assets/image.webp")).toBe("/assets/image.webp");
		});

		it("should handle BASE_URL with subdirectory", () => {
			import.meta.env.BASE_URL = "/app/";
			const result = processImagePath("/assets/image.png");
			expect(result).toBe("/app/assets/image.png");
		});
	});
});
