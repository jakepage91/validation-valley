import axe from "axe-core";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "./reward-element.js";

/** @typedef {import("./RewardElement.js").RewardElement} RewardElement */

describe("RewardElement", () => {
	/** @type {HTMLElement} */
	let container;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
	});

	afterEach(() => {
		if (container) {
			container.remove();
		}
		vi.clearAllMocks();
	});

	it("renders with basic properties", async () => {
		render(
			html`<reward-element image="test-image.png" .x=${50} .y=${50}></reward-element>`,
			container,
		);
		const element = /** @type {RewardElement} */ (
			container.querySelector("reward-element")
		);
		await element.updateComplete;

		expect(element.style.left).toBe("50%");
		expect(element.style.top).toBe("50%");
		const img = element.shadowRoot?.querySelector("img");
		expect(img).toBeTruthy();
	});

	it("should have no accessibility violations", async () => {
		render(
			html`<reward-element image="test-image.png" .x=${50} .y=${50}></reward-element>`,
			container,
		);
		const element = /** @type {RewardElement} */ (
			container.querySelector("reward-element")
		);
		await element.updateComplete;

		const results = await axe.run(element);
		expect(results.violations).toEqual([]);
	});
});
