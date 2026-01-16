import { beforeEach, describe, expect, it, vi } from "vitest";

import { VoiceController } from "./voice-controller.js";

// Mock services as objects since we inject them
const mockVoiceSynthesisService = {
	speak: vi.fn(),
	cancel: vi.fn(),
	getBestVoice: vi.fn(),
	getSpeakingStatus: vi.fn().mockReturnValue(false),
};

const mockAIService = {
	checkAvailability: vi.fn().mockResolvedValue("no"),
	createSession: vi.fn(),
	getSession: vi.fn(),
	destroySession: vi.fn(),
	hasSession: vi.fn().mockReturnValue(false),
	destroyAllSessions: vi.fn(),
};

// We don't need to vi.mock the files if we inject the mocks directly
// unless the controller imports them directly (it shouldn't).

describe("VoiceController", () => {
	/** @type {import("lit").ReactiveControllerHost} */
	let host;
	/** @type {VoiceController} */
	let controller;
	/** @type {import("vitest").Mock} */
	let onMove;
	/** @type {import("vitest").Mock} */
	let onInteract;
	/** @type {import("vitest").Mock} */
	let onPause;
	/** @type {import("vitest").Mock} */
	let onNextSlide;
	/** @type {import("vitest").Mock} */
	let onPrevSlide;
	/** @type {import("vitest").Mock} */
	let onMoveToNpc;
	/** @type {import("vitest").Mock} */
	let onMoveToExit;
	/** @type {import("vitest").Mock} */
	let onGetDialogText;
	/** @type {import("vitest").Mock} */
	let onGetContext;
	/** @type {import("vitest").Mock} */
	let onDebugAction;
	/** @type {import("vitest").Mock} */
	let isEnabled;
	/** @type {any} */
	let options;

	beforeEach(() => {
		host = {
			addController: vi.fn(),
			removeController: vi.fn(),
			requestUpdate: vi.fn(),
			updateComplete: Promise.resolve(true),
		};
		onMove = vi.fn();
		onInteract = vi.fn();
		onPause = vi.fn();
		onNextSlide = vi.fn();
		onPrevSlide = vi.fn();
		onMoveToNpc = vi.fn();
		onMoveToExit = vi.fn();
		onGetDialogText = vi.fn().mockReturnValue("Test dialog text");
		onGetContext = vi
			.fn()
			.mockReturnValue({ isDialogOpen: false, isRewardCollected: false });
		onDebugAction = vi.fn();
		isEnabled = vi.fn().mockReturnValue(true);

		options = {
			onMove,
			onInteract,
			onPause,
			onNextSlide,
			onPrevSlide,
			onMoveToNpc,
			onMoveToExit,
			onGetDialogText,
			onGetContext,
			onDebugAction,
			isEnabled,
			language: "en-US",
			aiService: /** @type {any} */ (mockAIService),
			voiceSynthesisService: /** @type {any} */ (mockVoiceSynthesisService),
			logger: /** @type {any} */ ({
				info: vi.fn(),
				warn: vi.fn(),
				error: vi.fn(),
				debug: vi.fn(),
			}),
		};

		// Mock SpeechRecognition
		class SpeechRecognitionMock {
			constructor() {
				this.continuous = false;
				this.interimResults = false;
				this.onstart = null;
				this.onresult = null;
				this.onend = null;
				this.onerror = null;
				this.start = vi.fn();
				this.stop = vi.fn();
				this.addEventListener = vi.fn();
				this.removeEventListener = vi.fn();
				this.lang = "en-US";
			}
		}
		vi.stubGlobal("SpeechRecognition", SpeechRecognitionMock);
		vi.stubGlobal("webkitSpeechRecognition", SpeechRecognitionMock);

		// Mock speechSynthesis (still needed for voice-controller internals)
		const speechSynthesisMock = {
			speak: vi.fn(),
			cancel: vi.fn(),
			getVoices: vi.fn().mockReturnValue([]),
			onvoiceschanged: /** @type {any} */ (null),
		};
		vi.stubGlobal("speechSynthesis", speechSynthesisMock);

		function SpeechSynthesisUtteranceMock(/** @type {string} */ text) {
			this.text = text;
			this.lang = "";
			this.rate = 1;
			this.pitch = 1;
			this.onstart = null;
			this.onend = null;
			this.onerror = null;
		}
		vi.stubGlobal("SpeechSynthesisUtterance", SpeechSynthesisUtteranceMock);

		// Mock LanguageModel
		const LanguageModelMock = {
			availability: vi.fn().mockResolvedValue("unavailable"),
			create: vi.fn(),
		};
		vi.stubGlobal("LanguageModel", LanguageModelMock);

		vi.spyOn(console, "warn").mockImplementation(() => {});

		controller = new VoiceController(host, options);
	});

	it("should initialize and add controller to host", () => {
		expect(host.addController).toHaveBeenCalledWith(controller);
	});

	describe("processCommand", () => {
		it("should inject context into AI prompt", async () => {
			controller.aiSession = {
				prompt: vi.fn().mockResolvedValue("{}"),
				destroy: vi.fn(),
			};
			await controller.processCommand("next");
			expect(controller.aiSession.prompt).toHaveBeenCalledWith(
				expect.stringContaining(
					"[Context: Dialog=Closed, Reward=Not Collected]",
				),
			);
		});
	});

	describe("executeAction", () => {
		it("should handle 'move_to_npc'", () => {
			controller.executeAction("move_to_npc", null);
			expect(options.onMoveToNpc).toHaveBeenCalled();
		});

		it("should handle 'move_to_exit'", () => {
			controller.executeAction("move_to_exit", null);
			expect(options.onMoveToExit).toHaveBeenCalled();
		});

		it("should handle 'interact' and speak dialog text", async () => {
			vi.useFakeTimers();

			controller.executeAction("interact", null, "en-US");
			vi.advanceTimersByTime(400); // 400ms delay in executeAction
			expect(options.onGetDialogText).toHaveBeenCalled();
			expect(mockVoiceSynthesisService.speak).toHaveBeenCalled();
			vi.useRealTimers();
		});
	});

	describe("speak", () => {
		beforeEach(async () => {
			vi.clearAllMocks();
			mockVoiceSynthesisService.speak.mockClear();
		});

		it("should stop recognition before speaking", () => {
			const stopSpy = vi.spyOn(controller, "stop");
			controller.speak("Hello");
			expect(stopSpy).toHaveBeenCalled();
			expect(controller.isSpeaking).toBe(true);
		});

		it("should cancel synthesis if queue is false (default)", async () => {
			controller.speak("Hello");
			expect(mockVoiceSynthesisService.speak).toHaveBeenCalled();
			// Verify queue parameter is false (default)
			const callArgs = mockVoiceSynthesisService.speak.mock.calls[0];
			expect(callArgs[1].queue).toBe(false);
		});

		it("should NOT cancel synthesis if queue is true", async () => {
			controller.speak("Hello", null, "hero", true);
			expect(mockVoiceSynthesisService.speak).toHaveBeenCalled();
			// Verify queue parameter is true
			const callArgs = mockVoiceSynthesisService.speak.mock.calls[0];
			expect(callArgs[1].queue).toBe(true);
		});
	});
	// ...
	// ...
	describe("celebrateChapter", () => {
		it("should speak celebration phrase in English", async () => {
			vi.clearAllMocks();

			controller.options.language = "en-US";
			controller.celebrateChapter();

			expect(mockVoiceSynthesisService.speak).toHaveBeenCalled();
			const callArgs = /** @type {import("vitest").Mock} */ (
				mockVoiceSynthesisService.speak
			).mock.calls[0];
			const spokenText = callArgs[0];

			// Should be one of the English phrases
			expect(spokenText).toMatch(/Chapter complete|System update|Victory/);
		});

		it("should speak celebration phrase in Spanish", async () => {
			const mockLocalizationService = {
				getLocale: vi.fn().mockReturnValue("es-ES"),
			};

			// Override document lang
			const originalLang = document.documentElement.lang;
			document.documentElement.lang = "es-ES";

			// Create fresh controller with explicit options
			const localOptions = {
				...options,
				language: "es-ES",
				localizationService: /** @type {any} */ (mockLocalizationService),
			};

			// Use a fresh host object to avoid interference
			const localHost = { ...host };

			const localController = new VoiceController(localHost, localOptions);

			localController.celebrateChapter();

			// Verify that speak was called with one of the Spanish phrases and correct options
			expect(mockVoiceSynthesisService.speak).toHaveBeenCalledWith(
				expect.stringMatching(
					/Capítulo completado|Actualización del sistema|Victoria/i,
				),
				expect.objectContaining({
					lang: "es-ES",
				}),
			);

			// Restore
			document.documentElement.lang = originalLang;
		});

		it("should use correct language parameter", async () => {
			vi.clearAllMocks();

			// Mock localization service
			const mockLocalizationService = {
				getLocale: vi.fn().mockReturnValue("es-ES"),
			};
			controller.localizationService = /** @type {any} */ (
				mockLocalizationService
			);

			controller.celebrateChapter();

			const callArgs = /** @type {import("vitest").Mock} */ (
				mockVoiceSynthesisService.speak
			).mock.calls[0];
			const options = callArgs[1];

			expect(options.lang).toBe("es-ES");
		});
	});

	describe("showHelp", () => {
		it("should log help information to console", () => {
			controller.showHelp();

			expect(options.logger.info).toHaveBeenCalled();
			const loggedText = options.logger.info.mock.calls[0][0];

			expect(loggedText).toContain("VOICE COMMANDS");
			expect(loggedText).toContain("MOVE");
			expect(loggedText).toContain("APPROACH");
			expect(loggedText).toContain("DIALOGUE");
			expect(loggedText).toContain("ACTIONS");
		});

		it("should include multilingual commands", () => {
			controller.showHelp();

			const loggedText = options.logger.info.mock.calls[0][0];

			// Should include both English and Spanish
			expect(loggedText).toContain("Up/Arriba");
			expect(loggedText).toContain("Next/Siguiente");
			expect(loggedText).toContain("Interact/Interactúa");
		});
	});

	describe("Internal Logic & Callbacks", () => {
		it("should execute default callbacks cleanly", () => {
			// Create controller without overrides to test defaults
			const defaultController = new VoiceController(host, {
				aiService: /** @type {any} */ (mockAIService),
				voiceSynthesisService: /** @type {any} */ (mockVoiceSynthesisService),
				logger: /** @type {any} */ ({
					info: vi.fn(),
					warn: vi.fn(),
					error: vi.fn(),
					debug: vi.fn(),
				}),
			});
			expect(() => defaultController.options.onMove?.(0, 0)).not.toThrow();
			expect(() => defaultController.options.onInteract?.()).not.toThrow();
			expect(() => defaultController.options.onPause?.()).not.toThrow();
			expect(() => defaultController.options.onNextSlide?.()).not.toThrow();
			expect(() => defaultController.options.onPrevSlide?.()).not.toThrow();
			expect(() => defaultController.options.onMoveToNpc?.()).not.toThrow();
			expect(() => defaultController.options.onMoveToExit?.()).not.toThrow();
			expect(defaultController.options.onGetDialogText?.()).toBeUndefined();
			expect(defaultController.options.onGetContext?.()).toBeUndefined();
			expect(() =>
				defaultController.options.onDebugAction?.("test", "val"),
			).not.toThrow();
			expect(defaultController.options.isEnabled?.()).toBeUndefined();
		});

		it("should handle speech synthesis callbacks", () => {
			vi.useFakeTimers();
			const speakSpy = mockVoiceSynthesisService.speak;

			// Mock implementation to trigger callbacks
			speakSpy.mockImplementation((_text, opts) => {
				if (opts) {
					opts.onStart?.();
					opts.onEnd?.();
					opts.onError?.(/** @type {any} */ ({ error: "test-error" }));
				}
			});

			controller.enabled = true;
			controller.speak("test");

			// onStart sets isSpeaking = true
			// onEnd sets isSpeaking = false and tries to restart if enabled

			expect(speakSpy).toHaveBeenCalled();

			// Advance timers to trigger the restart timeout in onEnd
			vi.advanceTimersByTime(500);
			vi.useRealTimers();
		});

		it("should handle unstable session restarts (short duration)", () => {
			vi.useFakeTimers();
			controller.enabled = true;
			controller.isListening = true;

			// Simulate immediate end (unstable)
			controller.lastStartTime = Date.now();
			if (controller.recognition) {
				// @ts-expect-error
				controller.recognition.onend?.();
			}

			expect(controller.restartAttempts).toBeGreaterThan(0);

			vi.advanceTimersByTime(200); // Wait for backoff
			vi.useRealTimers();
		});

		it("should reset restart attempts on stable session", () => {
			vi.useFakeTimers();
			controller.enabled = true;
			controller.isListening = true;

			// Simulate stable session (>2s)
			controller.lastStartTime = Date.now() - 3000;
			if (controller.recognition) {
				// @ts-expect-error
				controller.recognition.onend?.();
			}

			expect(controller.restartAttempts).toBe(0);
			vi.useRealTimers();
		});

		it("should trigger onstart handler", () => {
			if (controller.recognition) {
				controller.recognition.onstart?.(new Event("start"));
				expect(controller.isListening).toBe(true);
			}
		});

		it("should log restart warning after multiple attempts", () => {
			vi.useFakeTimers();
			controller.enabled = true;
			controller.isListening = true;
			// Start with high attempts to trigger the > 2 branch
			controller.restartAttempts = 3;

			// Unstable session to trigger restart increment
			controller.lastStartTime = Date.now();

			if (controller.recognition) {
				// @ts-expect-error
				controller.recognition.onend?.();
			}

			expect(controller.restartAttempts).toBe(4);
			vi.useRealTimers();
		});
	});

	describe("Regression Prevention", () => {
		it("should not auto-restart when disabled", () => {
			controller.enabled = false;
			controller.isListening = true;

			// Simulate onend
			controller.recognition?.onend?.(/** @type {any} */ ({}));

			expect(controller.isListening).toBe(false);
			// Should not attempt to restart
			expect(controller.restartAttempts).toBe(0);
		});

		it("should not auto-restart when speaking", () => {
			controller.enabled = true;
			controller.isSpeaking = true;

			// Simulate onend
			controller.recognition?.onend?.(/** @type {any} */ ({}));

			// Should not attempt to restart immediately
			expect(controller.restartAttempts).toBe(0);
		});
	});
});
