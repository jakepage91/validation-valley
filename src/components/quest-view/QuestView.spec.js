import { ContextProvider } from "@lit/context";
import { Signal } from "@lit-labs/signals";
import { html, LitElement } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { questLoaderContext } from "../../contexts/quest-loader-context.js";
import { sessionContext } from "../../contexts/session-context.js";
import { heroStateContext } from "../../game/contexts/hero-context.js";
import { questStateContext } from "../../game/contexts/quest-context.js";
import { worldStateContext } from "../../game/contexts/world-context.js";
import { logger } from "../../services/logger-service.js";
import "./quest-view.js";

// Mock child components
vi.mock("../game-viewport/game-viewport.js", () => ({}));
vi.mock("../level-dialog/level-dialog.js", () => ({}));
vi.mock("../pause-menu/pause-menu.js", () => ({}));
vi.mock("../victory-screen/victory-screen.js", () => ({}));

class TestContextWrapper extends LitElement {
	static properties = {
		heroState: { type: Object },
		questState: { type: Object },
		worldState: { type: Object },
		questLoader: { type: Object },
		sessionService: { type: Object },
	};

	constructor() {
		super();
		/** @type {any} */
		this.heroState = undefined;
		/** @type {any} */
		this.questState = undefined;
		/** @type {any} */
		this.worldState = undefined;
		/** @type {any} */
		this.questLoader = undefined;
		/** @type {any} */
		this.sessionService = undefined;
	}

	connectedCallback() {
		super.connectedCallback();
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
		new ContextProvider(this, {
			context: questLoaderContext,
			initialValue: /** @type {any} */ (this.questLoader),
		});
		new ContextProvider(this, {
			context: sessionContext,
			initialValue: /** @type {any} */ (this.sessionService),
		});
	}

	render() {
		return html`<slot></slot>`;
	}
}
customElements.define("test-context-wrapper-quest", TestContextWrapper);

describe("QuestView", () => {
	/** @type {HTMLElement} */
	let container;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
		vi.spyOn(logger, "warn").mockImplementation(() => {});
	});

	afterEach(() => {
		document.body.removeChild(container);
		vi.clearAllMocks();
	});

	it("renders loading state when services are missing", async () => {
		const element = document.createElement("quest-view");
		container.appendChild(element);
		await /** @type {any} */ (element).updateComplete;

		expect(element.shadowRoot?.textContent).toContain("Loading services...");
	});

	it("renders no active quest when session has no quest", async () => {
		const wrapper = new TestContextWrapper();
		wrapper.worldState = { showDialog: new Signal.State(false) };
		wrapper.questState = { isQuestCompleted: new Signal.State(false) };
		wrapper.sessionService = { currentQuest: new Signal.State(null) };
		wrapper.heroState = {};
		wrapper.questLoader = {};

		const element = document.createElement("quest-view");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		expect(element.shadowRoot?.textContent).toContain("No active quest");
	});

	it("renders game-viewport when active quest exists", async () => {
		const wrapper = new TestContextWrapper();
		wrapper.worldState = {
			showDialog: new Signal.State(false),
			isPaused: new Signal.State(false),
			setCurrentDialogText: vi.fn(),
		};
		wrapper.questState = { isQuestCompleted: new Signal.State(false) };
		wrapper.sessionService = { currentQuest: new Signal.State({ id: "q1" }) };
		wrapper.heroState = {};
		wrapper.questLoader = {};

		const element = document.createElement("quest-view");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		const viewport = element.shadowRoot?.querySelector("game-viewport");
		expect(viewport).toBeTruthy();
	});

	it("renders victory-screen when quest is completed", async () => {
		const wrapper = new TestContextWrapper();
		wrapper.worldState = { showDialog: new Signal.State(false) };
		wrapper.questState = { isQuestCompleted: new Signal.State(true) };
		wrapper.sessionService = { currentQuest: new Signal.State({ id: "q1" }) };
		wrapper.heroState = {};
		wrapper.questLoader = {};

		const element = document.createElement("quest-view");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		const victory = element.shadowRoot?.querySelector("victory-screen");
		expect(victory).toBeTruthy();
	});

	it("renders level-dialog when showDialog is true", async () => {
		const wrapper = new TestContextWrapper();
		wrapper.worldState = {
			showDialog: new Signal.State(true),
			isPaused: new Signal.State(false),
			setCurrentDialogText: vi.fn(),
		};
		wrapper.questState = { isQuestCompleted: new Signal.State(false) };
		wrapper.sessionService = { currentQuest: new Signal.State({ id: "q1" }) };
		wrapper.heroState = {};
		wrapper.questLoader = {};

		const element = document.createElement("quest-view");
		wrapper.appendChild(element);
		container.appendChild(wrapper);

		await wrapper.updateComplete;
		await /** @type {any} */ (element).updateComplete;

		const dialog = element.shadowRoot?.querySelector("level-dialog");
		expect(dialog).toBeTruthy();
	});
});
