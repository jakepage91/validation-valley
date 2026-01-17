import { ContextProvider } from "@lit/context";
import { Signal } from "@lit-labs/signals";
import axe from "axe-core";
import { html, LitElement } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./pause-menu.js";
import { questLoaderContext } from "../../contexts/quest-loader-context.js";
import { sessionContext } from "../../contexts/session-context.js";
import { worldStateContext } from "../../game/contexts/world-context.js";

class TestContextWrapper extends LitElement {
	static properties = {
		worldState: { type: Object },
		questLoader: { type: Object },
		sessionService: { type: Object },
	};

	constructor() {
		super();
		/** @type {any} */
		this.worldState = undefined;
		/** @type {any} */
		this.questLoader = undefined;
		/** @type {any} */
		this.sessionService = undefined;

		this.wsProvider = new ContextProvider(this, {
			context: worldStateContext,
			initialValue: /** @type {any} */ (this.worldState),
		});
		this.qlProvider = new ContextProvider(this, {
			context: questLoaderContext,
			initialValue: /** @type {any} */ (this.questLoader),
		});
		this.sessionProvider = new ContextProvider(this, {
			context: sessionContext,
			initialValue: /** @type {any} */ (this.sessionService),
		});
	}

	connectedCallback() {
		super.connectedCallback();
	}

	/**
	 * @param {import("lit").PropertyValues} changedProperties
	 */
	updated(changedProperties) {
		if (changedProperties.has("worldState")) {
			this.wsProvider.setValue(this.worldState);
		}
		if (changedProperties.has("questLoader")) {
			this.qlProvider.setValue(this.questLoader);
		}
		if (changedProperties.has("sessionService")) {
			this.sessionProvider.setValue(this.sessionService);
		}
	}

	render() {
		return html`<slot></slot>`;
	}
}
customElements.define("test-context-wrapper-pause", TestContextWrapper);

describe("PauseMenu", () => {
	/** @type {HTMLElement} */
	let container;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
		vi.clearAllMocks();
	});

	it("renders when open (via worldState)", async () => {
		const wrapper = new TestContextWrapper();
		wrapper.worldState = {
			isPaused: new Signal.State(true),
			setPaused: vi.fn(),
		};
		wrapper.questLoader = {};
		wrapper.sessionService = {};

		const element = document.createElement("pause-menu");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		const dialog = element.shadowRoot?.querySelector("wa-dialog");
		expect(dialog?.hasAttribute("open")).toBe(true);
	});

	it("calls setPaused(false) on resume button click", async () => {
		const setPausedSpy = vi.fn();
		const wrapper = new TestContextWrapper();
		wrapper.worldState = {
			isPaused: new Signal.State(true),
			setPaused: setPausedSpy,
		};
		wrapper.questLoader = {};
		wrapper.sessionService = {};

		const element = document.createElement("pause-menu");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		const resumeBtn = /** @type {HTMLElement} */ (
			element.shadowRoot?.querySelector("wa-button[variant='brand']")
		);
		resumeBtn.click();

		expect(setPausedSpy).toHaveBeenCalledWith(false);
	});

	it("calls returnToHub on quit button click", async () => {
		const returnToHubSpy = vi.fn();
		const setPausedSpy = vi.fn();

		const wrapper = new TestContextWrapper();
		wrapper.worldState = {
			isPaused: new Signal.State(true),
			setPaused: setPausedSpy,
		};
		wrapper.questLoader = {
			returnToHub: returnToHubSpy,
		};
		wrapper.sessionService = {};

		const element = document.createElement("pause-menu");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		const quitBtn = /** @type {HTMLElement} */ (
			element.shadowRoot?.querySelector("wa-button[variant='danger']")
		);
		quitBtn.click();

		expect(setPausedSpy).toHaveBeenCalledWith(false);
		expect(returnToHubSpy).toHaveBeenCalled();
	});

	it("should have no accessibility violations", async () => {
		const wrapper = new TestContextWrapper();
		wrapper.worldState = {
			isPaused: new Signal.State(true),
			setPaused: vi.fn(),
		};
		wrapper.questLoader = {};
		wrapper.sessionService = {};

		const element = document.createElement("pause-menu");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		const results = await axe.run(element);
		expect(results.violations).toEqual([]);
	});
});
