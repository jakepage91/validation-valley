import axe from "axe-core";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "./level-dialog.js";

/** @typedef {import("./LevelDialog.js").LevelDialog} LevelDialog */

describe("LevelDialog Component", () => {
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

	it("renders narrative slide first if description is present", async () => {
		render(
			html`<level-dialog .config=${{ description: "Intro Narrative" }}></level-dialog>`,
			container,
		);
		const element = /** @type {LevelDialog} */ (
			container.querySelector("level-dialog")
		);
		await element.updateComplete;

		expect(element.shadowRoot?.textContent).toContain("Intro Narrative");
	});

	it("renders problem slide if description is missing", async () => {
		render(
			html`<level-dialog .config=${{ problemDesc: "Problem Description" }}></level-dialog>`,
			container,
		);
		const element = /** @type {LevelDialog} */ (
			container.querySelector("level-dialog")
		);
		await element.updateComplete;

		expect(element.shadowRoot?.textContent).toContain("Problem Description");
	});

	it("should have no accessibility violations", async () => {
		render(
			html`<level-dialog .config=${{ description: "Intro Narrative" }}></level-dialog>`,
			container,
		);
		const element = /** @type {LevelDialog} */ (
			container.querySelector("level-dialog")
		);
		await element.updateComplete;

		const results = await axe.run(element);
		expect(results.violations).toEqual([]);
	});
});
