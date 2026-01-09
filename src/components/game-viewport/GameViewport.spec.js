import axe from "axe-core";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "./game-viewport.js";

describe("GameViewport", () => {
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

	it("should render without crashing", async () => {
		render(html`<game-viewport></game-viewport>`, container);
		const element = /** @type {HTMLElement} */ (
			container.querySelector("game-viewport")
		);
		await /** @type {import('lit').LitElement} */ (element).updateComplete;
		expect(element).toBeTruthy();
	});

	it("should have no accessibility violations", async () => {
		// Mock minimal valid state for a11y check
		const gameState = {
			config: {
				title: "Test Level",
			},
			quest: {
				data: { name: "Test Quest" },
			},
			levelState: {},
			hero: {
				pos: { x: 50, y: 50 },
			},
		};

		render(
			html`<game-viewport .gameState="${gameState}"></game-viewport>`,
			container,
		);
		const element = /** @type {HTMLElement} */ (
			container.querySelector("game-viewport")
		);
		await /** @type {import('lit').LitElement} */ (element).updateComplete;

		const results = await axe.run(element);
		expect(results.violations).toEqual([]);
	});
});
