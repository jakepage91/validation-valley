import { ContextProvider } from "@lit/context";
import { Signal } from "@lit-labs/signals";
import axe from "axe-core";
import { html, LitElement } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./victory-screen.js";
import { questLoaderContext } from "../../contexts/quest-loader-context.js";
import { sessionContext } from "../../contexts/session-context.js";

class TestContextWrapper extends LitElement {
	/** @override */
	static properties = {
		sessionService: { type: Object },
		questLoader: { type: Object },
	};

	constructor() {
		super();
		/** @type {any} */
		this.sessionService = undefined;
		/** @type {any} */
		this.questLoader = undefined;
		/** @type {ContextProvider<any>|undefined} */
		this.sessionProvider = undefined;
		/** @type {ContextProvider<any>|undefined} */
		this.qlProvider = undefined;
	}

	/** @override */
	connectedCallback() {
		super.connectedCallback();
		this.sessionProvider = new ContextProvider(this, {
			context: sessionContext,
			initialValue: /** @type {any} */ (this.sessionService),
		});
		this.qlProvider = new ContextProvider(this, {
			context: questLoaderContext,
			initialValue: /** @type {any} */ (this.questLoader),
		});
	}

	/**
	 * @param {import("lit").PropertyValues} changedProperties
	 * @override
	 */
	updated(changedProperties) {
		if (changedProperties.has("sessionService")) {
			this.sessionProvider?.setValue(this.sessionService);
		}
		if (changedProperties.has("questLoader")) {
			this.qlProvider?.setValue(this.questLoader);
		}
	}

	/** @override */
	render() {
		return html`<slot></slot>`;
	}
}
customElements.define("test-context-wrapper-victory", TestContextWrapper);

describe("VictoryScreen", () => {
	/** @type {HTMLElement} */
	let container;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
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

		const wrapper = new TestContextWrapper();
		wrapper.sessionService = {
			currentQuest: new Signal.State(questData),
		};
		wrapper.questLoader = {
			returnToHub: () => {},
		};

		const element = document.createElement("victory-screen");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		expect(element.shadowRoot?.textContent).toContain("Epic Quest");
		expect(element.shadowRoot?.textContent).toContain("Hero Badge");
		expect(element.shadowRoot?.textContent).toContain("Super Jump");
		expect(element.shadowRoot?.textContent).toContain("Gold");
	});

	it("calls onReturn when button is clicked", async () => {
		// Mock returnToHub
		let returnCalled = false;

		const questData = { name: "Quest" };

		const wrapper = new TestContextWrapper();
		wrapper.sessionService = {
			currentQuest: new Signal.State(questData),
		};
		wrapper.questLoader = {
			returnToHub: () => {
				returnCalled = true;
			},
		};

		const element = document.createElement("victory-screen");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		const btn = /** @type {HTMLElement} */ (
			element.shadowRoot?.querySelector("wa-button")
		);
		btn.click();

		expect(returnCalled).toBe(true);
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

		const wrapper = new TestContextWrapper();
		wrapper.sessionService = {
			currentQuest: new Signal.State(questData),
		};
		wrapper.questLoader = {
			returnToHub: () => {},
		};

		const element = document.createElement("victory-screen");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		const results = await axe.run(element);
		expect(results.violations).toEqual([]);
	});
});
