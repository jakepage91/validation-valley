import { ContextProvider } from "@lit/context";
import { Signal } from "@lit-labs/signals";
import axe from "axe-core";
import { html, LitElement } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./level-dialog.js";
import { questControllerContext } from "../../contexts/quest-controller-context.js";
import { sessionContext } from "../../contexts/session-context.js";
import { heroStateContext } from "../../game/contexts/hero-context.js";
import { questStateContext } from "../../game/contexts/quest-context.js";
import { worldStateContext } from "../../game/contexts/world-context.js";

class TestContextWrapper extends LitElement {
	/** @override */
	static properties = {
		heroState: { type: Object },
		questState: { type: Object },
		worldState: { type: Object },
		questController: { type: Object },
		sessionService: { type: Object },
	};

	constructor() {
		super();
		this.heroState = {};
		this.questState = {};
		this.worldState = {};
		this.questController = {};
		this.sessionService = {};

		new ContextProvider(this, {
			context: heroStateContext,
			initialValue: /** @type {any} */ (this.heroState),
		});
		new ContextProvider(this, {
			context: questStateContext,
			initialValue: /** @type {any} */ (this.questState),
		});
		new ContextProvider(this, {
			context: worldStateContext,
			initialValue: /** @type {any} */ (this.worldState),
		});
		this._qcProvider = new ContextProvider(this, {
			context: questControllerContext,
			initialValue: /** @type {any} */ (this.questController),
		});
		this._sessionProvider = new ContextProvider(this, {
			context: sessionContext,
			initialValue: /** @type {any} */ (this.sessionService),
		});
	}

	/**
	 * @param {Map<PropertyKey, unknown>} changedProperties
	 * @override
	 */
	updated(changedProperties) {
		if (changedProperties.has("questController")) {
			this._qcProvider.setValue(/** @type {any} */ (this.questController));
		}
		if (changedProperties.has("sessionService")) {
			this._sessionProvider.setValue(this.sessionService);
		}
	}

	/** @override */
	render() {
		return html`<slot></slot>`;
	}
}
customElements.define("test-context-wrapper-level-dialog", TestContextWrapper);

describe("LevelDialog Component", () => {
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

	it("renders narrative slide first if description is present", async () => {
		const wrapper = new TestContextWrapper();
		wrapper.questController = {
			currentChapter: { description: "Intro Narrative" },
		};
		wrapper.questState = { isQuestCompleted: new Signal.State(false) };
		wrapper.sessionService = { currentQuest: new Signal.State({ id: "q1" }) };
		wrapper.worldState = {
			showDialog: new Signal.State(true),
			setCurrentDialogText: vi.fn(),
		};

		const element = document.createElement("level-dialog");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		expect(element.shadowRoot?.textContent).toContain("Intro Narrative");
	});

	it("renders problem slide if description is missing", async () => {
		const wrapper = new TestContextWrapper();
		wrapper.questController = {
			currentChapter: { problemDesc: "Problem Description" },
		};
		wrapper.questState = { isQuestCompleted: new Signal.State(false) };
		wrapper.sessionService = { currentQuest: new Signal.State({ id: "q1" }) };
		wrapper.worldState = {
			showDialog: new Signal.State(true),
			setCurrentDialogText: vi.fn(),
		};

		const element = document.createElement("level-dialog");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		expect(element.shadowRoot?.textContent).toContain("Problem Description");
	});

	it("should have no accessibility violations", async () => {
		const wrapper = new TestContextWrapper();
		wrapper.questController = {
			currentChapter: { description: "Intro Narrative" },
		};
		wrapper.questState = { isQuestCompleted: new Signal.State(false) };
		wrapper.sessionService = { currentQuest: new Signal.State({ id: "q1" }) };
		wrapper.worldState = {
			showDialog: new Signal.State(true),
			setCurrentDialogText: vi.fn(),
		};

		const element = document.createElement("level-dialog");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		const results = await axe.run(element);
		expect(results.violations).toEqual([]);
	});
});
