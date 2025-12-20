import { beforeEach, describe, expect, it, vi } from "vitest";
import { VoiceController } from "./voice-controller.js";

describe("VoiceController", () => {
	let host;
	let options;
	let controller;

	beforeEach(() => {
		host = {
			addController: vi.fn(),
		};
		options = {
			onMove: vi.fn(),
			onInteract: vi.fn(),
			onPause: vi.fn(),
			onNextSlide: vi.fn(),
			onPrevSlide: vi.fn(),
			onMoveToNpc: vi.fn(),
			onMoveToExit: vi.fn(),
			onGetDialogText: vi.fn().mockReturnValue("Test dialog text"),
			onGetContext: vi.fn().mockReturnValue({ isDialogOpen: false, isRewardCollected: false }),
			onDebugAction: vi.fn(),
			isEnabled: vi.fn().mockReturnValue(true),
			language: "en-US",
		};

		// Mock SpeechRecognition
		function SpeechRecognitionMock() {
			this.start = vi.fn();
			this.stop = vi.fn();
			this.addEventListener = vi.fn();
			this.removeEventListener = vi.fn();
			this.lang = "en-US";
		}
		vi.stubGlobal("SpeechRecognition", SpeechRecognitionMock);
		vi.stubGlobal("webkitSpeechRecognition", SpeechRecognitionMock);

		// Mock speechSynthesis
		const speechSynthesisMock = {
			speak: vi.fn(),
			cancel: vi.fn(),
			getVoices: vi.fn().mockReturnValue([]),
			onvoiceschanged: null,
		};
		vi.stubGlobal("speechSynthesis", speechSynthesisMock);

		function SpeechSynthesisUtteranceMock(text) {
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

		controller = new VoiceController(host, options);
	});

	it("should initialize and add controller to host", () => {
		expect(host.addController).toHaveBeenCalledWith(controller);
	});



	describe("processCommand", () => {
		it("should inject context into AI prompt", async () => {
			controller.aiSession = { prompt: vi.fn().mockResolvedValue("{}") };
			await controller.processCommand("next");
			expect(controller.aiSession.prompt).toHaveBeenCalledWith(
				expect.stringContaining("[Context: Dialog=Closed, Reward=Not Collected]"),
			);
		});
	});

	describe("executeAction", () => {
		it("should handle 'move_to_npc'", () => {
			controller.executeAction("move_to_npc");
			expect(options.onMoveToNpc).toHaveBeenCalled();
		});

		it("should handle 'move_to_exit'", () => {
			controller.executeAction("move_to_exit");
			expect(options.onMoveToExit).toHaveBeenCalled();
		});

		it("should handle 'interact' and speak dialog text", () => {
			vi.useFakeTimers();
			controller.executeAction("interact");
			expect(options.onInteract).toHaveBeenCalled();
			vi.advanceTimersByTime(400); // 400ms delay in executeAction
			expect(options.onGetDialogText).toHaveBeenCalled();
			expect(window.speechSynthesis.speak).toHaveBeenCalled();
			vi.useRealTimers();
		});
	});

	describe("speak", () => {
		it("should stop recognition before speaking", () => {
			const stopSpy = vi.spyOn(controller, "stop");
			controller.speak("Hello");
			expect(stopSpy).toHaveBeenCalled();
			expect(controller.isSpeaking).toBe(true);
		});

		it("should cancel synthesis if queue is false (default)", () => {
			controller.speak("Hello");
			expect(window.speechSynthesis.cancel).toHaveBeenCalled();
		});

		it("should NOT cancel synthesis if queue is true", () => {
			controller.speak("Hello", null, "hero", true);
			expect(window.speechSynthesis.cancel).not.toHaveBeenCalled();
		});
	});

	describe("narrateDialogue", () => {
		it("should use npcSession for narration if available", async () => {
			const promptSpy = vi.fn().mockResolvedValue("Narrated text");
			controller.npcSession = { prompt: promptSpy };

			await controller.narrateDialogue("Original text");

			expect(promptSpy).toHaveBeenCalledWith(
				"Original text IMPORTANT: Reformulate this line for voice acting. Output MUST be in 'en-US'.",
			);
			// Check that it queues the speech
			// Since we mocked speak, we can't check internal call, but we can verify prompt usage
		});
	});


});
