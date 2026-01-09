import axe from "axe-core";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "./victory-screen.js";

/** @typedef {import("./VictoryScreen.js").VictoryScreen} VictoryScreen */

describe("VictoryScreen", () => {
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

	it("renders quest data correctly", async () => {
		const questData = {
			name: "Epic Quest",
			color: "blue",
			reward: {
				badge: "Hero Badge",
				ability: "Super Jump",
			},
			chapters: {
				c1: { reward: { name: "Gold", image: "gold.png" } },
			},
			chapterIds: ["c1"],
		};

		render(
			html`<victory-screen .quest=${questData}></victory-screen>`,
			container,
		);
		const element = /** @type {VictoryScreen} */ (
			container.querySelector("victory-screen")
		);
		await element.updateComplete;

		expect(element.shadowRoot?.textContent).toContain("Epic Quest");
		expect(element.shadowRoot?.textContent).toContain("Hero Badge");
		expect(element.shadowRoot?.textContent).toContain("Super Jump");
		expect(element.shadowRoot?.textContent).toContain("Gold");
	});

	it("calls onReturn when button is clicked", async () => {
		const onReturnSpy = vi.fn();
		const questData = { name: "Quest" };

		render(
			html`<victory-screen .quest=${questData} .onReturn=${onReturnSpy}></victory-screen>`,
			container,
		);
		const element = /** @type {VictoryScreen} */ (
			container.querySelector("victory-screen")
		);
		await element.updateComplete;

		const btn = /** @type {HTMLElement} */ (
			element.shadowRoot?.querySelector("wa-button")
		);
		btn.click();

		expect(onReturnSpy).toHaveBeenCalled();
	});

	it("should have no accessibility violations", async () => {
		const questData = {
			name: "Epic Quest",
			color: "blue",
			reward: {
				badge: "Hero Badge",
				ability: "Super Jump",
			},
			chapters: {},
			chapterIds: [],
		};

		render(
			html`<victory-screen .quest=${questData}></victory-screen>`,
			container,
		);
		const element = /** @type {VictoryScreen} */ (
			container.querySelector("victory-screen")
		);
		await element.updateComplete;

		const results = await axe.run(element);
		expect(results.violations).toEqual([]);
	});
});
