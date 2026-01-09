import axe from "axe-core";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "./pause-menu.js";

/** @typedef {import("./PauseMenu.js").PauseMenu} PauseMenu */

describe("PauseMenu", () => {
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

	it("renders when open", async () => {
		render(html`<pause-menu .open=${true}></pause-menu>`, container);
		const element = /** @type {PauseMenu} */ (
			container.querySelector("pause-menu")
		);
		await element.updateComplete;

		const dialog = element.shadowRoot?.querySelector("wa-dialog");
		expect(dialog?.hasAttribute("open")).toBe(true);
	});

	it("dispatches resume event on button click", async () => {
		const resumeSpy = vi.fn();
		render(
			html`<pause-menu .open=${true} @resume=${/** @type {EventListener} */ (resumeSpy)}></pause-menu>`,
			container,
		);
		const element = /** @type {PauseMenu} */ (
			container.querySelector("pause-menu")
		);
		await element.updateComplete;

		const resumeBtn = /** @type {HTMLElement} */ (
			element.shadowRoot?.querySelector("wa-button[variant='brand']")
		);
		resumeBtn.click();

		expect(resumeSpy).toHaveBeenCalled();
	});

	it("should have no accessibility violations", async () => {
		render(html`<pause-menu .open=${true}></pause-menu>`, container);
		const element = /** @type {PauseMenu} */ (
			container.querySelector("pause-menu")
		);
		await element.updateComplete;

		const results = await axe.run(element);
		expect(results.violations).toEqual([]);
	});
});
