import { ContextProvider } from "@lit/context";
import { Signal } from "@lit-labs/signals";
import { html, LitElement } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { aiContext } from "../../contexts/ai-context.js";
import { localizationContext } from "../../contexts/localization-context.js";
import { questControllerContext } from "../../contexts/quest-controller-context.js";
import { questLoaderContext } from "../../contexts/quest-loader-context.js";
import { sessionContext } from "../../contexts/session-context.js";
import { themeContext } from "../../contexts/theme-context.js";
import { voiceContext } from "../../contexts/voice-context.js";
import { heroStateContext } from "../../game/contexts/hero-context.js";
import { questStateContext } from "../../game/contexts/quest-context.js";
import { worldStateContext } from "../../game/contexts/world-context.js";
import { GameViewport } from "./GameViewport.js";
import "./game-viewport.js";

/** @typedef {import('../../game/interfaces.js').IHeroStateService} IHeroStateService */
/** @typedef {import('../../game/interfaces.js').IQuestStateService} IQuestStateService */
/** @typedef {import('../../game/interfaces.js').IWorldStateService} IWorldStateService */
/** @typedef {import('../../services/interfaces.js').IQuestController} IQuestController */
/** @typedef {import('../../services/interfaces.js').IQuestLoaderService} IQuestLoaderService */
/** @typedef {import('../../services/quest-loader-service.js').QuestLoaderService} QuestLoaderService */
/** @typedef {import('../../services/session-service.js').SessionService} SessionService */
/** @typedef {import('../../services/localization-service.js').LocalizationService} LocalizationService */
/** @typedef {import('../../services/theme-service.js').ThemeService} ThemeService */
/** @typedef {import('../../services/ai-service.js').AIService} AIService */
/** @typedef {import('../../services/voice-synthesis-service.js').VoiceSynthesisService} VoiceSynthesisService */

/**
 * Test wrapper to provide contexts
 */
class TestContextWrapper extends LitElement {
	/** @override */
	static properties = {
		heroState: { type: Object },
		questState: { type: Object },
		worldState: { type: Object },
		questController: { type: Object },
		questLoader: { type: Object },
		sessionService: { type: Object },
		localizationService: { type: Object },
		themeService: { type: Object },
		aiService: { type: Object },
		voiceSynthesisService: { type: Object },
	};

	constructor() {
		super();
		/** @type {IHeroStateService | null} */
		this.heroState = null;
		/** @type {IQuestStateService | null} */
		this.questState = null;
		/** @type {IWorldStateService | null} */
		this.worldState = null;
		/** @type {IQuestController | null} */
		this.questController = null;
		/** @type {IQuestLoaderService | null} */
		this.questLoader = null;
		/** @type {SessionService | null} */
		this.sessionService = null;
		/** @type {LocalizationService | null} */
		this.localizationService = null;
		/** @type {ThemeService | null} */
		this.themeService = null;
		/** @type {AIService | null} */
		this.aiService = null;
		/** @type {VoiceSynthesisService | null} */
		this.voiceSynthesisService = null;

		/** @type {ContextProvider<typeof heroStateContext>} */
		this.heroProvider = new ContextProvider(this, {
			context: heroStateContext,
			initialValue: /** @type {any} */ (null),
		});
		/** @type {ContextProvider<typeof questStateContext>} */
		this.questStateProvider = new ContextProvider(this, {
			context: questStateContext,
			initialValue: /** @type {any} */ (null),
		});
		/** @type {ContextProvider<typeof worldStateContext>} */
		this.worldStateProvider = new ContextProvider(this, {
			context: worldStateContext,
			initialValue: /** @type {any} */ (null),
		});
		/** @type {ContextProvider<typeof questControllerContext>} */
		this.questControllerProvider = new ContextProvider(this, {
			context: questControllerContext,
			initialValue: /** @type {any} */ (null),
		});
		/** @type {ContextProvider<typeof questLoaderContext>} */
		this.questLoaderProvider = new ContextProvider(this, {
			context: questLoaderContext,
			initialValue: /** @type {any} */ (null),
		});
		/** @type {ContextProvider<typeof sessionContext>} */
		this.sessionProvider = new ContextProvider(this, {
			context: sessionContext,
			initialValue: /** @type {any} */ (null),
		});
		/** @type {ContextProvider<typeof localizationContext>} */
		this.localizationProvider = new ContextProvider(this, {
			context: localizationContext,
			initialValue: /** @type {any} */ (null),
		});
		/** @type {ContextProvider<typeof themeContext>} */
		this.themeProvider = new ContextProvider(this, {
			context: themeContext,
			initialValue: /** @type {any} */ (null),
		});
		/** @type {ContextProvider<typeof aiContext>} */
		this.aiProvider = new ContextProvider(this, {
			context: aiContext,
			initialValue: /** @type {any} */ (null),
		});
		/** @type {ContextProvider<typeof voiceContext>} */
		this.voiceProvider = new ContextProvider(this, {
			context: voiceContext,
			initialValue: /** @type {any} */ (null),
		});
	}

	/**
	 * @param {import("lit").PropertyValues<this>} changedProperties
	 * @override
	 */
	updated(changedProperties) {
		if (changedProperties.has("heroState") && this.heroState)
			this.heroProvider.setValue(this.heroState);
		if (changedProperties.has("questState") && this.questState)
			this.questStateProvider.setValue(this.questState);
		if (changedProperties.has("worldState") && this.worldState)
			this.worldStateProvider.setValue(this.worldState);
		if (changedProperties.has("questController") && this.questController)
			this.questControllerProvider.setValue(this.questController);
		if (changedProperties.has("questLoader") && this.questLoader)
			this.questLoaderProvider.setValue(this.questLoader);
		if (changedProperties.has("sessionService") && this.sessionService)
			this.sessionProvider.setValue(this.sessionService);
		if (
			changedProperties.has("localizationService") &&
			this.localizationService
		)
			this.localizationProvider.setValue(this.localizationService);
		if (changedProperties.has("themeService") && this.themeService)
			this.themeProvider.setValue(this.themeService);
		if (changedProperties.has("aiService") && this.aiService)
			this.aiProvider.setValue(this.aiService);
		if (
			changedProperties.has("voiceSynthesisService") &&
			this.voiceSynthesisService
		)
			this.voiceProvider.setValue(this.voiceSynthesisService);
	}

	/** @override */
	render() {
		return html`<slot></slot>`;
	}
}

customElements.define("test-context-wrapper", TestContextWrapper);

describe("GameViewport", () => {
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

	/** @returns {IHeroStateService} */
	const createHeroStateMock = () => {
		const pos = new Signal.State({ x: 0, y: 0 });
		const imageSrc = new Signal.State("");
		const isEvolving = new Signal.State(false);
		const hotSwitchState = new Signal.State(
			/** @type {import('../../game/interfaces.js').HotSwitchState} */ (
				"legacy"
			),
		);

		return {
			pos,
			imageSrc,
			isEvolving,
			hotSwitchState,
			setPos: vi.fn((p) => pos.set(p)),
			setImageSrc: vi.fn((s) => imageSrc.set(s)),
			setIsEvolving: vi.fn((e) => isEvolving.set(e)),
			setHotSwitchState: vi.fn((h) => hotSwitchState.set(h)),
		};
	};

	/** @returns {IQuestStateService} */
	const createQuestStateMock = () => {
		const hasCollectedItem = new Signal.State(false);
		const isRewardCollected = new Signal.State(false);
		const isQuestCompleted = new Signal.State(false);
		const lockedMessage = new Signal.State(/** @type {string|null} */ (null));
		const currentChapterNumber = new Signal.State(1);
		const totalChapters = new Signal.State(10);
		const levelTitle = new Signal.State("Test Level");
		const questTitle = new Signal.State("Test Quest");
		const currentChapterId = new Signal.State(
			/** @type {string|null} */ (null),
		);

		return {
			hasCollectedItem,
			isRewardCollected,
			isQuestCompleted,
			lockedMessage,
			currentChapterNumber,
			totalChapters,
			levelTitle,
			questTitle,
			currentChapterId,
			setHasCollectedItem: vi.fn((v) => hasCollectedItem.set(v)),
			setIsRewardCollected: vi.fn((v) => isRewardCollected.set(v)),
			setIsQuestCompleted: vi.fn((v) => isQuestCompleted.set(v)),
			setLockedMessage: vi.fn((m) => lockedMessage.set(m)),
			setCurrentChapterNumber: vi.fn((n) => currentChapterNumber.set(n)),
			setTotalChapters: vi.fn((n) => totalChapters.set(n)),
			setLevelTitle: vi.fn((t) => levelTitle.set(t)),
			setQuestTitle: vi.fn((t) => questTitle.set(t)),
			setCurrentChapterId: vi.fn((id) => currentChapterId.set(id)),
			resetChapterState: vi.fn(),
			resetQuestState: vi.fn(),
		};
	};

	/** @returns {IWorldStateService} */
	const createWorldStateMock = () => {
		const isPaused = new Signal.State(false);
		const showDialog = new Signal.State(false);
		const currentDialogText = new Signal.State("");
		const nextDialogText = new Signal.State("");

		return {
			isPaused,
			showDialog,
			currentDialogText,
			nextDialogText,
			setPaused: vi.fn((v) => isPaused.set(v)),
			setShowDialog: vi.fn((v) => showDialog.set(v)),
			setCurrentDialogText: vi.fn((t) => currentDialogText.set(t)),
			setNextDialogText: vi.fn((t) => nextDialogText.set(t)),
		};
	};

	const setupBasicServices = (/** @type {TestContextWrapper} */ wrapper) => {
		wrapper.questController = /** @type {any} */ ({
			currentChapter: {
				id: "ch1",
				title: "Chapter 1",
				description: "Desc",
				problemTitle: "Problem",
				problemDesc: "Problem Desc",
				startPos: { x: 0, y: 0 },
			},
			options: {
				logger: {
					info: vi.fn(),
					warn: vi.fn(),
					debug: vi.fn(),
					error: vi.fn(),
				},
			},
		});
		wrapper.heroState = createHeroStateMock();
		wrapper.questState = createQuestStateMock();
		wrapper.worldState = createWorldStateMock();
		wrapper.sessionService = /** @type {any} */ ({
			isLoading: new Signal.State(false),
			isInHub: new Signal.State(false),
			currentQuest: new Signal.State(null),
		});
		wrapper.themeService = /** @type {any} */ ({
			themeMode: new Signal.State("light"),
		});
		wrapper.aiService = /** @type {any} */ ({
			isEnabled: new Signal.State(false),
			checkAvailability: vi.fn().mockResolvedValue("available"),
			createSession: vi.fn().mockResolvedValue(undefined),
			getSession: vi
				.fn()
				.mockReturnValue({ prompt: vi.fn(), destroy: vi.fn() }),
			destroySession: vi.fn(),
			getChatResponse: vi.fn(),
		});
		wrapper.voiceSynthesisService = /** @type {any} */ ({
			speak: vi.fn(),
			cancel: vi.fn(),
		});
		wrapper.localizationService = /** @type {any} */ ({
			t: (/** @type {string} */ key) => key,
			getLocale: () => "en-US",
		});
	};

	it("should render initial state correctly", async () => {
		const wrapper = new TestContextWrapper();
		container.appendChild(wrapper);
		setupBasicServices(wrapper);

		if (wrapper.questController?.currentChapter) {
			wrapper.questController.currentChapter.backgroundStyle =
				"url('/assets/default-bg.png')";
		}

		await wrapper.updateComplete;

		const element = /** @type {GameViewport} */ (
			document.createElement("game-viewport")
		);
		wrapper.appendChild(element);

		await element.updateComplete;

		expect(element.shadowRoot?.querySelector(".game-area")).toBeTruthy();
	});

	it("should initialize controllers on update when services are ready", async () => {
		const wrapper = new TestContextWrapper();
		container.appendChild(wrapper);

		const element = /** @type {any} */ (
			document.createElement("game-viewport")
		);
		wrapper.appendChild(element);

		// Initially not initialized
		expect(element._controllersInitialized).toBe(false);

		// Provide services
		setupBasicServices(wrapper);

		await wrapper.updateComplete;
		await element.updateComplete;

		expect(element._controllersInitialized).toBe(true);
		expect(element.keyboard).toBeTruthy();
	});

	it("should pass zones from current chapter to indicators", async () => {
		const wrapper = new TestContextWrapper();
		container.appendChild(wrapper);

		/** @type {import('../../services/interfaces.js').Chapter['zones']} */
		const zones = [
			/** @type {any} */ ({
				type: "THEME_CHANGE",
				x: 10,
				y: 10,
				width: 100,
				height: 100,
			}),
		];
		setupBasicServices(wrapper);
		if (wrapper.questController?.currentChapter) {
			wrapper.questController.currentChapter.zones = zones;
		}

		await wrapper.updateComplete;

		const element = /** @type {GameViewport} */ (
			document.createElement("game-viewport")
		);
		wrapper.appendChild(element);
		await element.updateComplete;

		const indicators = Array.from(
			element.shadowRoot?.querySelectorAll("game-zone-indicator") || [],
		);
		const themeIndicator = indicators.find(
			(el) => /** @type {any} */ (el).type === "THEME_CHANGE",
		);
		expect(themeIndicator).toBeTruthy();
		expect(/** @type {any} */ (themeIndicator).zones).toEqual(zones);
	});

	it("should switch to backgroundStyleReward when reward is collected", async () => {
		const wrapper = new TestContextWrapper();
		container.appendChild(wrapper);

		setupBasicServices(wrapper);
		if (wrapper.questController?.currentChapter) {
			wrapper.questController.currentChapter.backgroundStyle =
				"url('/assets/default-bg.png')";
			wrapper.questController.currentChapter.backgroundStyleReward =
				"url('/assets/reward-bg.png')";
		}

		const questState = wrapper.questState;

		await wrapper.updateComplete;

		const element = /** @type {GameViewport} */ (
			document.createElement("game-viewport")
		);
		wrapper.appendChild(element);
		await element.updateComplete;

		// Initial background
		let bg = element.shadowRoot?.querySelector(".game-area-bg");
		expect(bg?.getAttribute("src")).toContain("default-bg");

		// Collect reward
		questState?.setIsRewardCollected(true);
		await element.updateComplete;

		bg = element.shadowRoot?.querySelector(".game-area-bg");
		expect(bg?.getAttribute("src")).toContain("reward-bg");
	});

	it("should trigger reward animation when item is collected", async () => {
		const spy = vi.spyOn(GameViewport.prototype, "startRewardAnimation");

		const wrapper = new TestContextWrapper();
		container.appendChild(wrapper);
		setupBasicServices(wrapper);

		const questState = wrapper.questState;

		await wrapper.updateComplete;

		const element = /** @type {GameViewport} */ (
			document.createElement("game-viewport")
		);
		wrapper.appendChild(element);
		await element.updateComplete;

		questState?.setHasCollectedItem(true);
		await element.updateComplete;

		expect(spy).toHaveBeenCalled();
		spy.mockRestore();
	});
});
