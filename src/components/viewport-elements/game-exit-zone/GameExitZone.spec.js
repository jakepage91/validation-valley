import { ContextProvider } from "@lit/context";
import { Signal } from "@lit-labs/signals";
import { html, LitElement } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./game-exit-zone.js";
import axe from "axe-core";
import { questControllerContext } from "../../../contexts/quest-controller-context.js";
import { questStateContext } from "../../../game/contexts/quest-context.js";

class TestContextWrapper extends LitElement {
	/** @override */
	static properties = {
		questController: { type: Object },
		questState: { type: Object },
	};

	constructor() {
		super();
		/** @type {any} */
		this.questController = undefined;
		/** @type {any} */
		this.questState = undefined;
		/** @type {ContextProvider<any>|undefined} */
		this.qcProvider = undefined;
		/** @type {ContextProvider<any>|undefined} */
		this.qsProvider = undefined;
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();
		this.qcProvider = new ContextProvider(this, {
			context: questControllerContext,
			initialValue: /** @type {any} */ (this.questController),
		});
		this.qsProvider = new ContextProvider(this, {
			context: questStateContext,
			initialValue: /** @type {any} */ (this.questState),
		});
	}

	/**
	 * @param {import("lit").PropertyValues<this>} changedProperties
	 * @override
	 */
	updated(changedProperties) {
		if (changedProperties.has("questController")) {
			this.qcProvider?.setValue(this.questController);
		}
		if (changedProperties.has("questState")) {
			this.qsProvider?.setValue(this.questState);
		}
	}

	/** @override */
	render() {
		return html`<slot></slot>`;
	}
}
customElements.define("test-context-wrapper-exit", TestContextWrapper);

describe("GameExitZone Component", () => {
	/** @type {HTMLElement} */
	let container;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	it("renders nothing when inactive", async () => {
		const wrapper = new TestContextWrapper();
		wrapper.questController = {
			currentChapter: { exitZone: null },
		};
		wrapper.questState = {
			hasCollectedItem: new Signal.State(false),
		};

		const element = /** @type {any} */ (
			document.createElement("game-exit-zone")
		);
		wrapper.appendChild(element);
		container.appendChild(wrapper);
		await element.updateComplete;

		expect(element.shadowRoot?.textContent?.trim()).toBe("");
	});

	it("renders exit label when active", async () => {
		const config = {
			id: "exit-1",
			x: 50,
			y: 50,
			width: 10,
			height: 10,
			description: "To Next Level",
			label: "EXIT",
		};

		const wrapper = new TestContextWrapper();
		wrapper.questController = {
			currentChapter: { exitZone: config },
		};
		wrapper.questState = {
			hasCollectedItem: new Signal.State(true),
		};

		const element = /** @type {any} */ (
			document.createElement("game-exit-zone")
		);
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		// Wait for both wrapper and element to update
		await wrapper.updateComplete;
		await element.updateComplete;

		expect(element.shadowRoot?.innerHTML).toContain("wa-tag");
		expect(element.shadowRoot?.textContent).toContain("EXIT");
	});

	it("should have no accessibility violations", async () => {
		const config = {
			id: "exit-1",
			x: 50,
			y: 50,
			width: 10,
			height: 10,
			description: "To Next Level",
			label: "EXIT",
		};

		const wrapper = new TestContextWrapper();
		wrapper.questController = {
			currentChapter: { exitZone: config },
		};
		wrapper.questState = {
			hasCollectedItem: new Signal.State(true),
		};

		const element = /** @type {any} */ (
			document.createElement("game-exit-zone")
		);
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await element.updateComplete;

		const results = await axe.run(element);
		expect(results.violations).toEqual([]);
	});
});
